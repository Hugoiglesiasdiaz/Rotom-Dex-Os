// pokemonservice.js
// Servicio centralizado para obtener pokémones con estrategia híbrida (carga inicial rápida + paginación bajo demanda)
// Devuelve la forma { results: [...summaries], totalCount: number } en `getPokemonList`.

const API_BASE = 'https://pokeapi.co/api/v2';
const POKEMON_SUMMARY_PREFIX = 'rotom_dex_summary_'; // lightweight cached summaries
const POKEMON_CACHE_PREFIX = 'rotom_dex_pokemon_'; // full record cache
const SPECIES_CACHE_PREFIX = 'rotom_dex_species_';
const EVO_CACHE_PREFIX = 'rotom_dex_evo_';
const ABILITY_CACHE_PREFIX = 'rotom_dex_ability_';
const LIST_OFFSET_PREFIX = 'pokemon_list_offset_'; // page-level list cache by offset

const normalizeKey = (k) => String(k).toLowerCase();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  return res.json();
}

// safe sessionStorage helpers for module use
function safeGetRaw(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    try { sessionStorage.removeItem(key); } catch (_) {}
    return null;
  }
}

function safeSetRaw(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
}

function bestImageFromDetails(d) {
  try {
    if (!d || !d.sprites) return null;
    const art = d.sprites.other && d.sprites.other['official-artwork'] && d.sprites.other['official-artwork'].front_default;
    const front = d.sprites.front_default;
    if (art && String(art).trim()) return art;
    if (front && String(front).trim()) return front;
    return null;
  } catch (e) { return null; }
}

// Map items in chunks to limit concurrency and avoid overwhelming the API
async function chunkedMap(items, fn, chunkSize = 8) {
  const out = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    // run chunk with Promise.all but guard each invocation to avoid a single rejection
    const wrapped = chunk.map(async (it) => {
      try { return await fn(it); } catch (e) { return null; }
    });
    const results = await Promise.all(wrapped);
    out.push(...results.filter(r => r !== null));
  }
  return out;
}

// Returns a full pokemon record (cached when possible)
export async function getPokemonDetail(nameOrId) {
  console.log('[pokemonservice] getPokemonDetail called with:', { nameOrId });
  if (!nameOrId) {
    console.warn('[pokemonservice] getPokemonDetail called with empty nameOrId');
    return null;
  }

  const tryKey = normalizeKey(nameOrId);
  const tryKeys = [tryKey];
  const numeric = Number(String(nameOrId).replace(/^0+/, ''));
  if (!Number.isNaN(numeric)) { tryKeys.push(String(numeric), String(numeric).padStart(3, '0')); }

  // Safe sessionStorage read helper
  const safeGet = (key) => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      try { sessionStorage.removeItem(key); } catch (_) {}
      return null;
    }
  };

  for (const k of tryKeys) {
    const cacheKey = `${POKEMON_CACHE_PREFIX}${k}`;
    const cached = safeGet(cacheKey);
    if (cached && cached.stats && cached.abilities) {
      console.log('[pokemonservice] getPokemonDetail -> cache HIT for', cacheKey);
      return cached;
    }
    console.log('[pokemonservice] getPokemonDetail -> cache MISS for', cacheKey);
  }

  try {
    // fetch base details, validate response in fetchJson
    console.log('[pokemonservice] getPokemonDetail -> fetching details from', `${API_BASE}/pokemon/${encodeURIComponent(nameOrId)}`);
    const details = await fetchJson(`${API_BASE}/pokemon/${encodeURIComponent(nameOrId)}`);
    console.log('[pokemonservice] getPokemonDetail -> fetched details', { id: details?.id, name: details?.name });
    const id = details.id;
    const record = {
      id: String(id).padStart(3, '0'),
      name: details.name,
      image: bestImageFromDetails(details),
      types: Array.isArray(details.types) ? details.types.map(t => t.type.name) : [],
      height: details.height ?? 0,
      weight: details.weight ?? 0,
      stats: Array.isArray(details.stats) ? details.stats.map(s => ({ name: s.stat.name, value: s.base_stat })) : [],
      abilities: Array.isArray(details.abilities) ? details.abilities.map(a => ({ name: a.ability?.name || null, is_hidden: !!a.is_hidden, slot: a.slot })) : [],
      moves: Array.isArray(details.moves) ? details.moves.map(m => ({ name: m.move?.name || null, learnDetails: Array.isArray(m.version_group_details) ? m.version_group_details.map(d => ({ method: d.move_learn_method?.name || null, level: d.level_learned_at ?? 0, version_group: d.version_group?.name || null })) : [] })) : []
    };

    // abilities descriptions (cached, but fail-safe)
    for (let i = 0; i < record.abilities.length; i++) {
      const ab = record.abilities[i];
      if (!ab || !ab.name) continue;
      const abKey = `${ABILITY_CACHE_PREFIX}${normalizeKey(ab.name)}`;
      console.log('[pokemonservice] getPokemonDetail -> ability check', { ability: ab.name, abKey });
      const cachedAb = safeGet(abKey);
      if (cachedAb && cachedAb.description) { console.log('[pokemonservice] getPokemonDetail -> ability cache HIT', ab.name); record.abilities[i].description = cachedAb.description; continue; }
      console.log('[pokemonservice] getPokemonDetail -> ability cache MISS', ab.name);
      try {
        const abJson = await fetchJson(`${API_BASE}/ability/${encodeURIComponent(ab.name)}`);
        const entries = Array.isArray(abJson.effect_entries) ? abJson.effect_entries : [];
        const effectEntry = entries.find(e => e.language?.name === 'es') || entries.find(e => e.language?.name === 'en') || entries.find(e => e.effect || e.short_effect);
        const desc = effectEntry ? (effectEntry.effect || effectEntry.short_effect || '') : '';
        record.abilities[i].description = desc ? String(desc).replace(/\s+/g, ' ').trim() : '';
        try { sessionStorage.setItem(abKey, JSON.stringify({ description: record.abilities[i].description })); } catch (_) {}
      } catch (e) {
        // ignore ability fetch errors; continue
      }
    }

    // species/evolution (best-effort)
    try {
      if (details.species?.url) {
        const speciesKey = normalizeKey(details.species.url);
        let speciesData = safeGet(`${SPECIES_CACHE_PREFIX}${speciesKey}`);
        if (!speciesData) {
          try { speciesData = await fetchJson(details.species.url); try { sessionStorage.setItem(`${SPECIES_CACHE_PREFIX}${speciesKey}`, JSON.stringify(speciesData)); } catch (_) {} } catch (_) { speciesData = null; }
        }
        const evoUrl = speciesData?.evolution_chain?.url;
        if (evoUrl) {
          const evoKey = normalizeKey(evoUrl);
          let evoData = safeGet(`${EVO_CACHE_PREFIX}${evoKey}`);
          if (!evoData) {
            try {
              const evoJson = await fetchJson(evoUrl);
              const buildPaths = (node, detailsFromPrev = null) => {
                const curr = { species_name: node.species?.name || null, detailsFromPrev };
                if (!node.evolves_to || node.evolves_to.length === 0) return [[curr]];
                const paths = [];
                for (const child of node.evolves_to) {
                  const raw = Array.isArray(child.evolution_details) ? child.evolution_details : [];
                  const childDetails = raw.length > 0 ? raw.map(d => ({
                    min_level: d.min_level ?? null,
                    trigger: d.trigger?.name ?? null,
                    // prefer held_item (e.g. Happiny) falling back to item
                    item: d.held_item?.name ?? d.item?.name ?? null,
                    held_item: d.held_item?.name ?? null,
                    known_move: d.known_move?.name ?? null,
                    time_of_day: d.time_of_day || null,
                    min_happiness: d.min_happiness ?? null,
                    min_affection: d.min_affection ?? null,
                    gender: d.gender ?? null,
                    location: d.location?.name ?? null,
                    needs_overworld_rain: d.needs_overworld_rain ?? null,
                    relative_physical_stats: d.relative_physical_stats ?? null
                  })) : [];
                  const childPaths = buildPaths(child, childDetails.length > 0 ? childDetails : null);
                  for (const p of childPaths) paths.push([curr, ...p]);
                }
                return paths;
              };
              const rawPaths = evoJson?.chain ? buildPaths(evoJson.chain) : [];
              const enriched = [];
              for (const p of rawPaths) {
                const arr = [];
                for (const nodeItem of p) {
                  try { const meta = await fetchJson(`${API_BASE}/pokemon/${encodeURIComponent(nodeItem.species_name)}`); arr.push({ ...nodeItem, id: meta.id ?? null, image: bestImageFromDetails(meta) }); } catch { arr.push({ ...nodeItem, id: null, image: null }); }
                }
                enriched.push(arr);
              }
              evoData = { url: evoUrl, paths: enriched };
              try { sessionStorage.setItem(`${EVO_CACHE_PREFIX}${evoKey}`, JSON.stringify(evoData)); } catch (_) {}
            } catch (_) {
              evoData = null;
            }
          }
          if (evoData) record.evolution = evoData;
        }
      }
    } catch (_) { /* ignore species/evo errors */ }

    // Cache full record (best-effort)
    try { sessionStorage.setItem(`${POKEMON_CACHE_PREFIX}${normalizeKey(record.name)}`, JSON.stringify(record)); console.log('[pokemonservice] getPokemonDetail -> cached record by name', record.name); } catch (e) { console.warn('[pokemonservice] getPokemonDetail -> failed caching by name', e); }
    try { sessionStorage.setItem(`${POKEMON_CACHE_PREFIX}${normalizeKey(record.id)}`, JSON.stringify(record)); console.log('[pokemonservice] getPokemonDetail -> cached record by id', record.id); } catch (e) { console.warn('[pokemonservice] getPokemonDetail -> failed caching by id', e); }

    return record;
  } catch (err) {
    console.error('[pokemonservice] getPokemonDetail error', err);
    return null;
  }
}

// getPokemonList: returns { results: [...summaries], totalCount }
// initialLimit: how many to fetch in this call; offset for pagination; onBatchLoaded optional for progressive UI updates
export async function getPokemonList(initialLimit = 60, offset = 0, onBatchLoaded) {
  console.log('[pokemonservice] getPokemonList called with', { initialLimit, offset });
  // check page-level cache first
  try {
    const cachedPage = safeGetRaw(`${LIST_OFFSET_PREFIX}${offset}`);
    if (cachedPage && Array.isArray(cachedPage.results)) {
      console.log('[pokemonservice] getPokemonList -> returning cached page', { offset, cachedLen: cachedPage.results.length });
      if (onBatchLoaded && typeof onBatchLoaded === 'function') onBatchLoaded(cachedPage.results);
      return { results: cachedPage.results, totalCount: Number(cachedPage.totalCount || 0) };
    }
  } catch (e) {
    /* ignore cache parse errors */
  }
  // Simpler, stable implementation: fetch page and resolve lightweight summaries.
  try {
    console.log('[pokemonservice] getPokemonList -> fetching list', `${API_BASE}/pokemon?limit=${initialLimit}&offset=${offset}`);
    const res = await fetch(`${API_BASE}/pokemon?limit=${initialLimit}&offset=${offset}`);
    console.log('[pokemonservice] getPokemonList -> list response', { ok: res.ok, status: res.status });
    if (!res.ok) throw new Error(`List fetch failed: ${res.status}`);
    const list = await res.json();
    const totalCount = Number(list.count || 0);
    const refs = Array.isArray(list.results) ? list.results : [];

    const summaries = [];
    // process in small batches to avoid too many parallel fetches
    const batchSize = 8;
    console.log('[pokemonservice] getPokemonList -> total refs to process in this page:', refs.length);
    for (let i = 0; i < refs.length; i += batchSize) {
      const batch = refs.slice(i, i + batchSize);
      console.log(`[pokemonservice] getPokemonList -> processing batch ${i / batchSize + 1} (items ${i}-${i + batch.length - 1}) size=${batch.length}`);
      const settled = await Promise.all(batch.map(async (p, idx) => {
        const name = p.name;
        const idFromUrl = (() => { try { const parts = p.url.split('/').filter(Boolean); return Number(parts[parts.length - 1]); } catch { return null; } })();
        console.log('[pokemonservice] getPokemonList -> processing item', { index: i + idx, name, url: p.url });

        // try cache
        const keys = [normalizeKey(name)];
        if (idFromUrl) keys.push(String(idFromUrl), String(idFromUrl).padStart(3, '0'));
        for (const k of keys) {
          const cacheKey = `${POKEMON_SUMMARY_PREFIX}${k}`;
          try {
            const raw = sessionStorage.getItem(cacheKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              console.log('[pokemonservice] getPokemonList -> summary cache HIT', cacheKey);
              return parsed;
            }
          } catch (e) {
            console.warn('[pokemonservice] getPokemonList -> invalid cache entry, removing', cacheKey, e);
            try { sessionStorage.removeItem(cacheKey); } catch (_) {}
          }
        }

        try {
          console.log('[pokemonservice] getPokemonList -> fetching detail for', name, p.url);
          const dres = await fetch(p.url);
          console.log('[pokemonservice] getPokemonList -> detail response', { name, ok: dres.ok, status: dres.status });
          if (!dres.ok) throw new Error(`detail fetch failed: ${dres.status}`);
          const details = await dres.json();
          const id = details.id ?? idFromUrl ?? null;
          const summary = {
            id: id ? String(id).padStart(3, '0') : null,
            name,
            image: bestImageFromDetails(details) || (id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : null),
            types: Array.isArray(details.types) ? details.types.map(t => t.type.name) : []
          };
          try { sessionStorage.setItem(`${POKEMON_SUMMARY_PREFIX}${normalizeKey(summary.name)}`, JSON.stringify(summary)); } catch (e) { console.warn('[pokemonservice] getPokemonList -> failed to cache summary', e); }
          if (summary.id) try { sessionStorage.setItem(`${POKEMON_SUMMARY_PREFIX}${String(Number(summary.id))}`, JSON.stringify(summary)); } catch (e) { console.warn('[pokemonservice] getPokemonList -> failed to cache summary by id', e); }
          return summary;
        } catch (e) {
          console.error('[pokemonservice] getPokemonList -> failed to fetch detail for', name, e);
          return { id: idFromUrl ? String(idFromUrl).padStart(3, '0') : null, name, image: null, types: [] };
        }
      }));

      for (const s of settled) if (s) summaries.push(s);
      console.log('[pokemonservice] getPokemonList -> batch processed, accumulated summaries=', summaries.length);
    }

    if (onBatchLoaded && typeof onBatchLoaded === 'function') onBatchLoaded(summaries);
    // persist page-level cache to speed up subsequent accesses
    try { safeSetRaw(`${LIST_OFFSET_PREFIX}${offset}`, { results: summaries, totalCount }); } catch (_) {}
    console.log('[pokemonservice] getPokemonList -> returning', { results: summaries.length, totalCount });
    return { results: summaries, totalCount };
  } catch (e) {
    console.error('[pokemonservice] getPokemonList error', e);
    return { results: [], totalCount: 0 };
  }
}

export async function loadMorePokemons(offset = 0, limit = 60, onBatchLoaded) {
  console.log('[pokemonservice] loadMorePokemons called with', { offset, limit });
  return getPokemonList(limit, offset, onBatchLoaded);
}

// Preload remaining pokemon list pages in background (silent, non-blocking)
export async function preloadRemainingPokemon(currentOffset = 60, totalPokemon = 1025, batchSize = 150, onBatchLoaded) {
  console.log('[pokemonservice] preloadRemainingPokemon starting', { currentOffset, totalPokemon, batchSize });
  // iterate by batches, check page cache before fetching
  for (let off = currentOffset; off < totalPokemon; off += batchSize) {
    try {
      const pageKey = `${LIST_OFFSET_PREFIX}${off}`;
      const cached = safeGetRaw(pageKey);
      if (cached && Array.isArray(cached.results) && cached.results.length > 0) {
        console.log('[pokemonservice] preload -> page already cached', { off });
        continue;
      }

      // fetch quietly using existing getPokemonList which will cache per-item and we also save page cache below
      console.log('[pokemonservice] preload -> fetching page', { off, batchSize });
      const data = await getPokemonList(batchSize, off);
      if (data && Array.isArray(data.results) && data.results.length) {
        try { safeSetRaw(pageKey, { results: data.results, totalCount: data.totalCount }); } catch (_) {}
        console.log('[pokemonservice] preload -> cached page', { off, count: data.results.length });
        // notify consumer if provided (pass new block and totalCount)
        try {
          if (typeof onBatchLoaded === 'function') onBatchLoaded(data.results, data.totalCount);
        } catch (e) { console.warn('[pokemonservice] preload -> onBatchLoaded callback error', e); }
      }

      // small delay between batches to be polite
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.warn('[pokemonservice] preload -> network or processing error, stopping preload silently', e);
      break; // stop on error, do not propagate
    }
  }
  console.log('[pokemonservice] preloadRemainingPokemon finished');
}

export default { getPokemonList, loadMorePokemons, getPokemonDetail, preloadRemainingPokemon };