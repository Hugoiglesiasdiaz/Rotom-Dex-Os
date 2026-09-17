/**
 * Helper unificado para formatear cualquier condición evolutiva de la PokéAPI con soporte i18n.
 */
export function formatEvoPhrase(details, lang = "en", t = {}) {
  if (!details) return t.evoTriggers?.baseForm || "Forma base";

  const evos = t.evoTriggers || {};
  const conditions = [];
  const trigger = details.trigger?.name;

  // 1. Desencadenantes principales
  if (trigger === "level-up") {
    if (details.min_level) {
      conditions.push(`${evos.levelUp || "Nivel"} ${details.min_level}`);
    } else {
      conditions.push(evos.levelUpSimple || "Subir de nivel");
    }
  } else if (trigger === "trade") {
    conditions.push(evos.trade || "Intercambio");
    if (details.trade_species) {
      conditions.push(
        `${evos.tradeWith || "por"} ${formatName(details.trade_species.name)}`,
      );
    }
  } else if (trigger === "use-item") {
    conditions.push(evos.useItem || "Usar objeto");
  } else if (trigger === "take-damage") {
    conditions.push(evos.takeDamage || "Sufriendo daño");
    if (details.min_damage_taken) {
      conditions.push(`(${details.min_damage_taken}+ PS)`);
    }
  } else if (trigger === "spin") {
    conditions.push(evos.spin || "Girar sobre sí mismo");
  } else if (trigger === "shed") {
    conditions.push(evos.shed || "Hueco libre y Poké Ball");
  }

  // 2. Objetos
  if (details.item) {
    conditions.push(
      `${evos.withItem || "con"} ${formatName(details.item.name)}`,
    );
  }
  if (details.held_item) {
    conditions.push(
      `${evos.heldItem || "llevando"} ${formatName(details.held_item.name)}`,
    );
  }

  // 3. Momento del día y clima
  if (details.time_of_day) {
    const timeMap = {
      day: evos.day || "de día",
      night: evos.night || "de noche",
    };
    if (timeMap[details.time_of_day]) {
      conditions.push(timeMap[details.time_of_day]);
    }
  }
  if (details.needs_overworld_rain) {
    conditions.push(evos.rain || "lloviendo");
  }

  // 4. Estadísticas, Amistad, Afectación y Movimientos/Tipos
  if (details.min_happiness) {
    conditions.push(
      `${evos.happiness || "Felicidad"} (${details.min_happiness})`,
    );
  }
  if (details.min_affection) {
    conditions.push(
      `${evos.affection || "Afectación"} (${details.min_affection})`,
    );
  }
  if (details.min_beauty) {
    conditions.push(`${evos.beauty || "Belleza"} (${details.min_beauty})`);
  }
  if (details.known_move) {
    conditions.push(
      `${evos.withItem || "con"} ${formatName(details.known_move.name)}`,
    );
  }
  // Controlamos el tipo de movimiento requerido (ej. Sylveon)
  if (details.known_move_type) {
    const typeKey = details.known_move_type.name;
    const translatedType = t.types?.[typeKey] || formatName(typeKey);
    
    const prefix = evos.movePrefix || (lang === 'en' ? "with a" : "con movimiento");
    const suffix = evos.moveSuffix || (lang === 'en' ? "-type move" : "tipo");

    // Resultado ES: "con movimiento Hada tipo" o estructurado como prefieras
    // Resultado EN: "with a Fairy-type move"
    if (lang === 'en') {
      conditions.push(`${prefix} ${translatedType}${suffix}`);
    } else {
      conditions.push(`${prefix} ${suffix} ${translatedType}`); // "con movimiento tipo Hada"
    }
  }

  // 5. Trucos físicos (Malamar, etc.)
  if (details.turn_upside_down) {
    conditions.push(evos.upsideDown || "consola boca abajo");
  }
  if (details.location) {
    conditions.push(
      `${evos.inLocation || "en"} ${formatName(details.location.name)}`,
    );
  }

  return conditions.length > 0
    ? conditions.join(" + ")
    : evos.specialEvo || "Evolución especial";
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
      : currentPokemonOrId || "",
  );

  if (!currentId) return paths[0];

  let chosenPath = paths[0];

  for (const p of paths) {
    const exactMatch = p.some((n) => String(n.id) === currentId);
    if (exactMatch) {
      chosenPath = p;
      break;
    }
  }

  return chosenPath;
}
