import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { PokemonCard } from '../components/Card/PokemonCard';
import { getPokemonList } from '../services/pokemonservice';

export const HomeView = ({ onSelectPokemon }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 60;
  const sentinelRef = useRef(null);

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      setPokemonList([]);
      setOffset(0);

      // acumulador de lotes: append y evitar duplicados por name
      const onBatchLoaded = (batch) => {
        if (!Array.isArray(batch) || !batch.length) return;
        setPokemonList(prev => {
          const merged = [...prev, ...batch];
          const map = new Map();
          for (const p of merged) {
            if (!p || !p.name) continue;
            map.set(p.name, p);
          }
          return Array.from(map.values());
        });
      };

      const data = await getPokemonList(LIMIT, 0, onBatchLoaded);
      // data: { results, totalCount }
      if (data && Array.isArray(data.results) && data.results.length) {
        setPokemonList(prev => {
          const merged = [...prev, ...data.results];
          const map = new Map();
          for (const p of merged) {
            if (!p || !p.name) continue;
            map.set(p.name, p);
          }
          return Array.from(map.values());
        });
      }
      setTotalCount(Number(data?.totalCount || 0));
      setLoading(false);
    };

    loadPokemons();
  }, []);

  // computed
  const hasMore = pokemonList.length < totalCount;

  // carga adicional (paginación) usando offset
  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setLoadingMore(true);
    try {
      const data = await getPokemonList(LIMIT, nextOffset);
      if (data && Array.isArray(data.results) && data.results.length) {
        setPokemonList(prev => {
          const merged = [...prev, ...data.results];
          const map = new Map();
          for (const p of merged) {
            if (!p || !p.name) continue;
            map.set(p.name, p);
          }
          return Array.from(map.values());
        });
      }
      setTotalCount(Number(data?.totalCount || totalCount));
      setOffset(nextOffset);
    } catch (e) {
      console.error('loadMore error', e);
    } finally {
      setLoadingMore(false);
    }
  };

  // IntersectionObserver para scroll infinito
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      const ent = entries[0];
      if (ent && ent.isIntersecting && hasMore && !loadingMore && !loading) {
        loadMore();
      }
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [sentinelRef.current, hasMore, loadingMore, loading, offset, pokemonList, totalCount]);

  // Filtrado en tiempo real desde el buscador
  const filteredPokemons = (pokemonList || []).filter(p => {
    const q = searchQuery || '';
    const nameMatch = p?.name?.toLowerCase().includes(q.toLowerCase());
    const idMatch = !!(p?.id && String(p.id).includes(q));
    return nameMatch || idMatch;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950 pb-16">
      
      {/* Patrón de celdas industrial */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="max-w-350 mx-auto px-6 sm:px-10 py-8 relative z-10">
        
        {/* Cabecera optimizada */}
        <div className="mb-8 bg-[#121826] border-2 border-slate-800 p-7 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 transform rotate-45 translate-x-12 -translate-y-12"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                ROTOM-DEX OS // MAIN_MENU
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Explora el Mundo Pokémon
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Base de datos centralizada. Selecciona una unidad para desplegar su ficha técnica y parámetros de combate.
              </p>
            </div>
            
            {/* Widget de estado dinámico */}
            <div className="bg-[#1a2234] border-2 border-slate-700 px-6 py-4 rounded-2xl shadow-inner flex items-center gap-4 self-start md:self-auto">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Base de Datos</p>
                <p className="text-xs font-mono font-black text-white">
                  REGISTROS: <span className="text-amber-400">{loading ? '...' : String(totalCount).padStart(3, '0')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-amber-400 tracking-widest uppercase">CARGANDO REGISTROS DE LA POKÉAPI...</p>
          </div>
        ) : (
          /* Grid de Tarjetas */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPokemons.map((pokemon) => (
                <div key={pokemon.id || pokemon.name} onClick={() => onSelectPokemon(pokemon.name)}>
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>

            {/* sentinel para scroll infinito */}
            <div ref={sentinelRef} className="w-full h-2 mt-6" />

            {/* indicador de carga adicional */}
            {loadingMore && (
              <div className="flex items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};