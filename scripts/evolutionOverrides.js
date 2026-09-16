// src/scripts/evolutionOverrides.js
export const REGIONAL_EVOLUTION_OVERRIDES = {
  // --- MEOWTH / PERSIAN (ALOLA) ---
  "meowth-alola": {
    paths: [
      [
        {
          species_name: "meowth-alola",
          id: "10109",
          image: "/sprites/10109.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "persian-alola",
          id: "10110",
          image: "/sprites/10110.webp",
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

  // --- VULPIX / NINETALES (ALOLA) ---
  "vulpix-alola": {
    paths: [
      [
        {
          species_name: "vulpix-alola",
          id: "10107",
          image: "/sprites/10107.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "ninetales-alola",
          id: "10108",
          image: "/sprites/10108.webp",
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
          id: "10103",
          image: "/sprites/10103.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "sandslash-alola",
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

  "geodude-alola": {
    paths: [
      [
        {
          species_name: "geodude-alola",
          id: "10101",
          image: "/sprites/10101.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "graveler-alola",
          id: "10102",
          image: "/sprites/10102.webp",
          detailsFromPrev: {
            min_level: 25,
            trigger: { name: "level-up", url: "" },
          },
        },
        {
          species_name: "golem-alola",
          id: "10113",
          image: "/sprites/10113.webp",
          detailsFromPrev: { trigger: { name: "trade", url: "" } },
        },
      ],
    ],
  },

  "grimer-alola": {
    paths: [
      [
        {
          species_name: "grimer-alola",
          id: "10111",
          image: "/sprites/10111.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "muk-alola",
          id: "10112",
          image: "/sprites/10112.webp",
          detailsFromPrev: {
            min_level: 38,
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

  "rattata-alola": {
    paths: [
      [
        {
          species_name: "rattata-alola",
          id: "10099",
          image: "/sprites/10099.webp",
          detailsFromPrev: null,
        },
        {
          species_name: "raticate-alola",
          id: "10100",
          image: "/sprites/10100.webp",
          detailsFromPrev: {
            min_level: 20,
            time_of_day: "night",
            trigger: { name: "level-up", url: "" },
          },
        },
      ],
    ],
  },

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

  "sneasel-hisui": {
    paths: [
      [
        {
          species_name: "sneasel-hisui",
          id: "10237",
          image: "/sprites/10237.webp",
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

  "qwilfish-hisui": {
    paths: [
      [
        {
          species_name: "qwilfish-hisui",
          id: "10235",
          image: "/sprites/10235.webp",
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

  "wooper-paldea": {
    paths: [
      [
        {
          species_name: "wooper-paldea",
          id: "10255",
          image: "/sprites/10255.webp",
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
  "darumaka-galar": {
    paths: [
      [
        { species_name: "darumaka-galar", id: "10178", image: "/sprites/10178.webp", detailsFromPrev: null },
        { species_name: "darmanitan-galar", id: "10179", image: "/sprites/10179.webp", detailsFromPrev: { item: { name: "ice-stone", url: "" }, trigger: { name: "use-item", url: "" } } }
      ]
    ]
  },

  "corsola-galar": {
    paths: [
      [
        { species_name: "corsola-galar", id: "10175", image: "/sprites/10175.webp", detailsFromPrev: null },
        { species_name: "cursola", id: "864", image: "/sprites/864.webp", detailsFromPrev: { min_level: 38, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "zigzagoon-galar": {
    paths: [
      [
        { species_name: "zigzagoon-galar", id: "10170", image: "/sprites/10170.webp", detailsFromPrev: null },
        { species_name: "linoone-galar", id: "10171", image: "/sprites/10171.webp", detailsFromPrev: { min_level: 20, trigger: { name: "level-up", url: "" } } },
        { species_name: "obstagoon", id: "862", image: "/sprites/862.webp", detailsFromPrev: { min_level: 35, time_of_day: "night", trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "stantler-hisui": {
    paths: [
      [
        { species_name: "stantler", id: "234", image: "/sprites/234.webp", detailsFromPrev: null },
        { species_name: "wyrdeer", id: "899", image: "/sprites/899.webp", detailsFromPrev: { known_move: { name: "barrier-attack", url: "" }, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "basculin-hisui": {
    paths: [
      [
        { species_name: "basculin-hisui", id: "10234", image: "/sprites/10234.webp", detailsFromPrev: null },
        { species_name: "basculegion-hisui", id: "902", image: "/sprites/902.webp", detailsFromPrev: { min_damage_taken: 294, trigger: { name: "take-damage", url: "" } } }
      ]
    ]
  },

  "petilil-hisui": {
    paths: [
      [
        { species_name: "petilil", id: "548", image: "/sprites/548.webp", detailsFromPrev: null },
        { species_name: "lilligant-hisui", id: "10236", image: "/sprites/10236.webp", detailsFromPrev: { item: { name: "sun-stone", url: "" }, trigger: { name: "use-item", url: "" } } }
      ]
    ]
  },

  "rufflet-hisui": {
    paths: [
      [
        { species_name: "rufflet", id: "627", image: "/sprites/627.webp", detailsFromPrev: null },
        { species_name: "braviary-hisui", id: "10238", image: "/sprites/10238.webp", detailsFromPrev: { min_level: 54, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "goomy-hisui": {
    paths: [
      [
        { species_name: "goomy", id: "704", image: "/sprites/704.webp", detailsFromPrev: null },
        { species_name: "sliggoo-hisui", id: "10239", image: "/sprites/10239.webp", detailsFromPrev: { min_level: 40, trigger: { name: "level-up", url: "" } } },
        { species_name: "goodra-hisui", id: "10240", image: "/sprites/10240.webp", detailsFromPrev: { min_level: 50, weather: "rain", trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "bergmite-hisui": {
    paths: [
      [
        { species_name: "bergmite", id: "712", image: "/sprites/712.webp", detailsFromPrev: null },
        { species_name: "avalugg-hisui", id: "10241", image: "/sprites/10241.webp", detailsFromPrev: { min_level: 37, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },
  "tauros-paldea": {
    paths: [
      [
        { species_name: "tauros-paldea", id: "10250", image: "/sprites/10250.webp", detailsFromPrev: null }
      ],
      [
        { species_name: "tauros-paldea-combat", id: "10251", image: "/sprites/10251.webp", detailsFromPrev: null }
      ],
      [
        { species_name: "tauros-paldea-blaze", id: "10252", image: "/sprites/10252.webp", detailsFromPrev: null }
      ],
      [
        { species_name: "tauros-paldea-aqua", id: "10253", image: "/sprites/10253.webp", detailsFromPrev: null }
      ]
    ]
  },

  "raichu-alola": {
    paths: [
      [
        { species_name: "pichu", id: "172", image: "/sprites/172.webp", detailsFromPrev: null },
        { species_name: "pikachu", id: "25", image: "/sprites/25.webp", detailsFromPrev: { min_happiness: 220, trigger: { name: "high-friendship", url: "" } } },
        { species_name: "raichu-alola", id: "10100", image: "/sprites/10100.webp", detailsFromPrev: { item: { name: "thunder-stone", url: "" }, trigger: { name: "use-item", url: "" } } }
      ]
    ]
  },

  "exeggutor-alola": {
    paths: [
      [
        { species_name: "exeggcute", id: "102", image: "/sprites/102.webp", detailsFromPrev: null },
        { species_name: "exeggutor-alola", id: "10114", image: "/sprites/10114.webp", detailsFromPrev: { item: { name: "leaf-stone", url: "" }, trigger: { name: "use-item", url: "" } } }
      ]
    ]
  },

  "marowak-alola": {
    paths: [
      [
        { species_name: "cubone", id: "104", image: "/sprites/104.webp", detailsFromPrev: null },
        { species_name: "marowak-alola", id: "10115", image: "/sprites/10115.webp", detailsFromPrev: { min_level: 28, time_of_day: "night", trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "typhlosion-hisui": {
    paths: [
      [
        { species_name: "cyndaquil", id: "155", image: "/sprites/155.webp", detailsFromPrev: null },
        { species_name: "quilava", id: "156", image: "/sprites/156.webp", detailsFromPrev: { min_level: 14, trigger: { name: "level-up", url: "" } } },
        { species_name: "typhlosion-hisui", id: "10243", image: "/sprites/10243.webp", detailsFromPrev: { min_level: 36, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "samurott-hisui": {
    paths: [
      [
        { species_name: "oshawott", id: "501", image: "/sprites/501.webp", detailsFromPrev: null },
        { species_name: "dewott", id: "502", image: "/sprites/502.webp", detailsFromPrev: { min_level: 17, trigger: { name: "level-up", url: "" } } },
        { species_name: "samurott-hisui", id: "10244", image: "/sprites/10244.webp", detailsFromPrev: { min_level: 36, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  },

  "decidueye-hisui": {
    paths: [
      [
        { species_name: "rowlet", id: "722", image: "/sprites/722.webp", detailsFromPrev: null },
        { species_name: "dartrix", id: "723", image: "/sprites/723.webp", detailsFromPrev: { min_level: 17, trigger: { name: "level-up", url: "" } } },
        { species_name: "decidueye-hisui", id: "10245", image: "/sprites/10245.webp", detailsFromPrev: { min_level: 36, trigger: { name: "level-up", url: "" } } }
      ]
    ]
  }
};
