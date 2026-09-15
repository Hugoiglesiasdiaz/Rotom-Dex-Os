// src/utils/pokemonCache.js
const cache = new Map();

export async function getCachedPokemonList() {
  const cacheKey = "pokemonList";

  // Si ya está en memoria, lo devolvemos al instante (0ms)
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch("/data/pokemonList.json");
    if (!res.ok) throw new Error("Error al cargar la lista resumida");
    
    const data = await res.json();
    
    // Guardamos el resultado en el Map antes de retornarlo
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching pokemonList:", error);
    return [];
  }
}

// 🚀 AÑADE ESTA FUNCIÓN NUEVA ABAJO
export async function getCachedPokemonDetail(id) {
  const cacheKey = `pokemon_${id}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(`/data/pokemon/${id}.json`);
    if (!res.ok) throw new Error(`Error al cargar el Pokémon ${id}`);
    
    const data = await res.json();
    
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching pokemon detail for ${id}:`, error);
    return null;
  }
}