import fs from 'fs';
import path from 'path';

async function generateFullMasterList() {
  try {
    console.log('1. Descubriendo el listado maestro de la PokéAPI...');
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
    if (!listResponse.ok) throw new Error('Error al conectar con el índice maestro');
    
    const listData = await listResponse.json();
    const pokemons = listData.results;
    console.log(`Se encontraron ${pokemons.length} Pokémon. Descargando detalles (esto puede tardar unos minutos)...`);

    const fullPokemonData = [];

    for (let i = 0; i < pokemons.length; i++) {
      const p = pokemons[i];
      try {
        // Petición al endpoint de detalles del Pokémon
        const res = await fetch(p.url);
        if (!res.ok) continue;
        const details = await res.json();

        // Opcional: Petición a species para obtener datos de evolución si lo necesitas
        // const speciesRes = await fetch(details.species.url);
        // const speciesData = speciesRes.ok ? await speciesRes.json() : null;

        // Mapeamos los datos esenciales que usaba tu app
        const formattedPokemon = {
          id: details.id,
          name: details.name,
          sprites: {
            front_default: details.sprites.front_default,
            other: {
              'official-artwork': details.sprites.other['official-artwork']?.front_default || details.sprites.front_default
            }
          },
          types: details.types.map(t => t.type.name),
          stats: details.stats.map(s => ({
            name: s.stat.name,
            base_stat: s.base_stat
          })),
          moves: details.moves.map(m => ({
            name: m.move.name,
            level_learned_at: m.version_group_details[0]?.level_learned_at || 0,
            learn_method: m.version_group_details[0]?.move_learn_method?.name || 'unknown'
          })),
          height: details.height,
          weight: details.weight
        };

        fullPokemonData.push(formattedPokemon);

        // Mostrar progreso por consola cada 50 Pokémon
        if ((i + 1) % 50 === 0 || i === pokemons.length - 1) {
          console.log(`Progreso: ${i + 1} / ${pokemons.length} procesados...`);
        }

        // Pequeña pausa para no saturar la API ni bloquear la red local
        await new Promise(r => setTimeout(r, 50));

      } catch (err) {
        console.warn(`No se pudo descargar el Pokémon ${p.name}:`, err.message);
      }
    }

    // Asegurar que la carpeta existe
    const dirPath = path.resolve('src/data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const outputPath = path.join(dirPath, 'pokemonFullData.json');
    fs.writeFileSync(outputPath, JSON.stringify(fullPokemonData, null, 2));
    
    console.log(`\n¡Listo! Archivo generado con éxito en: ${outputPath}`);
    console.log(`Total de Pokémon guardados con su información detallada: ${fullPokemonData.length}`);

  } catch (error) {
    console.error('Error crítico en la generación:', error);
    process.exit(1);
  }
}

generateFullMasterList();