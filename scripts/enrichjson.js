import fs from "fs";
import path from "path";
import { REGIONAL_EVOLUTION_OVERRIDES } from "./evolutionOverrides.js";

const typeChart = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
};

const learnMethodTranslations = {
  egg: "Huevo",
  machine: "MT / MO (Máquina)",
  tutor: "Tutor",
  "level-up": "Subida de nivel",
  "light-ball-egg": "Huevo (Bola Luminosa)",
  "colosseum-purification": "Purificación (Colosseum)",
  "xd-shadow": "Sombra (XD)",
  "xd-purification": "Purificación (XD)",
  "form-change": "Cambio de forma",
};

const ES_TEXT_PLACEHOLDERS = [
  "sin descripcion disponible",
  "sin descripción disponible",
  "descripcion no disponible",
  "descripción no disponible",
  "no description available",
  "no hay descripción disponible",
  "no se dispone de descripción",
  "description unavailable",
];

const moveCache = new Map();

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function ensureBilingual(value, fallback = {}) {
  if (value === null || value === undefined) {
    return { es: "", en: "" };
  }

  if (typeof value === "string") {
    const text = normalizeText(value);
    return {
      es: text || normalizeText(fallback.es || ""),
      en: text || normalizeText(fallback.en || ""),
    };
  }

  if (Array.isArray(value)) {
    return ensureBilingual(value[0] ?? fallback, fallback);
  }

  if (typeof value === "object") {
    const es = normalizeText(value.es ?? value.sp ?? value.spanish ?? "");
    const en = normalizeText(value.en ?? value.eng ?? value.english ?? "");
    return {
      es: es || normalizeText(fallback.es || ""),
      en: en || normalizeText(fallback.en || ""),
    };
  }

  const text = normalizeText(String(value));
  return {
    es: text || normalizeText(fallback.es || ""),
    en: text || normalizeText(fallback.en || ""),
  };
}

function isValidEsText(value) {
  if (value === null || value === undefined) return false;
  const text = normalizeText(value);
  if (!text) return false;

  const normalized = text.toLowerCase();
  const isPlaceholder = ES_TEXT_PLACEHOLDERS.some((placeholder) =>
    normalized.includes(placeholder),
  );

  return !isPlaceholder;
}

function coalesceValidEs(...candidates) {
  for (const candidate of candidates) {
    if (isValidEsText(candidate)) {
      return normalizeText(candidate);
    }
  }
  return "";
}

function coalesceValidEn(...candidates) {
  for (const candidate of candidates) {
    const text = normalizeText(candidate);
    if (text) {
      return text;
    }
  }
  return "";
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function calculatePokemonWeaknesses(pokemonTypes) {
  const allTypes = Object.keys(typeChart);
  const multipliers = {};

  for (const attackType of allTypes) {
    let totalMultiplier = 1;
    for (const defType of pokemonTypes || []) {
      const defenseMap = typeChart[attackType];
      if (defenseMap && defenseMap[defType] !== undefined) {
        totalMultiplier *= defenseMap[defType];
      }
    }
    multipliers[attackType] = totalMultiplier;
  }

  const weaknesses = { x4: [], x2: [] };
  for (const [type, multiplier] of Object.entries(multipliers)) {
    if (multiplier === 4) weaknesses.x4.push(type);
    else if (multiplier === 2) weaknesses.x2.push(type);
  }

  return weaknesses;
}

async function buildEvolutionPathsForPokemon(speciesData, pokemonName, localEvolutionPaths = []) {
  // 1. PRIORIDAD ABSOLUTA: El override regional (evita que la API devuelva IDs/imágenes incorrectos)
  const override = REGIONAL_EVOLUTION_OVERRIDES?.[pokemonName];
  if (override && Array.isArray(override.paths) && override.paths.length > 0) {
    console.log(`✨ Aplicando override de evolución (IDs correctos) para: ${pokemonName}`);
    return override.paths;
  }

  // 2. SEGUNDA OPCIÓN: Rutas ya definidas en el JSON local
  if (Array.isArray(localEvolutionPaths) && localEvolutionPaths.length > 0) {
    console.log(`📌 Manteniendo ruta evolutiva local para: ${pokemonName}`);
    return localEvolutionPaths;
  }

  // 3. FALLBACK: Consultar PokéAPI para Pokémon estándar
  if (!speciesData?.evolution_chain?.url) {
    return [];
  }

  const chainData = await fetchJson(speciesData.evolution_chain.url);
  const paths = [];

  function parseChain(node, currentPath = []) {
    const currentId = node.species?.url
      ?.split("/")
      .filter(Boolean)
      .pop();

    const item = {
      species_name: node.species?.name ?? null,
      id: currentId ?? null,
      image: currentId ? `/sprites/${currentId}.webp` : null,
      detailsFromPrev: Array.isArray(node.evolution_details) ? node.evolution_details[0] ?? null : null,
    };

    const nextPath = [...currentPath, item];

    if (!Array.isArray(node.evolves_to) || node.evolves_to.length === 0) {
      paths.push(nextPath);
      return;
    }

    for (const nextNode of node.evolves_to) {
      parseChain(nextNode, nextPath);
    }
  }

  if (chainData?.chain) {
    parseChain(chainData.chain);
  }

  return paths;
}

async function enrichPokemonData() {
  const projectRoot = process.cwd();
  const inputPath = path.resolve(projectRoot, "../src/data/pokemonFullData.json");
  const outputPath = path.resolve(projectRoot, "../src/data/pokemonFullData.json");

  if (!fs.existsSync(inputPath)) {
    throw new Error(`No existe el archivo base: ${inputPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const enrichedList = [];

  for (const pokemon of rawData) {
    const existingName = ensureBilingual(
      typeof pokemon.name === "object" ? pokemon.name : { es: pokemon.name, en: pokemon.name },
    );
    const displayName = existingName.es || existingName.en || pokemon.name || `#${pokemon.id}`;
    console.log(`Procesando a #${pokemon.id} - ${displayName}...`);

    let data;
    try {
      data = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
    } catch (error) {
      console.warn(`No se pudo consultar PokéAPI para #${pokemon.id}:`, error.message);
      continue;
    }

    const abilities = [];
    for (const abilityInfo of data.abilities || []) {
      const abilityUrl = abilityInfo?.ability?.url;
      if (!abilityUrl) continue;

      let abilityData;
      try {
        abilityData = await fetchJson(abilityUrl);
      } catch (error) {
        console.warn(`No se pudo obtener la habilidad ${abilityInfo.ability?.name ?? "desconocida"}:`, error.message);
        continue;
      }

      const apiNameEs = abilityData.names?.find((entry) => entry.language?.name === "es")?.name ?? "";
      const apiNameEn = abilityData.names?.find((entry) => entry.language?.name === "en")?.name ?? abilityInfo.ability?.name ?? "";

      const entryEs = abilityData.effect_entries?.find((entry) => entry.language?.name === "es") ?? null;
      const entryEn = abilityData.effect_entries?.find((entry) => entry.language?.name === "en") ?? null;

      const existingAbility = Array.isArray(pokemon.abilities)
        ? pokemon.abilities.find((ability) => {
            const currentName = ensureBilingual(ability?.name ?? {});
            const nameMatches = !!(
              (currentName.en && currentName.en.toLowerCase() === apiNameEn.toLowerCase()) ||
              (currentName.es && currentName.es.toLowerCase() === apiNameEs.toLowerCase()) ||
              (abilityInfo.ability?.name && currentName.en && currentName.en.toLowerCase() === abilityInfo.ability.name.toLowerCase())
            );
            return nameMatches;
          })
        : null;

      const existingName = ensureBilingual(existingAbility?.name ?? {});
      const existingDescription = ensureBilingual(existingAbility?.description ?? {});

      const finalNameEs = coalesceValidEs(apiNameEs, existingName.es, abilityInfo.ability?.name ?? "") || abilityInfo.ability?.name || "";
      const finalNameEn = coalesceValidEn(apiNameEn, existingName.en, abilityInfo.ability?.name ?? "") || abilityInfo.ability?.name || "";
      const finalDescEs = coalesceValidEs(
        entryEs?.effect || entryEs?.short_effect || "",
        existingDescription.es,
      ) || "Sin descripción disponible.";
      const finalDescEn = coalesceValidEn(
        entryEn?.effect || entryEn?.short_effect || "",
        existingDescription.en,
      ) || "No description available.";

      abilities.push({
        is_hidden: Boolean(abilityInfo.is_hidden),
        name: { es: finalNameEs, en: finalNameEn },
        description: {
          es: finalDescEs,
          en: finalDescEn,
        },
      });
    }

    let speciesData;
    try {
      speciesData = await fetchJson(data.species.url);
    } catch (error) {
      console.warn(`No se pudo consultar la especie de #${pokemon.id}:`, error.message);
      speciesData = {};
    }

    const apiNameEs = speciesData.names?.find((entry) => entry.language?.name === "es")?.name ?? "";
    const apiNameEn = speciesData.names?.find((entry) => entry.language?.name === "en")?.name ?? "";
    const finalPokemonNameEs = coalesceValidEs(apiNameEs, existingName.es, pokemon.name ?? "");
    const finalPokemonNameEn = coalesceValidEn(apiNameEn, existingName.en, pokemon.name ?? "");

    const moves = [];
    for (const moveEntry of data.moves || []) {
      const moveKey = moveEntry?.move?.name ?? "unknown";
      if (!moveCache.has(moveKey)) {
        try {
          const moveData = await fetchJson(moveEntry.move.url);
          const esName = moveData.names?.find((entry) => entry.language?.name === "es")?.name ?? moveKey;
          const enName = moveData.names?.find((entry) => entry.language?.name === "en")?.name ?? moveKey;
          moveCache.set(moveKey, { es: esName, en: enName });
        } catch (error) {
          console.warn(`No se pudo resolver el movimiento ${moveKey}:`, error.message);
          moveCache.set(moveKey, { es: moveKey, en: moveKey });
        }
      }

      const resolvedMove = moveCache.get(moveKey) ?? { es: moveKey, en: moveKey };
      const originalMethod = moveEntry.version_group_details?.[0]?.move_learn_method?.name ?? "desconocido";

      moves.push({
        name: ensureBilingual({ es: resolvedMove.es ?? moveKey, en: resolvedMove.en ?? moveKey }),
        level_learned_at: moveEntry.version_group_details?.[0]?.level_learned_at ?? 0,
        learn_method: learnMethodTranslations[originalMethod] || originalMethod,
      });
    }

    const localEvolutionPaths = Array.isArray(pokemon?.evolution?.paths)
      ? pokemon.evolution.paths
      : [];
    const evolutionPaths = await buildEvolutionPathsForPokemon(
      speciesData,
      data.name,
      localEvolutionPaths,
    );
    const weaknesses = calculatePokemonWeaknesses(pokemon.types || []);

    enrichedList.push({
      ...pokemon,
      name: {
        es: finalPokemonNameEs,
        en: finalPokemonNameEn,
      },
      abilities,
      moves,
      evolution: { paths: evolutionPaths },
      weaknesses,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  fs.writeFileSync(outputPath, JSON.stringify(enrichedList, null, 2));
  console.log("¡Proceso finalizado! Base de datos completamente traducida, estructurada y parcheada.");
}

enrichPokemonData();
