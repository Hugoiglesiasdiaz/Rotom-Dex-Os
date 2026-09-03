import { useState, useEffect, useRef } from 'react';
import { getPokemonDetail } from '../services/pokemonservice';
import { getTypeTheme, getStatPalette } from '../utils/typeColors';

export const PokemonDetail = ({ pokemonName, onBack, onSelectPokemon }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const abilityRefs = useRef({});
  const [movesFilter, setMovesFilter] = useState('all');

  // close ability panel when clicking outside or pressing Escape
  useEffect(() => {
    if (!selectedAbility) return undefined;
    const onDocDown = (e) => {
      const el = abilityRefs.current[selectedAbility];
      if (!el) return;
      if (!el.contains(e.target)) setSelectedAbility(null);
    };
    const onKey = (e) => { if (e.key === 'Escape') setSelectedAbility(null); };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedAbility]);

  // Helper: classify stat value into category and provide color info using centralized palette
  const statPalette = getStatPalette(pokemon?.types?.[0]);
  const classifyStat = (value) => {
    const v = Number(value) || 0;
    if (v < 50) return { ...statPalette.low };
    if (v < 80) return { ...statPalette.regular };
    if (v < 120) return { ...statPalette.optimal };
    return { ...statPalette.elite };
  };

  const BAR_CAP = 150; // visual cap for normalization

  // Helper: human-friendly Spanish labels for learn methods
  const formatLearnMethod = (method) => {
    if (!method) return 'desconocido';
    const m = String(method).toLowerCase();
    const MAP = {
      'level-up': 'Subida de nivel',
      'machine': 'MT/TM',
      'tutor': 'Tutor',
      'move-tutor': 'Tutor',
      'egg': 'Huevo',
      'egg-move': 'Huevo',
      'trade': 'Intercambio',
      'stadium': 'Estadio',
      'other': 'Otro'
    };
    return MAP[m] || m.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setPokemon(null); // clear stale data immediately
        const data = await getPokemonDetail(pokemonName);
        if (!mounted) return;
        setPokemon(data);
      } catch (e) {
        if (mounted) setPokemon(null);
        console.error('Error loading pokemon detail:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (pokemonName) fetchDetail();

    return () => { mounted = false; };
  }, [pokemonName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-amber-400 tracking-widest uppercase">DESPLEGANDO FICHA TÉCNICA...</p>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950 pb-16">
      
      {/* Patrón de celdas industrial */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Contenedor principal */}
      <main className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 relative z-10">
        
        {/* Botón de retorno */}
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-[#121826] border-2 border-slate-700/80 rounded-xl text-xs font-mono text-amber-400 font-bold hover:bg-[#1a2234] hover:border-amber-400 transition-all shadow-lg cursor-pointer"
        >
          <span>←</span> [ VOLVER AL MENU_PRINCIPAL ]
        </button>

        {/* Panel principal */}
        <div className="bg-[#121826] border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 transform rotate-45 translate-x-16 -translate-y-16 pointer-events-none"></div>

          {/* Cabecera de la ficha */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                ROTOM-DEX OS // SPEC_SHEET
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white capitalize tracking-tight">
                {pokemon.name}
              </h2>
            </div>
            <span className="text-sm font-mono font-black tracking-wider text-slate-300 bg-[#1a2234] px-4 py-2 rounded-xl border-2 border-slate-700 shadow-inner">
              #{pokemon.id}
            </span>
          </div>

          {/* Contenido en dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 items-center">
            
            {/* Columna Izquierda: Imagen y Atributos */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-slate-950/70 rounded-3xl border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                          {pokemon.image ? (
                            <img
                              src={pokemon.image}
                              alt={pokemon.name}
                              className="w-56 h-56 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-slate-500">No image</div>
                          )}
              </div>

              {/* Tipos */}
              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                {pokemon.types?.map((type, index) => {
                  const theme = getTypeTheme(type);
                  return (
                    <span 
                      key={index}
                      className={`px-5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-widest border-2 font-extrabold ${theme.badge} shadow-sm`}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>

              {/* Medidas físicas reales */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-[#1a2234] border border-slate-700/80 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Altura</p>
                  <p className="text-sm font-mono font-bold text-white mt-1">{pokemon.height / 10} m</p>
                </div>
                <div className="bg-[#1a2234] border border-slate-700/80 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Peso</p>
                  <p className="text-sm font-mono font-bold text-white mt-1">{pokemon.weight / 10} kg</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Estadísticas Reales */}
            <div className="lg:col-span-7 bg-[#161d31] border-2 border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-inner">
              <h3 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-6 flex items-center gap-2">
                <span>⚡</span> PARÁMETROS DE COMBATE (BASE STATS)
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {(pokemon.stats || []).map((stat, i) => {
                  const cat = classifyStat(stat.value);
                  const pct = Math.min((Number(stat.value) / BAR_CAP) * 100, 100);
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-slate-300 uppercase">
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{stat.name.replace('-', ' ')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold text-white" style={{ background: cat.badgeBg }}>{cat.label}</span>
                        </div>
                        <span className="font-bold text-amber-400">{stat.value}</span>
                      </div>

                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%`, boxShadow: `0 8px 30px ${cat.glow}`, background: `linear-gradient(90deg, ${cat.from}, ${cat.to})` }}
                        ></div>
                        {/* subtle inner glow overlay for neon effect */}
                        <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 -6px 18px ${cat.glow}` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sección inferior: Habilidades y Línea Evolutiva */}
          <div className="mt-8 border-t-2 border-slate-800 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">Atributos & Habilidades</h4>
              <div className="bg-[#0f1624] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="text-[12px] text-slate-300">Altura: <span className="font-bold text-white">{pokemon.height / 10} m</span></div>
                <div className="text-[12px] text-slate-300">Peso: <span className="font-bold text-white">{pokemon.weight / 10} kg</span></div>

                {/* Habilidades: sección independiente */}
                <div>
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">// HABILIDADES REGISTRADAS</p>
                  <div className="flex gap-2 flex-wrap">
                    {(pokemon.abilities || []).map((ab, i) => (
                      <div key={i} className="relative" ref={(el) => { if (el) abilityRefs.current[ab.name] = el; else delete abilityRefs.current[ab.name]; }}>
                        <button
                          type="button"
                          onClick={() => setSelectedAbility(prev => prev === ab.name ? null : ab.name)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedAbility(prev => prev === ab.name ? null : ab.name); } }}
                          className="px-3 py-1 rounded-full text-xs bg-[#121826] border border-slate-700 text-slate-200 font-mono cursor-pointer focus:outline-none"
                        >
                          <span className="capitalize">{ab.name}</span>
                          {ab.is_hidden ? <span className="ml-2 text-amber-400 font-black text-[10px]">(oculta)</span> : null}
                        </button>

                        {selectedAbility === ab.name && ab.description && (
                          <div className="z-50">
                            <div className="hidden sm:block absolute left-0 top-full mt-2 w-80 p-3 bg-[#071026] border border-slate-700 rounded-lg text-xs text-slate-200 shadow-lg">
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-mono text-[12px] font-semibold capitalize">{ab.name}</div>
                                <button type="button" onClick={() => setSelectedAbility(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
                              </div>
                              <div className="mt-2 font-mono text-[11px] leading-snug max-h-44 overflow-auto">{ab.description}</div>
                            </div>

                            <div className="sm:hidden fixed left-1/2 -translate-x-1/2 bottom-4 w-[min(92%,20rem)] p-3 bg-[#071026] border border-slate-700 rounded-lg text-xs text-slate-200 shadow-lg">
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-mono text-[12px] font-semibold capitalize">{ab.name}</div>
                                <button type="button" onClick={() => setSelectedAbility(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
                              </div>
                              <div className="mt-2 font-mono text-[11px] leading-snug max-h-[45vh] overflow-auto">{ab.description}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!pokemon.abilities || pokemon.abilities.length === 0) && (
                      <div className="text-xs text-slate-400">No hay datos de habilidades.</div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800 mt-4 pt-4" />

                {/* Movimientos: sección independiente */}
                <div>
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">// REPERTORIO DE MOVIMIENTOS</p>
                  {(() => {
                    const methodsSet = new Set();
                    (pokemon.moves || []).forEach(m => {
                      (m.learnDetails || []).forEach(d => { if (d.method) methodsSet.add(d.method); });
                    });
                    const methods = Array.from(methodsSet).sort();
                    return (
                      <div className="mb-3">
                        <div className="flex gap-2 items-center mb-2 flex-wrap">
                          <button onClick={() => setMovesFilter('all')} className={`px-2 py-1 text-xs rounded-full ${movesFilter==='all' ? 'bg-amber-500 text-black font-bold' : 'bg-[#0b1220] text-slate-300'}`}>Todos</button>
                          {methods.map(m => (
                            <button key={m} onClick={() => setMovesFilter(m)} className={`px-2 py-1 text-xs rounded-full ${movesFilter===m ? 'bg-amber-500 text-black font-bold' : 'bg-[#0b1220] text-slate-300'}`}>{formatLearnMethod(m)}</button>
                          ))}
                        </div>

                        <div className="max-h-[36vh] overflow-auto border border-slate-800 rounded-lg bg-[#071026] p-2">
                          <div className="grid grid-cols-12 gap-2 items-center text-xs text-slate-300 font-mono px-2 py-1 border-b border-slate-800">
                            <div className="col-span-6">Movimiento</div>
                            <div className="col-span-3">Método</div>
                            <div className="col-span-3 text-right">Nivel</div>
                          </div>
                          {(pokemon.moves || []).filter(mv => {
                            if (movesFilter === 'all') return true;
                            return (mv.learnDetails || []).some(d => d.method === movesFilter);
                          }).map((mv, idx) => {
                            const details = mv.learnDetails || [];
                            const byLevelUp = details.filter(d => d.method === 'level-up');
                            const rep = (byLevelUp.length > 0 ? byLevelUp.sort((a,b)=>b.level-a.level)[0] : details[0]) || {};
                            return (
                              <div key={mv.name + idx} className="grid grid-cols-12 gap-2 items-center text-xs text-slate-200 px-2 py-2 border-b border-slate-800">
                                <div className="col-span-6 capitalize">{mv.name.replace('-', ' ')}</div>
                                <div className="col-span-3 text-slate-300">{formatLearnMethod(rep.method)}</div>
                                <div className="col-span-3 text-right text-amber-400">{rep.level > 0 ? rep.level : '-'}</div>
                              </div>
                            );
                          })}
                          {(pokemon.moves || []).length === 0 && (
                            <div className="text-xs text-slate-400 p-3">No hay movimientos registrados.</div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>

            <div className="lg:col-span-8">
              <h4 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">Línea Evolutiva</h4>
              <div className="bg-[#0f1624] border border-slate-800 rounded-2xl p-4">
                {pokemon.evolution?.paths && pokemon.evolution.paths.length > 0 ? (
                  (() => {
                    // choose the path that contains current pokemon, else first path
                    const currentName = (pokemon.name || '').toLowerCase();
                    let chosenPath = pokemon.evolution.paths[0];
                    for (const p of pokemon.evolution.paths) {
                      if (p.some(n => (n.species_name || '').toLowerCase() === currentName)) { chosenPath = p; break; }
                    }

                    return (
                      <div className="w-full overflow-x-auto">
                        <div className="flex items-center gap-4 py-3 min-w-max">
                          {chosenPath.map((node, idx) => {
                                  const isCurrent = (String(node.species_name || '').toLowerCase() === currentName) || (String(node.id || '') === String(pokemon.id));
                                  const displayId = node.id ? `#${String(node.id).padStart(3,'0')}` : '';
                                  return (
                                    <div key={node.species_name + idx} className="flex items-center gap-3">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            const sel = node.species_name ? String(node.species_name).toLowerCase() : (node.id ? String(node.id) : null);
                                            if (sel) onSelectPokemon?.(sel);
                                          }
                                        }}
                                        onClick={() => {
                                          const sel = node.species_name ? String(node.species_name).toLowerCase() : (node.id ? String(node.id) : null);
                                          if (sel) onSelectPokemon?.(sel);
                                        }}
                                        className={`flex flex-col items-center cursor-pointer select-none`}
                                      >
                                        <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center bg-[#0b1220] border ${isCurrent ? 'border-amber-400' : 'border-slate-700'} p-2`}> 
                                                    {node.image ? (
                                                      <img src={node.image} alt={node.species_name} className="w-16 h-16 object-contain" />
                                                    ) : (
                                                      <div className="w-16 h-16 bg-slate-900" />
                                                    )}
                                          {displayId && <div className="text-[10px] text-slate-400 mt-1">{displayId}</div>}
                                        </div>
                                        <div className={`mt-2 text-xs capitalize ${isCurrent ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>{node.species_name}</div>
                                      </div>
                                {idx < chosenPath.length - 1 && (
                                  <div className="flex flex-col items-center text-xs text-slate-400">
                                    <div className="mb-1">→</div>
                                    <div className="text-[11px] max-w-xs text-center">
                                      {(() => {
                                        const nextNode = chosenPath[idx + 1];
                                        const details = nextNode.detailsFromPrev || null;
                                        if (!details) return '(método desconocido)';
                                        const d = Array.isArray(details) ? details[0] : details;
                                        const parts = [];
                                        if (d.trigger) parts.push(d.trigger + (d.min_level ? ` @ lvl ${d.min_level}` : ''));
                                        if (d.item) parts.push(`item: ${d.item}`);
                                        if (d.known_move) parts.push(`move: ${d.known_move}`);
                                        if (d.happiness) parts.push(`happiness: ${d.happiness}`);
                                        if (d.time_of_day) parts.push(d.time_of_day);
                                        return parts.join(' • ') || '(método desconocido)';
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-xs text-slate-400">No hay información evolutiva disponible.</div>
                )}
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};