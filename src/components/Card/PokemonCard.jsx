import { getTypeTheme } from '../../utils/typeColors';

export const PokemonCard = ({ pokemon }) => {
  const primaryType = (pokemon?.types && pokemon.types[0]) || 'normal';
  const theme = getTypeTheme(primaryType);

  return (
    <div className={`relative bg-linear-to-b ${theme.bg} rounded-2xl p-5 border ${theme.border} ${theme.glow} transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden backdrop-blur-md`}>
      
      {/* Esquina cortada futurista decorativa */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 transform rotate-45 translate-x-4 -translate-y-4 border-b border-l border-white/10"></div>

      {/* Cabecera de la tarjeta */}
      <div className="flex justify-between items-center z-10">
        <span className="text-xs font-mono font-black tracking-wider text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
          #{pokemon.id}
        </span>
        <div className={`w-2 h-2 rounded-full ${theme.accent} shadow-sm animate-pulse`}></div>
      </div>
      
      {/* Contenedor del Sprite con efecto visual */}
        <div className="relative my-5 w-32 h-32 mx-auto flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800/80 group-hover:scale-105 transition-transform duration-300 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-size-[8px_8px] rounded-xl"></div>
        {pokemon?.image ? (
          <img
            src={pokemon.image}
            alt={pokemon?.name || 'pokemon'}
            className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center text-slate-500">No image</div>
        )}
      </div>

      {/* Información del Pokémon */}
      <div className="text-center z-10">
        <h3 className="capitalize text-lg font-black text-white tracking-wide group-hover:text-amber-400 transition-colors drop-shadow-md">
          {pokemon.name}
        </h3>
        
        <div className="flex gap-1.5 justify-center mt-3 flex-wrap">
          {(pokemon?.types || []).map((type, index) => {
            const typeTheme = getTypeTheme(type).badge || 'bg-slate-800 text-slate-300 border-slate-700';
            return (
              <span 
                key={index} 
                className={`px-3 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest border shadow-sm ${typeTheme}`}
              >
                {type}
              </span>
            );
          })}
        </div>
      </div>

    </div>
  );
};