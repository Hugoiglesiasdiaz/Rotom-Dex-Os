/**
 * Sobrescrituras regionales para evoluciones que la PokéAPI no representa
 * con la misma lógica que la serie oficial (Alola, Galar, Hisui, Paldea, etc.).
 *
 * Contrato: cada clave del mapa debe apuntar a un objeto con la propiedad
 * `paths`, que es un array de rutas evolutivas. Cada ruta es un array de nodos:
 *
 *   {
 *     species_name: "vulpix-alola",
 *     id: "10107",
 *     image: "/sprites/10107.webp",
 *     detailsFromPrev: null | { ... }
 *   }
 *
 * Ejemplo rápido de alta para añadir una nueva forma regional:
 *
 *   "<especie>-alola": {
 *     paths: [
 *       [
 *         { species_name: "<especie>-alola", id: "101xx", image: "/sprites/101xx.webp", detailsFromPrev: null },
 *         { species_name: "<evolucion>-alola", id: "101yy", image: "/sprites/101yy.webp", detailsFromPrev: { min_level: 25, trigger: { name: "level-up", url: "" } } }
 *       ]
 *     ]
 *   }
 *
 * El formato de `detailsFromPrev` debe replicar la estructura de la PokéAPI
 * para que el render final pueda formatear la condición evolutiva igual que
 * cualquier otra forma estándar.
 */
export function getRegionalEvolutionOverride(speciesName) {
  if (!speciesName) return null;

  const override = REGIONAL_EVOLUTION_OVERRIDES[speciesName];
  if (!override) return null;

  if (!Array.isArray(override.paths) || override.paths.length === 0) {
    throw new Error(
      `[evolutionOverrides] Invalid override for "${speciesName}"`,
    );
  }

  return override.paths;
}

export function createRegionalEvolutionPath(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error(
      "[evolutionOverrides] A regional path must contain at least one node.",
    );
  }

  return nodes.map((node) => ({
    species_name: node.species_name,
    id: String(node.id),
    image: node.image || `/sprites/${node.id}.webp`,
    detailsFromPrev: node.detailsFromPrev ?? null,
  }));
}

// src/scripts/evolutionOverrides.js
export const REGIONAL_EVOLUTION_OVERRIDES = {
  "meowth-alola": {
    paths: [
      [
        {
          species_name: "meowth-alola",
          id: "10107",
          image: "/sprites/10107.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "persian-alola",
          id: "10108",
          image: "/sprites/10108.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            min_happiness: 220,
            trigger: { name: "high-friendship", url: "" },
          },
        },
      ],
    ],
  },
  "persian-alola": {
    paths: [
      [
        {
          species_name: "meowth-alola",
          id: "10107",
          image: "/sprites/10107.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "persian-alola",
          id: "10108",
          image: "/sprites/10108.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            min_happiness: 220,
            trigger: { name: "high-friendship", url: "" },
          },
        },
      ],
    ],
  },

  // --- MEOWTH / PERRSERKER (GALAR) ---
  "meowth-galar": {
    paths: [
      [
        {
          species_name: "meowth-galar",
          id: "10161",
          image: "/sprites/10161.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "perrserker",
          id: "863",
          image: "/sprites/863.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_level: 28,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  perrserker: {
    paths: [
      [
        {
          species_name: "meowth-galar",
          id: "10161",
          image: "/sprites/10161.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "perrserker",
          id: "863",
          image: "/sprites/863.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_level: 28,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- VULPIX / NINETALES (ALOLA) ---
  "vulpix-alola": {
    paths: [
      [
        {
          species_name: "vulpix-alola",
          id: "10103",
          image: "/sprites/10103.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "ninetales-alola",
          id: "10104",
          image: "/sprites/10104.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "ninetales-alola": {
    paths: [
      [
        {
          species_name: "vulpix-alola",
          id: "10103",
          image: "/sprites/10103.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "ninetales-alola",
          id: "10104",
          image: "/sprites/10104.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- SANDSHREW / SANDSLASH (ALOLA) ---
  "sandshrew-alola": {
    paths: [
      [
        {
          species_name: "sandshrew-alola",
          id: "10101",
          image: "/sprites/10101.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sandslash-alola",
          id: "10102",
          image: "/sprites/10102.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "sandslash-alola": {
    paths: [
      [
        {
          species_name: "sandshrew-alola",
          id: "10101",
          image: "/sprites/10101.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sandslash-alola",
          id: "10102",
          image: "/sprites/10102.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- DIGLETT / DUGTRIO (ALOLA) ---
  "diglett-alola": {
    paths: [
      [
        {
          species_name: "diglett-alola",
          id: "10105",
          image: "/sprites/10105.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "dugtrio-alola",
          id: "10106",
          image: "/sprites/10106.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            min_level: 26,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "dugtrio-alola": {
    paths: [
      [
        {
          species_name: "diglett-alola",
          id: "10105",
          image: "/sprites/10105.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "dugtrio-alola",
          id: "10106",
          image: "/sprites/10106.webp",
          detailsFromPrev: {
            version_group: { name: "sun-moon", url: "" },
            is_default: false,
            min_level: 26,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- PONYTA / RAPIDASH (GALAR) ---
  "ponyta-galar": {
    paths: [
      [
        {
          species_name: "ponyta-galar",
          id: "10162",
          image: "/sprites/10162.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "rapidash-galar",
          id: "10163",
          image: "/sprites/10163.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_level: 40,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "rapidash-galar": {
    paths: [
      [
        {
          species_name: "ponyta-galar",
          id: "10162",
          image: "/sprites/10162.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "rapidash-galar",
          id: "10163",
          image: "/sprites/10163.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_level: 40,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- SLOWPOKE / SLOWBRO / SLOWKING (GALAR) ---
  "slowpoke-galar": {
    paths: [
      [
        {
          species_name: "slowpoke-galar",
          id: "10164",
          image: "/sprites/10164.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "slowbro-galar",
          id: "10165",
          image: "/sprites/10165.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            item: { name: "galaric-cuff", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
      [
        {
          species_name: "slowpoke-galar",
          id: "10164",
          image: "/sprites/10164.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "slowking-galar",
          id: "10166",
          image: "/sprites/10166.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            item: { name: "galaric-wreath", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "slowbro-galar": {
    paths: [
      [
        {
          species_name: "slowpoke-galar",
          id: "10164",
          image: "/sprites/10164.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "slowbro-galar",
          id: "10165",
          image: "/sprites/10165.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            item: { name: "galaric-cuff", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "slowking-galar": {
    paths: [
      [
        {
          species_name: "slowpoke-galar",
          id: "10164",
          image: "/sprites/10164.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "slowking-galar",
          id: "10166",
          image: "/sprites/10166.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            item: { name: "galaric-wreath", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- YAMASK / RUNERIGUS (GALAR) ---
  "yamask-galar": {
    paths: [
      [
        {
          species_name: "yamask-galar",
          id: "10177",
          image: "/sprites/10177.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "runerigus",
          id: "867",
          image: "/sprites/867.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_damage_taken: 49,
            trigger: { name: "take-damage", url: "" },
          },
        },
      ],
    ],
  },
  runerigus: {
    paths: [
      [
        {
          species_name: "yamask-galar",
          id: "10177",
          image: "/sprites/10177.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "runerigus",
          id: "867",
          image: "/sprites/867.webp",
          detailsFromPrev: {
            version_group: { name: "sword-shield", url: "" },
            is_default: false,
            min_damage_taken: 49,
            trigger: { name: "take-damage", url: "" },
          },
        },
      ],
    ],
  },

  // --- GEODUDE / GRAVELER / GOLEM (ALOLA) ---
  "geodude-alola": {
    paths: [
      [
        {
          species_name: "geodude-alola",
          id: "10109",
          image: "/sprites/10109.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "graveler-alola",
          id: "10110",
          image: "/sprites/10110.webp",
          detailsFromPrev: {
            min_level: 25,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "golem-alola",
          id: "10111",
          image: "/sprites/10111.webp",
          detailsFromPrev: { trigger: { name: "trade", url: "" } },
        },
      ],
    ],
  },
  "graveler-alola": {
    paths: [
      [
        {
          species_name: "geodude-alola",
          id: "10109",
          image: "/sprites/10109.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "graveler-alola",
          id: "10110",
          image: "/sprites/10110.webp",
          detailsFromPrev: {
            min_level: 25,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "golem-alola",
          id: "10111",
          image: "/sprites/10111.webp",
          detailsFromPrev: { trigger: { name: "trade", url: "" } },
        },
      ],
    ],
  },
  "golem-alola": {
    paths: [
      [
        {
          species_name: "geodude-alola",
          id: "10109",
          image: "/sprites/10109.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "graveler-alola",
          id: "10110",
          image: "/sprites/10110.webp",
          detailsFromPrev: {
            min_level: 25,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "golem-alola",
          id: "10111",
          image: "/sprites/10111.webp",
          detailsFromPrev: { trigger: { name: "trade", url: "" } },
        },
      ],
    ],
  },

  // --- GRIMER / MUK (ALOLA) ---
  "grimer-alola": {
    paths: [
      [
        {
          species_name: "grimer-alola",
          id: "10112",
          image: "/sprites/10112.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "muk-alola",
          id: "10113",
          image: "/sprites/10113.webp",
          detailsFromPrev: {
            min_level: 38,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "muk-alola": {
    paths: [
      [
        {
          species_name: "grimer-alola",
          id: "10112",
          image: "/sprites/10112.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "muk-alola",
          id: "10113",
          image: "/sprites/10113.webp",
          detailsFromPrev: {
            min_level: 38,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- RATTATA / RATICATE (ALOLA) ---
  "rattata-alola": {
    paths: [
      [
        {
          species_name: "rattata-alola",
          id: "10091",
          image: "/sprites/10091.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "raticate-alola",
          id: "10092",
          image: "/sprites/10092.webp",
          detailsFromPrev: {
            min_level: 20,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "raticate-alola": {
    paths: [
      [
        {
          species_name: "rattata-alola",
          id: "10091",
          image: "/sprites/10091.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "raticate-alola",
          id: "10092",
          image: "/sprites/10092.webp",
          detailsFromPrev: {
            min_level: 20,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- GROWLITHE / ARCANINE (HISUI) ---
  "growlithe-hisui": {
    paths: [
      [
        {
          species_name: "growlithe-hisui",
          id: "10229",
          image: "/sprites/10229.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "arcanine-hisui",
          id: "10230",
          image: "/sprites/10230.webp",
          detailsFromPrev: {
            item: { name: "fire-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "arcanine-hisui": {
    paths: [
      [
        {
          species_name: "growlithe-hisui",
          id: "10229",
          image: "/sprites/10229.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "arcanine-hisui",
          id: "10230",
          image: "/sprites/10230.webp",
          detailsFromPrev: {
            item: { name: "fire-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- VOLTORB / ELECTRODE (HISUI) ---
  "voltorb-hisui": {
    paths: [
      [
        {
          species_name: "voltorb-hisui",
          id: "10231",
          image: "/sprites/10231.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "electrode-hisui",
          id: "10232",
          image: "/sprites/10232.webp",
          detailsFromPrev: {
            item: { name: "leaf-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "electrode-hisui": {
    paths: [
      [
        {
          species_name: "voltorb-hisui",
          id: "10231",
          image: "/sprites/10231.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "electrode-hisui",
          id: "10232",
          image: "/sprites/10232.webp",
          detailsFromPrev: {
            item: { name: "leaf-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- SNEASEL / SNEASLER (HISUI) ---
  "sneasel-hisui": {
    paths: [
      [
        {
          species_name: "sneasel-hisui",
          id: "10235",
          image: "/sprites/10235.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sneasler",
          id: "903",
          image: "/sprites/903.webp",
          detailsFromPrev: {
            item: { name: "razor-claw", url: "" },
            time_of_day: "day",
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  sneasler: {
    paths: [
      [
        {
          species_name: "sneasel-hisui",
          id: "10235",
          image: "/sprites/10235.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sneasler",
          id: "903",
          image: "/sprites/903.webp",
          detailsFromPrev: {
            item: { name: "razor-claw", url: "" },
            time_of_day: "day",
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- QWILFISH / OVERQWIL (HISUI) ---
  "qwilfish-hisui": {
    paths: [
      [
        {
          species_name: "qwilfish-hisui",
          id: "10234",
          image: "/sprites/10234.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "overqwil",
          id: "904",
          image: "/sprites/904.webp",
          detailsFromPrev: {
            known_move: { name: "barb-barrage", url: "" },
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  overqwil: {
    paths: [
      [
        {
          species_name: "qwilfish-hisui",
          id: "10234",
          image: "/sprites/10234.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "overqwil",
          id: "904",
          image: "/sprites/904.webp",
          detailsFromPrev: {
            known_move: { name: "barb-barrage", url: "" },
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- WOOPER / CLODSIRE (PALDEA) ---
  "wooper-paldea": {
    paths: [
      [
        {
          species_name: "wooper-paldea",
          id: "10253",
          image: "/sprites/10253.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "clodsire",
          id: "980",
          image: "/sprites/980.webp",
          detailsFromPrev: {
            min_level: 20,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  clodsire: {
    paths: [
      [
        {
          species_name: "wooper-paldea",
          id: "10253",
          image: "/sprites/10253.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "clodsire",
          id: "980",
          image: "/sprites/980.webp",
          detailsFromPrev: {
            min_level: 20,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- DARUMAKA / DARMANITAN (GALAR) ---
  "darumaka-galar": {
    paths: [
      [
        {
          species_name: "darumaka-galar",
          id: "10176",
          image: "/sprites/10176.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "darmanitan-galar",
          id: "10177",
          image: "/sprites/10177.webp",
          detailsFromPrev: {
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "darmanitan-galar": {
    paths: [
      [
        {
          species_name: "darumaka-galar",
          id: "10176",
          image: "/sprites/10176.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "darmanitan-galar",
          id: "10177",
          image: "/sprites/10177.webp",
          detailsFromPrev: {
            item: { name: "ice-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- CORSOLA / CURSOLA (GALAR) ---
  "corsola-galar": {
    paths: [
      [
        {
          species_name: "corsola-galar",
          id: "10173",
          image: "/sprites/10173.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "cursola",
          id: "864",
          image: "/sprites/864.webp",
          detailsFromPrev: {
            min_level: 38,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  cursola: {
    paths: [
      [
        {
          species_name: "corsola-galar",
          id: "10173",
          image: "/sprites/10173.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "cursola",
          id: "864",
          image: "/sprites/864.webp",
          detailsFromPrev: {
            min_level: 38,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- ZIGZAGOON / LINOONE / OBSTAGOON (GALAR) ---
  "zigzagoon-galar": {
    paths: [
      [
        {
          species_name: "zigzagoon-galar",
          id: "10174",
          image: "/sprites/10174.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "linoone-galar",
          id: "10175",
          image: "/sprites/10175.webp",
          detailsFromPrev: {
            min_level: 20,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "obstagoon",
          id: "862",
          image: "/sprites/862.webp",
          detailsFromPrev: {
            min_level: 35,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "linoone-galar": {
    paths: [
      [
        {
          species_name: "zigzagoon-galar",
          id: "10174",
          image: "/sprites/10174.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "linoone-galar",
          id: "10175",
          image: "/sprites/10175.webp",
          detailsFromPrev: {
            min_level: 20,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "obstagoon",
          id: "862",
          image: "/sprites/862.webp",
          detailsFromPrev: {
            min_level: 35,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  obstagoon: {
    paths: [
      [
        {
          species_name: "zigzagoon-galar",
          id: "10174",
          image: "/sprites/10174.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "linoone-galar",
          id: "10175",
          image: "/sprites/10175.webp",
          detailsFromPrev: {
            min_level: 20,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "obstagoon",
          id: "862",
          image: "/sprites/862.webp",
          detailsFromPrev: {
            min_level: 35,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- STANTLER / WYRDEER (HISUI) ---
  "stantler-hisui": {
    paths: [
      [
        {
          species_name: "stantler",
          id: "234",
          image: "/sprites/234.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "wyrdeer",
          id: "899",
          image: "/sprites/899.webp",
          detailsFromPrev: {
            known_move: { name: "barrier-attack", url: "" },
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  wyrdeer: {
    paths: [
      [
        {
          species_name: "stantler",
          id: "234",
          image: "/sprites/234.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "wyrdeer",
          id: "899",
          image: "/sprites/899.webp",
          detailsFromPrev: {
            known_move: { name: "barrier-attack", url: "" },
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- BASCULIN / BASCULEGION (HISUI) ---
  "basculin-hisui": {
    paths: [
      [
        {
          species_name: "basculin-hisui",
          id: "10247",
          image: "/sprites/10247.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "basculegion-hisui",
          id: "10248",
          image: "/sprites/10248.webp",
          detailsFromPrev: {
            min_damage_taken: 294,
            trigger: { name: "take-damage", url: "" },
          },
        },
      ],
    ],
  },
  "basculegion-hisui": {
    paths: [
      [
        {
          species_name: "basculin-hisui",
          id: "10247",
          image: "/sprites/10247.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "basculegion-hisui",
          id: "10248",
          image: "/sprites/10248.webp",
          detailsFromPrev: {
            min_damage_taken: 294,
            trigger: { name: "take-damage", url: "" },
          },
        },
      ],
    ],
  },

  // --- PETILIL / LILLIGANT (HISUI) ---
  "petilil-hisui": {
    paths: [
      [
        {
          species_name: "petilil",
          id: "548",
          image: "/sprites/548.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "lilligant-hisui",
          id: "10237",
          image: "/sprites/10237.webp",
          detailsFromPrev: {
            item: { name: "sun-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },
  "lilligant-hisui": {
    paths: [
      [
        {
          species_name: "petilil",
          id: "548",
          image: "/sprites/548.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "lilligant-hisui",
          id: "10237",
          image: "/sprites/10237.webp",
          detailsFromPrev: {
            item: { name: "sun-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- RUFFLET / BRAVIARY (HISUI) ---
  "rufflet-hisui": {
    paths: [
      [
        {
          species_name: "rufflet",
          id: "627",
          image: "/sprites/627.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "braviary-hisui",
          id: "10240",
          image: "/sprites/10240.webp",
          detailsFromPrev: {
            min_level: 54,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "braviary-hisui": {
    paths: [
      [
        {
          species_name: "rufflet",
          id: "627",
          image: "/sprites/627.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "braviary-hisui",
          id: "10240",
          image: "/sprites/10240.webp",
          detailsFromPrev: {
            min_level: 54,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- GOOMY / SLIGGOO / GOODRA (HISUI) ---
  "goomy-hisui": {
    paths: [
      [
        {
          species_name: "goomy",
          id: "704",
          image: "/sprites/704.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sliggoo-hisui",
          id: "10241",
          image: "/sprites/10241.webp",
          detailsFromPrev: {
            min_level: 40,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "goodra-hisui",
          id: "10242",
          image: "/sprites/10242.webp",
          detailsFromPrev: {
            min_level: 50,
            weather: "rain",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "sliggoo-hisui": {
    paths: [
      [
        {
          species_name: "goomy",
          id: "704",
          image: "/sprites/704.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sliggoo-hisui",
          id: "10241",
          image: "/sprites/10241.webp",
          detailsFromPrev: {
            min_level: 40,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "goodra-hisui",
          id: "10242",
          image: "/sprites/10242.webp",
          detailsFromPrev: {
            min_level: 50,
            weather: "rain",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "goodra-hisui": {
    paths: [
      [
        {
          species_name: "goomy",
          id: "704",
          image: "/sprites/704.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sliggoo-hisui",
          id: "10241",
          image: "/sprites/10241.webp",
          detailsFromPrev: {
            min_level: 40,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "goodra-hisui",
          id: "10242",
          image: "/sprites/10242.webp",
          detailsFromPrev: {
            min_level: 50,
            weather: "rain",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- BERGMITE / AVALUGG (HISUI) ---
  "bergmite-hisui": {
    paths: [
      [
        {
          species_name: "bergmite",
          id: "712",
          image: "/sprites/712.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "avalugg-hisui",
          id: "10243",
          image: "/sprites/10243.webp",
          detailsFromPrev: {
            min_level: 37,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
  "avalugg-hisui": {
    paths: [
      [
        {
          species_name: "bergmite",
          id: "712",
          image: "/sprites/712.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "avalugg-hisui",
          id: "10243",
          image: "/sprites/10243.webp",
          detailsFromPrev: {
            min_level: 37,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- TAUROS (PALDEA) ---
  "tauros-paldea": {
    paths: [
      [
        {
          species_name: "tauros-paldea",
          id: "10250",
          image: "/sprites/10250.webp",
          detailsFromPrev: null,
        },
      ],
      [
        {
          species_name: "tauros-paldea-combat",
          id: "10250",
          image: "/sprites/10250.webp",
          detailsFromPrev: null,
        },
      ],
      [
        {
          species_name: "tauros-paldea-blaze",
          id: "10251",
          image: "/sprites/10251.webp",
          detailsFromPrev: null,
        },
      ],
      [
        {
          species_name: "tauros-paldea-aqua",
          id: "10252",
          image: "/sprites/10252.webp",
          detailsFromPrev: null,
        },
      ],
    ],
  },
  "tauros-paldea-combat": {
    paths: [
      [
        {
          species_name: "tauros-paldea-combat",
          id: "10250",
          image: "/sprites/10250.webp",
          detailsFromPrev: null,
        },
      ],
    ],
  },
  "tauros-paldea-blaze": {
    paths: [
      [
        {
          species_name: "tauros-paldea-blaze",
          id: "10251",
          image: "/sprites/10251.webp",
          detailsFromPrev: null,
        },
      ],
    ],
  },
  "tauros-paldea-aqua": {
    paths: [
      [
        {
          species_name: "tauros-paldea-aqua",
          id: "10252",
          image: "/sprites/10252.webp",
          detailsFromPrev: null,
        },
      ],
    ],
  },

  // --- RAICHU (ALOLA) ---
  "raichu-alola": {
    paths: [
      [
        {
          species_name: "pichu",
          id: "172",
          image: "/sprites/172.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "pikachu",
          id: "25",
          image: "/sprites/25.webp",
          detailsFromPrev: {
            min_happiness: 220,
            trigger: { name: "high-friendship", url: "" },
          },
        },
        {
          species_name: "raichu-alola",
          id: "10100",
          image: "/sprites/10100.webp",
          detailsFromPrev: {
            item: { name: "thunder-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- EXEGGUTOR (ALOLA) ---
  "exeggutor-alola": {
    paths: [
      [
        {
          species_name: "exeggcute",
          id: "102",
          image: "/sprites/102.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "exeggutor-alola",
          id: "10114",
          image: "/sprites/10114.webp",
          detailsFromPrev: {
            item: { name: "leaf-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- MAROWAK (ALOLA) ---
  "marowak-alola": {
    paths: [
      [
        {
          species_name: "cubone",
          id: "104",
          image: "/sprites/104.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "marowak-alola",
          id: "10115",
          image: "/sprites/10115.webp",
          detailsFromPrev: {
            min_level: 28,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- TYPHLOSION (HISUI) ---
  "typhlosion-hisui": {
    paths: [
      [
        {
          species_name: "cyndaquil",
          id: "155",
          image: "/sprites/155.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "quilava",
          id: "156",
          image: "/sprites/156.webp",
          detailsFromPrev: {
            min_level: 14,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "typhlosion-hisui",
          id: "10233",
          image: "/sprites/10233.webp",
          detailsFromPrev: {
            min_level: 36,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- SAMUROTT (HISUI) ---
  "samurott-hisui": {
    paths: [
      [
        {
          species_name: "oshawott",
          id: "501",
          image: "/sprites/501.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "dewott",
          id: "502",
          image: "/sprites/502.webp",
          detailsFromPrev: {
            min_level: 17,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "samurott-hisui",
          id: "10236",
          image: "/sprites/10236.webp",
          detailsFromPrev: {
            min_level: 36,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- PIKACHU (Kanto vs Alola) ---
  pikachu: {
    paths: [
      // Ruta 1: Hacia Raichu Clásico
      [
        {
          species_name: "pichu",
          id: "172",
          image: "/sprites/172.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "pikachu",
          id: "25",
          image: "/sprites/25.webp",
          detailsFromPrev: {
            min_happiness: 220,
            trigger: { name: "high-friendship", url: "" },
          },
        },
        {
          species_name: "raichu",
          id: "26",
          image: "/sprites/26.webp",
          detailsFromPrev: {
            item: { name: "thunder-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
      // Ruta 2: Hacia Raichu de Alola (Bifurcación)
      [
        {
          species_name: "pichu",
          id: "172",
          image: "/sprites/172.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "pikachu",
          id: "25",
          image: "/sprites/25.webp",
          detailsFromPrev: {
            min_happiness: 220,
            trigger: { name: "high-friendship", url: "" },
          },
        },
        {
          species_name: "raichu-alola",
          id: "10100",
          image: "/sprites/10100.webp",
          detailsFromPrev: {
            item: { name: "thunder-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- EXEGGCUTE (Kanto vs Alola) ---
  exeggcute: {
    paths: [
      // Ruta 1: Exeggutor Clásico
      [
        {
          species_name: "exeggcute",
          id: "102",
          image: "/sprites/102.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "exeggutor",
          id: "103",
          image: "/sprites/103.webp",
          detailsFromPrev: {
            item: { name: "leaf-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
      // Ruta 2: Exeggutor de Alola
      [
        {
          species_name: "exeggcute",
          id: "102",
          image: "/sprites/102.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "exeggutor-alola",
          id: "10114",
          image: "/sprites/10114.webp",
          detailsFromPrev: {
            item: { name: "leaf-stone", url: "" },
            trigger: { name: "use-item", url: "" },
          },
        },
      ],
    ],
  },

  // --- CUBONE (Kanto vs Alola) ---
  cubone: {
    paths: [
      // Ruta 1: Marowak Clásico
      [
        {
          species_name: "cubone",
          id: "104",
          image: "/sprites/104.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "marowak",
          id: "105",
          image: "/sprites/105.webp",
          detailsFromPrev: {
            min_level: 28,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
      // Ruta 2: Marowak de Alola
      [
        {
          species_name: "cubone",
          id: "104",
          image: "/sprites/104.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "marowak-alola",
          id: "10115",
          image: "/sprites/10115.webp",
          detailsFromPrev: {
            min_level: 28,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  // --- ROWLET (Clásico/Alola vs Hisui) ---
  rowlet: {
    paths: [
      // Ruta 1: Decidueye Clásico (Alola)
      [
        {
          species_name: "rowlet",
          id: "722",
          image: "/sprites/722.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "dartrix",
          id: "723",
          image: "/sprites/723.webp",
          detailsFromPrev: {
            min_level: 17,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "decidueye",
          id: "724",
          image: "/sprites/724.webp",
          detailsFromPrev: {
            min_level: 34,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
      // Ruta 2: Decidueye de Hisui
      [
        {
          species_name: "rowlet",
          id: "722",
          image: "/sprites/722.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "dartrix",
          id: "723",
          image: "/sprites/723.webp",
          detailsFromPrev: {
            min_level: 17,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "decidueye-hisui",
          id: "10244",
          image: "/sprites/10244.webp",
          detailsFromPrev: {
            min_level: 36,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },
};
