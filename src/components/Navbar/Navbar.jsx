export const Navbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f1423]/95 backdrop-blur-md border-b-2 border-amber-500/30 shadow-2xl">
      <div className="w-full px-6 sm:px-10 h-20 flex items-center justify-between gap-8">
        
        {/* Logotipo */}
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950 font-black text-xl group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-lg tracking-wider uppercase">Pokédex</h1>
              <span className="text-[10px] font-mono bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full">v2.5</span>
            </div>
            <p className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest">● SYSTEM ACTIVE</p>
          </div>
        </div>

        {/* Buscador más integrado */}
        <div className="w-full max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400 font-mono text-xs font-bold">
            [🔍]
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o número (#25)..." 
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery?.(e.target.value || '')}
            className="w-full pl-12 pr-4 py-2.5 bg-[#161d31] border-2 border-slate-700/80 rounded-2xl text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all shadow-inner"
          />
        </div>

      </div>
    </header>
  );
};