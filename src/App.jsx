import { useState, useEffect, useCallback, startTransition } from 'react';
import { HomeView } from './views/HomeView';
import { PokemonDetail } from './views/PokemonDetail';
import { preloadRemainingPokemon } from './services/pokemonservice';

export default function App() {
  // Initialize from location.hash (supports /#/pokemon/name)
  const parseHash = () => {
    try {
      const h = (window.location.hash || '').replace('#/', '').replace(/^\/+/, '');
      if (!h) return null;
      const parts = h.split('/');
      if (parts[0] === 'pokemon' && parts[1]) return String(parts[1]).toLowerCase();
      return null;
    } catch {
      return null;
    }
  };

  const [selectedPokemonName, setSelectedPokemonName] = useState(() => parseHash());

  // push app state into history with hash
  const pushView = useCallback((name) => {
    try {
      if (name) {
        const url = `#/pokemon/${encodeURIComponent(String(name).toLowerCase())}`;
        window.history.pushState({ page: 'detail', name: String(name).toLowerCase() }, '', url);
      } else {
        const url = '#/';
        window.history.pushState({ page: 'home' }, '', url);
      }
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    // keep URL in sync when selectedPokemonName changes
    pushView(selectedPokemonName);
  }, [selectedPokemonName, pushView]);

  useEffect(() => {
    const onPop = (ev) => {
      const h = parseHash();
      setSelectedPokemonName(h);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // handlers passed to children — accept various inputs but always store a simple string (name or id)
  const handleSelect = (nameOrId) => {
    if (!nameOrId) { setSelectedPokemonName(null); return; }
    let value = '';
    if (typeof nameOrId === 'string' || typeof nameOrId === 'number') {
      value = String(nameOrId).trim();
    } else if (typeof nameOrId === 'object' && nameOrId !== null) {
      if (nameOrId.name) value = String(nameOrId.name).trim();
      else if (nameOrId.id) value = String(nameOrId.id).trim();
    }
    if (!value) return;
    setSelectedPokemonName(String(value).toLowerCase());
  };
  const handleBack = () => {
    startTransition(() => {
      setSelectedPokemonName(null);
    });
  };

  // background preloading is initiated from HomeView to allow UI callbacks

  return (
    <div>
      {selectedPokemonName ? (
        <PokemonDetail
          pokemonName={selectedPokemonName}
          onBack={handleBack}
          onSelectPokemon={(name) => handleSelect(name)}
        />
      ) : (
        <HomeView onSelectPokemon={(name) => handleSelect(name)} />
      )}
    </div>
  );
}