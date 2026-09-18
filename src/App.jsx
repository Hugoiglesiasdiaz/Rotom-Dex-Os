import { useState, useEffect, useCallback, startTransition } from 'react';
import { HomeView } from './views/HomeView';
import { PokemonDetail } from './views/PokemonDetail';
import { PokedleView } from './views/PokedleView';
import { Navbar } from './components/Navbar/Navbar'; // <--- Asegúrate de importar Navbar aquí si la renderizas en App, o pásala a las vistas

export default function App() {
  const parseHash = () => {
    try {
      const h = (window.location.hash || '').replace('#/', '').replace(/^\/+/, '');
      if (!h) return null;
      const parts = h.split('/');
      if (parts[0] === 'pokemon' && parts[1]) return { type: 'pokemon', value: String(parts[1]).toLowerCase() };
      if (parts[0] === 'pokedle') return { type: 'pokedle' };
      return null;
    } catch {
      return null;
    }
  };

  const [currentRoute, setCurrentRoute] = useState(() => parseHash());

  const pushView = useCallback((route) => {
    try {
      if (!route) {
        window.history.pushState({ page: 'home' }, '', '#/');
      } else if (route.type === 'pokemon') {
        const url = `#/pokemon/${encodeURIComponent(route.value)}`;
        window.history.pushState({ page: 'detail', name: route.value }, '', url);
      } else if (route.type === 'pokedle') {
        window.history.pushState({ page: 'pokedle' }, '', '#/pokedle');
      }
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    pushView(currentRoute);
  }, [currentRoute, pushView]);

  useEffect(() => {
    const onPop = () => {
      setCurrentRoute(parseHash());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSelectPokemon = (nameOrId) => {
    if (!nameOrId) { setCurrentRoute(null); return; }
    let value = '';
    if (typeof nameOrId === 'string' || typeof nameOrId === 'number') {
      value = String(nameOrId).trim();
    } else if (typeof nameOrId === 'object' && nameOrId !== null) {
      if (nameOrId.name) value = String(nameOrId.name).trim();
      else if (nameOrId.id) value = String(nameOrId.id).trim();
    }
    if (!value) return;
    setCurrentRoute({ type: 'pokemon', value: value.toLowerCase() });
  };

  const handleOpenPokedle = () => {
    startTransition(() => {
      setCurrentRoute({ type: 'pokedle' });
    });
  };

  const handleBack = () => {
    startTransition(() => {
      setCurrentRoute(null);
    });
  };

  return (
    <div>
      {currentRoute?.type === 'pokemon' ? (
        <PokemonDetail
          pokemonName={currentRoute.value}
          onBack={handleBack}
          onSelectPokemon={handleSelectPokemon}
          onOpenPokedle={handleOpenPokedle}
        />
      ) : currentRoute?.type === 'pokedle' ? (
        <PokedleView 
          onBack={handleBack} 
          onOpenPokedle={handleOpenPokedle} 
        />
      ) : (
        <HomeView
          onSelectPokemon={handleSelectPokemon}
          onOpenPokedle={handleOpenPokedle}
        />
      )}
    </div>
  );
}