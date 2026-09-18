/**
 * Selecciona el Pokémon diario basándose en un hash robusto y altamente variable de la fecha actual (UTC).
 */
export function getDailyPokemon(allPokemonList) {
  if (!allPokemonList || allPokemonList.length === 0) return null;

  // Filtramos solo los Pokémon estándar (excluyendo formas especiales giga/mega si superan el rango normal)
  const standardPokemonList = allPokemonList.filter((p) => p.id < 10000);
  if (standardPokemonList.length === 0) return null;

  const now = new Date();
  // Formato estricto YYYY-MM-DD en UTC para que sea consistente sin importar la zona horaria
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  // 🔀 Hash FNV-1a mejorado para una dispersión ultra aleatoria
  let hash = 2166136261;
  for (let i = 0; i < dateString.length; i++) {
    hash ^= dateString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // Mezcla extra (MurmurHash-style mix final) para evitar patrones consecutivos
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  // Convertimos a entero positivo y obtenemos el índice del array
  const positiveHash = Math.abs(hash);
  const index = positiveHash % standardPokemonList.length;

  return standardPokemonList[index];
}

/**
 * Calcula la etapa de evolución de un Pokémon de forma segura.
 */
export function getEvolutionStage(pokemon) {
  if (!pokemon) return 1;

  // Buscar rutas en distintas ubicaciones posibles del objeto
  const paths =
    pokemon.evolution?.paths ||
    pokemon.evolutionPaths ||
    pokemon.evolution_chain?.paths;
  if (!paths || !Array.isArray(paths)) return 1;

  for (const path of paths) {
    if (!Array.isArray(path)) continue;
    const nodeIndex = path.findIndex(
      (node) => String(node.id) === String(pokemon.id),
    );
    if (nodeIndex !== -1) {
      return nodeIndex + 1; // 1 = Base, 2 = 1ª evolución, 3 = 2ª evolución
    }
  }
  return 1;
}

/**
 * Suma todas las estadísticas base de un Pokémon.
 */
export function getTotalStats(statsArray) {
  // Si statsArray no viene o no es array, intentamos buscarlo en otra propiedad común
  const stats = Array.isArray(statsArray) ? statsArray : [];
  if (stats.length === 0) return 0;

  return stats.reduce((acc, stat) => {
    const val =
      stat.base_stat !== undefined
        ? stat.base_stat
        : stat.value !== undefined
          ? stat.value
          : 0;
    return acc + Number(val);
  }, 0);
}

/**
 * Calcula el número total de debilidades (x2 y x4).
 */
export function getTotalWeaknesses(weaknessesObj) {
  if (!weaknessesObj) return 0;

  // Soporta tanto { x2: [...], x4: [...] } como arrays directos o nombres alternativos
  const x2Count = Array.isArray(weaknessesObj.x2)
    ? weaknessesObj.x2.length
    : Array.isArray(weaknessesObj.double_damage_from)
      ? weaknessesObj.double_damage_from.length
      : 0;
  const x4Count = Array.isArray(weaknessesObj.x4) ? weaknessesObj.x4.length : 0;

  return x2Count + x4Count;
}

/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
/**
 * Compara el intento del usuario (guess) con el Pokémon objetivo (target).
 */
export function evaluateGuess(guess, target) {
  const targetTypes = target.types || target.type || [];
  const guessTypes = guess.types || guess.type || [];

  // Definimos los tipos del objetivo (hasta 2 slots)
  const t = [targetTypes[0] || null, targetTypes[1] || null];
  
  // Hacemos una copia de los tipos del intento para irlos "consumiendo" de la bolsa
  const g = [...guessTypes]; 

  let type1Val = null;
  let type1Stat = 'wrong';
  let type2Val = null;
  let type2Stat = 'wrong';

  // --- 1. Buscamos acierto directo para el HUECO 1 (Tipo 1 del objetivo) ---
  if (t[0]) {
    const idx = g.indexOf(t[0]);
    if (idx !== -1) {
      type1Val = t[0];
      type1Stat = 'correct';
      g.splice(idx, 1); // Lo sacamos de la bolsa para no repetirlo
    }
  }

  // --- 2. Buscamos acierto directo para el HUECO 2 (Tipo 2 del objetivo) ---
  if (t[1]) {
    const idx = g.indexOf(t[1]);
    if (idx !== -1) {
      type2Val = t[1];
      type2Stat = 'correct';
      g.splice(idx, 1); // Lo sacamos de la bolsa
    }
  } else {
    // Si el objetivo NO tiene segundo tipo, y el intento tampoco, coinciden en "nada"
    if (guessTypes.length === 1) {
      type2Val = '—';
      type2Stat = 'correct';
    }
  }

  // --- 3. Rellenamos los huecos vacíos con los tipos que sobraron en la bolsa ---
  if (type1Val === null) {
    if (g.length > 0) {
      type1Val = g.shift(); // Sacamos el primer tipo sobrante
    } else {
      type1Val = '—';
    }
    type1Stat = 'wrong';
  }

  if (type2Val === null) {
    if (g.length > 0) {
      type2Val = g.shift(); // Sacamos el último tipo que quede
    } else {
      type2Val = '—';
    }
    type2Stat = 'wrong';
  }

  // Etapa Evolutiva
  const guessStage = getEvolutionStage(guess);
  const targetStage = getEvolutionStage(target);

  // Peso
  const guessWeight = Number(guess.weight ?? 0);
  const targetWeight = Number(target.weight ?? 0);

  // Estadísticas Totales
  const guessTotalStats = getTotalStats(guess.stats || guess.base_stats);
  const targetTotalStats = getTotalStats(target.stats || target.base_stats);

  // Debilidades
  const guessWeaknessesCount = getTotalWeaknesses(guess.weaknesses);
  const targetWeaknessesCount = getTotalWeaknesses(target.weaknesses);

  return {
    pokemon: guess,
    
    type1: { 
      value: type1Val, 
      status: type1Stat 
    },
    type2: { 
      value: type2Val, 
      status: type2Stat 
    },

    evolutionStage: {
      value: guessStage,
      status: guessStage === targetStage ? 'correct' : guessStage < targetStage ? 'higher' : 'lower'
    },

    weight: {
      value: guessWeight,
      status: guessWeight === targetWeight ? 'correct' : guessWeight < targetWeight ? 'higher' : 'lower'
    },

    totalStats: {
      value: guessTotalStats,
      status: guessTotalStats === targetTotalStats ? 'correct' : guessTotalStats < targetTotalStats ? 'higher' : 'lower'
    },

    weaknesses: {
      value: guessWeaknessesCount,
      status: guessWeaknessesCount === targetWeaknessesCount ? 'correct' : guessWeaknessesCount < targetWeaknessesCount ? 'higher' : 'lower'
    },

    isWinner: guess.id === target.id
  };
}