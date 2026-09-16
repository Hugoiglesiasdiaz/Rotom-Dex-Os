// src/utils/pokemonHelpers.js

/**
 * Helper unificado para formatear cualquier condición evolutiva de la PokéAPI.
 */
export function formatEvoPhrase(details) {
  if (!details) return "Forma base";

  const conditions = [];
  const trigger = details.trigger?.name;

  // 1. Desencadenantes principales
  if (trigger === "level-up") {
    if (details.min_level) {
      conditions.push(`Nivel ${details.min_level}`);
    } else {
      conditions.push("Subir de nivel");
    }
  } else if (trigger === "trade") {
    conditions.push("Intercambio");
    if (details.trade_species) {
      conditions.push(`por ${formatName(details.trade_species.name)}`);
    }
  } else if (trigger === "use-item") {
    conditions.push("Usar objeto");
  } else if (trigger === "take-damage") {
    conditions.push("Sufriendo daño");
    if (details.min_damage_taken) {
      conditions.push(`(${details.min_damage_taken}+ PS)`);
    }
  } else if (trigger === "spin") {
    conditions.push("Girar sobre sí mismo");
  } else if (trigger === "shed") {
    conditions.push("Hueco libre y Poké Ball");
  }

  // 2. Objetos
  if (details.item) {
    conditions.push(`con ${formatName(details.item.name)}`);
  }
  if (details.held_item) {
    conditions.push(`llevando ${formatName(details.held_item.name)}`);
  }

  // 3. Momento del día y clima
  if (details.time_of_day) {
    const timeMap = { day: "de día", night: "de noche" };
    if (timeMap[details.time_of_day]) {
      conditions.push(timeMap[details.time_of_day]);
    }
  }
  if (details.needs_overworld_rain) {
    conditions.push("lloviendo");
  }

  // 4. Estadísticas y amistad
  if (details.min_happiness) {
    conditions.push(`Felicidad (${details.min_happiness})`);
  }
  if (details.min_beauty) {
    conditions.push(`Belleza (${details.min_beauty})`);
  }
  if (details.known_move) {
    conditions.push(`con ${formatName(details.known_move.name)}`);
  }

  // 5. Trucos físicos (Malamar, etc.)
  if (details.turn_upside_down) {
    conditions.push("consola boca abajo");
  }
  if (details.location) {
    conditions.push(`en ${formatName(details.location.name)}`);
  }

  return conditions.length > 0 ? conditions.join(" + ") : "Evolución especial";
}

/**
 * Función auxiliar interna para capitalizar nombres (ej: "thunder-stone" -> "Thunder Stone")
 */
function formatName(name) {
  if (!name) return "";
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Encuentra la ruta evolutiva correcta basándose estrictamente en el ID único del Pokémon.
 */
export function findCurrentEvolutionPath(paths, currentPokemonOrId) {
  if (!paths || paths.length === 0) return [];
  
  const currentId = String(
    typeof currentPokemonOrId === "object" && currentPokemonOrId !== null
      ? currentPokemonOrId.id
      : currentPokemonOrId || ""
  );

  console.log("🔍 Buscando ruta para el ID actual:", currentId);

  if (!currentId) return paths[0];

  let chosenPath = paths[0];

  for (const p of paths) {
    // Imprime los IDs que va encontrando en cada nodo del camino
    console.log("Ruta evaluada:", p.map(n => ({ name: n.species_name, id: n.id })));
    
    const exactMatch = p.some((n) => String(n.id) === currentId);
    if (exactMatch) {
      console.log("✨ ¡Encontrado match exacto para el ID:", currentId);
      chosenPath = p;
      break;
    }
  }

  return chosenPath;
}