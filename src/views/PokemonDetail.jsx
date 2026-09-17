import { useState, useEffect, useRef } from "react";
import { getTypeTheme, STAT_PALETTES } from "../utils/typeColors";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/i18n";
import {
  formatEvoPhrase,
  findCurrentEvolutionPath,
} from "../utils/evolutionHelper";
import {
  getCachedPokemonDetail,
  getCachedPokemonList,
} from "../utils/pokemonCache";

export const PokemonDetail = ({ pokemonName, onBack, onSelectPokemon }) => {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.en;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const abilityRefs = useRef({});
  const [movesFilter, setMovesFilter] = useState("all");

  useEffect(() => {
    if (!selectedAbility) return undefined;
    const onDocDown = (e) => {
      const el = abilityRefs.current[selectedAbility];
      if (!el) return;
      if (!el.contains(e.target)) setSelectedAbility(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedAbility(null);
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [selectedAbility]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setPokemon(null);
      try {
        if (!pokemonName) {
          if (!cancelled) setPokemon(null);
          return;
        }

        const query = String(pokemonName).toLowerCase();
        let found = null;

        // Si es un número (ID), lo busca de inmediato en la caché
        if (/^\d+$/.test(query)) {
          found = await getCachedPokemonDetail(query);
        }

        // Si no, resolvemos por nombre usando la lista cacheada sin llamadas extra a red
        if (!found) {
          const list = await getCachedPokemonList();
          const match = (list || []).find((p) => {
            const nameEs =
              typeof p?.name === "object" ? p.name.es || "" : p?.name || "";
            const nameEn =
              typeof p?.name === "object" ? p.name.en || "" : p?.name || "";
            const nameAny = String(
              nameEs || nameEn || p?.name || "",
            ).toLowerCase();
            return nameAny === query || String(p.id) === query;
          });

          if (match && match.id) {
            found = await getCachedPokemonDetail(match.id);
          }
        }

        if (!cancelled) setPokemon(found || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pokemonName, lang]);

  // statPalette is not needed here; classification uses STAT_PALETTES directly
  const lbl = (v) => {
    if (!v && v !== 0) return "";
    if (typeof v === "object") return v[lang] || v.es || v.en || "";
    return String(v);
  };

  function classifyStat(value) {
    const num = Number(value) || 0;

    if (num < 60) return STAT_PALETTES.low;
    if (num < 90) return STAT_PALETTES.regular;
    if (num < 120) return STAT_PALETTES.optimal;
    return STAT_PALETTES.elite;
  }

  const BAR_CAP = 150;

  const formatLearnMethod = (method) => {
    if (!method) return t.unknownMethod;
    const m = String(method).toLowerCase();
    const MAP = t.learnMethods || {};
    return (
      MAP[m] || m.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-amber-400 tracking-widest uppercase">
          {t.loading}
        </p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-mono text-amber-400">
          Error: {t.notRegistered}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#121826] border border-slate-700 rounded-xl text-xs font-mono text-amber-400 active:scale-95 transition-transform cursor-pointer"
        >
          {t.returnToMenu}
        </button>
      </div>
    );
  }

  // Usamos el sprite local WebP basado en el ID
  const pokemonImage = pokemon?.id ? `/sprites/${pokemon.id}.webp` : "";

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <main className="max-w-[1200px] mx-auto px-6 sm:px-10 py-8 relative z-10">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-[#121826] border-2 border-slate-700/80 rounded-xl text-xs font-mono text-amber-400 font-bold hover:bg-[#1a2234] hover:border-amber-400 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <span>←</span> {t.returnToMenu}
        </button>

        <div className="bg-[#121826] border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 transform rotate-45 translate-x-16 -translate-y-16 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                {t.rotomHeader}
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white capitalize tracking-tight">
                {lbl(pokemon.name)}
              </h2>
            </div>
            <span className="text-sm font-mono font-black tracking-wider text-slate-300 bg-[#1a2234] px-4 py-2 rounded-xl border-2 border-slate-700 shadow-inner">
              #{pokemon.id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-slate-950/70 rounded-3xl border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                {pokemonImage ? (
                  <img
                    src={pokemonImage}
                    alt={lbl(pokemon.name)}
                    width="256"
                    height="256"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-slate-500">
                    {t.noImage}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                {pokemon.types?.map((type, index) => {
                  const theme = getTypeTheme(type);
                  const typeKey = String(type).toLowerCase();
                  const typeLabel = t.types?.[typeKey] || humanizeName(type);
                  return (
                    <span
                      key={index}
                      className={`px-5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-widest border-2 font-extrabold ${theme.badge} shadow-sm`}
                    >
                      {typeLabel}
                    </span>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-[#1a2234] border border-slate-700/80 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    {t.height}
                  </p>
                  <p className="text-sm font-mono font-bold text-white mt-1">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div className="bg-[#1a2234] border border-slate-700/80 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    {t.weight}
                  </p>
                  <p className="text-sm font-mono font-bold text-white mt-1">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mt-6 bg-[#161d31] border border-slate-700/60 p-4 rounded-2xl shadow-inner">
              <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3">
                {t.weaknesses}
              </p>

              {typeof pokemon.weaknesses === "object" &&
              !Array.isArray(pokemon.weaknesses) ? (
                <div className="space-y-3">
                  {/* Debilidades Críticas (x4) */}
                  {pokemon.weaknesses.x4 &&
                    pokemon.weaknesses.x4.length > 0 && (
                      <div>
                        <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                          ⚠️ {t.weaknessX4}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {pokemon.weaknesses.x4.map((type, i) => {
                            const theme =
                              getTypeTheme(type).badge ||
                              "bg-red-950/40 border-red-500 text-red-300";
                            const typeKey = String(type).toLowerCase();
                            const typeLabel =
                              t.types?.[typeKey] || humanizeName(type);
                            return (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border font-extrabold ${theme} shadow-sm`}
                              >
                                {typeLabel} (x4)
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Debilidades Estándar (x2) */}
                  {pokemon.weaknesses.x2 &&
                    pokemon.weaknesses.x2.length > 0 && (
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          {t.weaknessX2}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {pokemon.weaknesses.x2.map((type, i) => {
                            const theme =
                              getTypeTheme(type).badge ||
                              "bg-slate-800 text-slate-300 border-slate-700";
                            const typeKey = String(type).toLowerCase();
                            const typeLabel =
                              t.types?.[typeKey] || humanizeName(type);
                            return (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border font-bold ${theme} shadow-sm`}
                              >
                                {typeLabel} (x2)
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {!pokemon.weaknesses.x4?.length &&
                    !pokemon.weaknesses.x2?.length && (
                      <p className="text-xs text-slate-500 font-mono">
                        {t.noWeaknesses}
                      </p>
                    )}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {Array.isArray(pokemon.weaknesses) &&
                  pokemon.weaknesses.length > 0 ? (
                    pokemon.weaknesses.map((weakness, i) => {
                      const theme =
                        getTypeTheme(weakness).badge ||
                        "bg-slate-800 text-slate-300 border-slate-700";
                      const typeKey = String(weakness).toLowerCase();
                      const typeLabel =
                        t.types?.[typeKey] || humanizeName(weakness);
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border font-bold ${theme} shadow-sm`}
                        >
                          {typeLabel}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">
                      {t.notRegistered}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-[#161d31] border-2 border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-inner">
              <h3 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-6 flex items-center gap-2">
                <span>⚡</span> {t.stats}
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {(pokemon.stats || []).map((stat, i) => {
                  const statValue =
                    stat.base_stat !== undefined ? stat.base_stat : stat.value;
                  const cat = classifyStat(statValue);
                  const pct = Math.min(
                    (Number(statValue) / BAR_CAP) * 100,
                    100,
                  );
                  const statLabel = stat.name || stat.stat?.name || "";
                  const statKey = String(statLabel || "").toLowerCase();
                  const statTranslated =
                    t.statsLabels?.[statKey] || statLabel.replace("-", " ");
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-slate-300 uppercase">
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{statTranslated}</span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold text-white"
                            style={{ background: cat.badgeBg }}
                          >
                            {translations[lang]?.statLevels?.[
                              cat.translationKey
                            ] ||
                              translations.en.statLevels?.[
                                cat.translationKey
                              ] ||
                              cat.translationKey}
                          </span>
                        </div>
                        <span className="font-bold text-amber-400">
                          {statValue}
                        </span>
                      </div>

                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500`}
                          style={{
                            width: `${pct}%`,
                            boxShadow: `0 8px 30px ${cat.glow}`,
                            background: `linear-gradient(90deg, ${cat.from}, ${cat.to})`,
                          }}
                        ></div>
                        <div
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{ boxShadow: `inset 0 -6px 18px ${cat.glow}` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-slate-800 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
                {t.attributesAndAbilities}
              </h4>
              <div className="bg-[#0f1624] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="text-[12px] text-slate-300">
                  {t.height}:{" "}
                  <span className="font-bold text-white">
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className="text-[12px] text-slate-300">
                  {t.weight}:{" "}
                  <span className="font-bold text-white">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">
                    // {t.abilities}
                  </p>
                  {pokemon.abilities && pokemon.abilities.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {pokemon.abilities.map((ab, i) => {
                        const keyName =
                          typeof ab.name === "object"
                            ? ab.name[lang] || ab.name.en || ab.name.es
                            : ab.name;
                        return (
                          <div
                            key={i}
                            className="relative"
                            ref={(el) => {
                              if (el) abilityRefs.current[keyName] = el;
                              else delete abilityRefs.current[keyName];
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAbility((prev) =>
                                  prev === keyName ? null : keyName,
                                )
                              }
                              className="px-3 py-1 rounded-full text-xs bg-[#121826] border border-slate-700 text-slate-200 font-mono cursor-pointer focus:outline-none"
                            >
                              <span className="capitalize">{lbl(ab.name)}</span>
                              {ab.is_hidden ? (
                                <span className="ml-2 text-amber-400 font-black text-[10px]">
                                  ({t.hiddenAbility})
                                </span>
                              ) : null}
                            </button>

                            {selectedAbility === keyName && ab.description && (
                              <div className="z-50">
                                <div className="hidden sm:block absolute left-0 top-full mt-2 w-80 p-3 bg-[#071026] border border-slate-700 rounded-lg text-xs text-slate-200 shadow-lg">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="font-mono text-[12px] font-semibold capitalize">
                                      {lbl(ab.name)}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedAbility(null)}
                                      className="text-slate-400 hover:text-white ml-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <div className="mt-2 font-mono text-[11px] leading-snug max-h-44 overflow-auto">
                                    {lbl(ab.description) || t.noDescription}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">
                      {t.notRegistered}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-800 mt-4 pt-4" />

                <div>
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">
                    // {t.moves}
                  </p>
                  {(() => {
                    const methodsSet = new Set();
                    (pokemon.moves || []).forEach((m) => {
                      const method = m.learn_method;
                      if (method) methodsSet.add(method);
                    });
                    const methods = Array.from(methodsSet).sort();
                    return (
                      <div className="mb-3">
                        <div className="flex gap-2 items-center mb-2 flex-wrap">
                          <button
                            onClick={() => setMovesFilter("all")}
                            className={`px-2 py-1 text-xs rounded-full ${movesFilter === "all" ? "bg-amber-500 text-black font-bold" : "bg-[#0b1220] text-slate-300"}`}
                          >
                            {t.all}
                          </button>
                          {methods.map((m) => (
                            <button
                              key={m}
                              onClick={() => setMovesFilter(m)}
                              className={`px-2 py-1 text-xs rounded-full ${movesFilter === m ? "bg-amber-500 text-black font-bold" : "bg-[#0b1220] text-slate-300"}`}
                            >
                              {formatLearnMethod(m)}
                            </button>
                          ))}
                        </div>

                        <div className="max-h-[36vh] overflow-auto border border-slate-800 rounded-lg bg-[#071026] p-2">
                          <div className="grid grid-cols-12 gap-2 items-center text-xs text-slate-300 font-mono px-2 py-1 border-b border-slate-800">
                            <div className="col-span-6">{t.moveColumn}</div>
                            <div className="col-span-3">{t.methodColumn}</div>
                            <div className="col-span-3 text-right">
                              {t.levelColumn}
                            </div>
                          </div>
                          {(pokemon.moves || [])
                            .filter((mv) => {
                              if (movesFilter === "all") return true;
                              return mv.learn_method === movesFilter;
                            })
                            .map((mv, idx) => {
                              const learnMethod = mv.learn_method;
                              const learnLevel = mv.level_learned_at || 0;
                              return (
                                <div
                                  key={
                                    (typeof mv.name === "object"
                                      ? mv.name[lang] ||
                                        mv.name.en ||
                                        mv.name.es
                                      : mv.name) + idx
                                  }
                                  className="grid grid-cols-12 gap-2 items-center text-xs text-slate-200 px-2 py-2 border-b border-slate-800"
                                >
                                  <div className="col-span-6 capitalize">
                                    {lbl(mv.name).replace("-", " ")}
                                  </div>
                                  <div className="col-span-3 text-slate-300">
                                    {formatLearnMethod(learnMethod)}
                                  </div>
                                  <div className="col-span-3 text-right text-amber-400">
                                    {learnLevel > 0 ? learnLevel : "-"}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h4 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
                {t.evolutions}
              </h4>
              <div className="bg-[#0f1624] border border-slate-800 rounded-2xl p-4">
                {pokemon.evolution?.paths &&
                pokemon.evolution.paths.length > 0 ? (
                  <div className="w-full overflow-x-auto space-y-3">
                    {pokemon.evolution.paths.map((pathNodes, pathIdx) => {
                      const currentName = (
                        lbl(pokemon.name) || ""
                      ).toLowerCase();

                      return (
                        <div
                          key={`path-${pathIdx}`}
                          className="flex items-center gap-4 py-3 min-w-max border-b border-slate-800/40 last:border-0"
                        >
                          {pathNodes.map((node, idx) => {
                            const nodeNameStr =
                              typeof node.species_name === "object"
                                ? node.species_name[lang] ||
                                  node.species_name.en ||
                                  node.species_name.es
                                : node.species_name || "";

                            const isCurrent =
                              String(nodeNameStr).toLowerCase() ===
                                currentName ||
                              String(node.id || "") === String(pokemon.id);

                            const displayId = node.id
                              ? `#${String(node.id).padStart(3, "0")}`
                              : "";

                            return (
                              <div
                                key={`${node.id || nodeNameStr}-${idx}`}
                                className="flex items-center gap-3"
                              >
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => {
                                    const sel = node.id
                                      ? String(node.id)
                                      : nodeNameStr
                                        ? String(nodeNameStr).toLowerCase()
                                        : null;

                                    if (sel) onSelectPokemon?.(sel);
                                  }}
                                  className="flex flex-col items-center cursor-pointer select-none"
                                >
                                  <div
                                    className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center bg-[#0b1220] border ${isCurrent ? "border-amber-400 shadow-lg shadow-amber-500/10" : "border-slate-700"} p-2 transition-all hover:border-slate-500`}
                                  >
                                    {node.image ? (
                                      <img
                                        src={
                                          typeof node.image === "string"
                                            ? node.image
                                            : node.image.front_default
                                        }
                                        alt={nodeNameStr}
                                        className="w-16 h-16 object-contain"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-16 h-16 bg-slate-900" />
                                    )}

                                    {displayId && (
                                      <div className="text-[10px] text-slate-400 mt-1">
                                        {displayId}
                                      </div>
                                    )}
                                  </div>

                                  <div
                                    className={`mt-2 text-xs capitalize ${isCurrent ? "text-amber-400 font-bold" : "text-slate-300"}`}
                                  >
                                    {nodeNameStr}
                                  </div>
                                </div>

                                {idx < pathNodes.length - 1 && (
                                  <div className="flex flex-col items-center text-xs text-slate-400">
                                    <div className="text-[11px] max-w-xs text-center">
                                      {(() => {
                                        const nextNode = pathNodes[idx + 1];
                                        const details =
                                          nextNode?.detailsFromPrev || null;

                                        const phrase = formatEvoPhrase(
                                          details,
                                          lang,
                                          t,
                                        ); // <--- Añadido lang y t

                                        return (
                                          <div className="flex flex-col items-center gap-1">
                                            <div className="text-amber-400 text-sm font-bold">
                                              →
                                            </div>
                                            <div className="mt-1">
                                              <span
                                                title={phrase}
                                                className="inline-block px-3 py-1 rounded-md text-[11px] bg-[#071026]/90 border border-slate-700 text-slate-100 max-w-xs text-center truncate"
                                              >
                                                {phrase}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    {t.noEvolutionInfo}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
