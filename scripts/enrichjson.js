import fs from 'fs';
import path from 'path';

// Matriz de efectividades defensivas oficiales
const typeChart = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Diccionario para traducir métodos de aprendizaje de movimientos
const learnMethodTranslations = {
  "egg": "Huevo",
  "machine": "MT / MO (Máquina)",
  "tutor": "Tutor",
  "level-up": "Subida de nivel",
  "light-ball-egg": "Huevo (Bola Luminosa)",
  "colosseum-purification": "Purificación (Colosseum)",
  "xd-shadow": "Sombra (XD)",
  "xd-purification": "Purificación (XD)",
  "form-change": "Cambio de forma"
};

// Caché global para no repetir peticiones de movimientos idénticos
const moveCache = {};

function calculatePokemonWeaknesses(pokemonTypes) {
  const allTypes = Object.keys(typeChart);
  const multipliers = {};

  allTypes.forEach(attackType => {
    let totalMultiplier = 1;
    pokemonTypes.forEach(defType => {
      const defenseMap = typeChart[attackType];
      if (defenseMap && defenseMap[defType] !== undefined) {
        totalMultiplier *= defenseMap[defType];
      }
    });
    multipliers[attackType] = totalMultiplier;
  });

  const weaknesses = { x4: [], x2: [] };
  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult === 4) weaknesses.x4.push(type);
    else if (mult === 2) weaknesses.x2.push(type);
  });

  return weaknesses;
}

async function enrichPokemonData() {
  const filePath = path.resolve('../src/data/pokemonFullData.json');
  const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const enrichedList = [];

  for (const p of rawData) {
    const displayName = typeof p.name === 'object' ? p.name.es : p.name;
    console.log(`Procesando a #${p.id} - ${displayName}...`);
    
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
    const data = await res.json();

    // 1. Procesar habilidades con nombres y descripciones bilingües
    const abilities = [];
    for (const abInfo of data.abilities) {
      const abRes = await fetch(abInfo.ability.url);
      const abData = await abRes.json();
      
      const nameEs = abData.names.find(n => n.language.name === 'es')?.name || abInfo.ability.name;
      const nameEn = abData.names.find(n => n.language.name === 'en')?.name || abInfo.ability.name;
      const entryEs = abData.effect_entries.find(e => e.language.name === 'es');
      const entryEn = abData.effect_entries.find(e => e.language.name === 'en');
      
      abilities.push({
        is_hidden: abInfo.is_hidden,
        name: { es: nameEs, en: nameEn },
        description: {
          es: entryEs ? entryEs.effect || entryEs.short_effect : 'Sin descripción disponible.',
          en: entryEn ? entryEn.effect || entryEn.short_effect : 'No description available.'
        }
      });
    }

    // 2. Procesar movimientos con caché para traducir nombres al español/inglés
    const moves = [];
    for (const m of data.moves) {
      const moveNameKey = m.move.name;
      
      if (!moveCache[moveNameKey]) {
        try {
          const moveRes = await fetch(m.move.url);
          const moveData = await moveRes.json();
          const moveNameEs = moveData.names.find(n => n.language.name === 'es')?.name || moveNameKey;
          const moveNameEn = moveData.names.find(n => n.language.name === 'en')?.name || moveNameKey;
          moveCache[moveNameKey] = { es: moveNameEs, en: moveNameEn };
        } catch {
          moveCache[moveNameKey] = { es: moveNameKey, en: moveNameKey };
        }
      }

      const originalMethod = m.version_group_details[0]?.move_learn_method?.name || "desconocido";
      moves.push({
        name: moveCache[moveNameKey],
        level_learned_at: m.version_group_details[0]?.level_learned_at || 0,
        learn_method: learnMethodTranslations[originalMethod] || originalMethod
      });
    }

    // 3. Obtener nombre del Pokémon en español/inglés desde la especie
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    
    const nameEs = speciesData.names.find(n => n.language.name === 'es')?.name;
    const nameEn = speciesData.names.find(n => n.language.name === 'en')?.name;

    // 4. Cadena evolutiva
    let evolutionPaths = [];
    if (speciesData.evolution_chain) {
      const chainRes = await fetch(speciesData.evolution_chain.url);
      const chainData = await chainRes.json();
      
      function parseChain(node, pathArr = []) {
        const currentId = node.species.url.split('/').filter(Boolean).pop();
        const currentInfo = {
          species_name: node.species.name,
          id: currentId,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentId}.png`,
          detailsFromPrev: node.evolution_details[0] || null
        };
        const currentPath = [...pathArr, currentInfo];
        if (node.evolves_to.length === 0) {
          evolutionPaths.push(currentPath);
        } else {
          for (const nextNode of node.evolves_to) {
            parseChain(nextNode, currentPath);
          }
        }
      }
      parseChain(chainData.chain);
    }

    // 5. Debilidades calculadas
    const weaknesses = calculatePokemonWeaknesses(p.types);

    enrichedList.push({
      ...p,
      name: { 
        es: nameEs || (typeof p.name === 'object' ? p.name.es : p.name), 
        en: nameEn || (typeof p.name === 'object' ? p.name.en : p.name) 
      },
      moves,
      abilities,
      evolution: { paths: evolutionPaths },
      weaknesses
    });

    // CORRECCIÓN AQUÍ: Usamos setTimeout nativo en vez de ProcessTimeout
    await new Promise(r => setTimeout(r, 50)); 
  }

  const outputPath = path.resolve('../src/data/pokemonFullData.json');
  fs.writeFileSync(outputPath, JSON.stringify(enrichedList, null, 2));
  console.log('¡Proceso finalizado! Base de datos completamente traducida y estructurada.');
}

enrichPokemonData();