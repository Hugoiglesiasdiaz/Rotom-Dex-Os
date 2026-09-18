// Definición de los rangos de ID para cada generación oficial
export const GENERATION_RANGES = {
  1: { name: "Kanto", start: 1, end: 151 },
  2: { name: "Johto", start: 152, end: 251 },
  3: { name: "Hoenn", start: 252, end: 386 },
  4: { name: "Sinnoh", start: 387, end: 493 },
  5: { name: "Unova / Teselia", start: 494, end: 649 },
  6: { name: "Kalos", start: 650, end: 721 },
  7: { name: "Alola", start: 722, end: 809 },
  8: { name: "Galar", start: 810, end: 905 },
  9: { name: "Paldea", start: 906, end: 1025 }, // Puedes ajustar el límite superior según tus datos
};

// Función para obtener el número de generación dado un ID
export function getPokemonGeneration(id) {
  const numericId = Number(id);
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (numericId >= range.start && numericId <= range.end) {
      return Number(gen);
    }
  }
  // Si supera la gen 9 o es una forma especial alta, lo agrupamos en la última o devolvemos 9+
  return 9; 
}