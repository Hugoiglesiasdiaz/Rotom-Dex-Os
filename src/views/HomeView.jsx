import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { PokemonCard } from "../components/Card/PokemonCard";
import { useLanguage } from "../context/LanguageContext";

import { translations } from "../utils/i18n";
import { getCachedPokemonList } from "../utils/pokemonCache";

export const HomeView = ({ onSelectPokemon, onOpenPokedle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const { lang } = useLanguage();
  const t = translations[lang] || translations.en;

  useEffect(() => {
    let isMounted = true;

    async function loadPokemonList() {
      setLoading(true);
      try {
        const data = await getCachedPokemonList();
        if (isMounted) {
          setPokemonList(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) setPokemonList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPokemonList();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalCount = pokemonList.length;

  const filteredPokemons = (pokemonList || []).filter((p) => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return true;

    const nameEs =
      typeof p?.name === "object"
        ? p.name.es?.toLowerCase()
        : p?.name?.toLowerCase();
    const nameEn =
      typeof p?.name === "object"
        ? p.name.en?.toLowerCase()
        : p?.name?.toLowerCase();

    const nameMatch =
      (nameEs && nameEs.includes(q)) || (nameEn && nameEn.includes(q));
    const idMatch = !!(p?.id && String(p.id).includes(q));

    return nameMatch || idMatch;
  });

  const INITIAL_VISIBLE = 151;
  const BATCH_SIZE = 100;
  const INITIAL_DELAY = 150;

  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_VISIBLE, filteredPokemons.length),
  );

  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const cancelledRef = useRef(false);
  const currentCountRef = useRef(visibleCount);

  useEffect(() => {
    cancelledRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    cancelledRef.current = false;
    const initial = Math.min(INITIAL_VISIBLE, filteredPokemons.length);
    currentCountRef.current = initial;
    setVisibleCount(initial);

    if (filteredPokemons.length <= initial) return undefined;

    const batchLoad = () => {
      const step = () => {
        if (cancelledRef.current) return;
        currentCountRef.current = Math.min(
          filteredPokemons.length,
          currentCountRef.current + BATCH_SIZE,
        );
        setVisibleCount(currentCountRef.current);

        if (currentCountRef.current < filteredPokemons.length) {
          rafRef.current = requestAnimationFrame(step);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    timerRef.current = setTimeout(() => {
      if (!cancelledRef.current) batchLoad();
    }, INITIAL_DELAY);

    return () => {
      cancelledRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery, pokemonList]);

  const pokemonToRender = filteredPokemons.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Dentro de HomeView.jsx */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPokedle={onOpenPokedle}
      />

      <main className="max-w-350 mx-auto px-6 sm:px-10 py-8 relative z-10">
        <div className="mb-8 bg-[#121826] border-2 border-slate-800 p-7 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 transform rotate-45 translate-x-12 -translate-y-12"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                {t.rotomHeader}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {t.mainHeaderTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                {t.mainHeaderSubtitle}
              </p>

              {/* Botón para abrir el Pokedle */}
              {onOpenPokedle && (
                <div className="mt-5">
                  <button
                    onClick={onOpenPokedle}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 text-xs font-mono"
                  >
                    <span className="text-base">🎯</span>
                    <span>
                      {lang === "es"
                        ? "JUGAR PÓKEDLE DIARIO"
                        : "PLAY DAILY POKEDLE"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#1a2234] border-2 border-slate-700 px-6 py-4 rounded-2xl shadow-inner flex items-center gap-4 self-start md:self-auto">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  {t.databaseLabel}
                </p>
                <p className="text-xs font-mono font-black text-white">
                  {t.recordsLabel}{" "}
                  <span className="text-amber-400">
                    {String(totalCount).padStart(3, "0")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemonToRender.map((pokemon) => (
              <div key={pokemon.id} onClick={() => onSelectPokemon(pokemon.id)}>
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
