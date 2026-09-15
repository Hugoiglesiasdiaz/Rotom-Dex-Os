import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.resolve(__dirname, '../src/data/pokemonFullData.json');
const outputDir = path.resolve(__dirname, '../public/data/pokemon');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Leyendo el archivo maestro...');
const rawData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

const pokemonList = [];

console.log(`Procesando ${rawData.length} Pokémon...`);

rawData.forEach((pokemon, index) => {
  const lightPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    sprites: pokemon.sprites
  };
  
  pokemonList.push(lightPokemon);

  const individualFilePath = path.join(outputDir, `${pokemon.id}.json`);
  fs.writeFileSync(individualFilePath, JSON.stringify(pokemon, null, 2));

  // Muestra progreso cada 50 Pokémon para no saturar la consola
  if ((index + 1) % 50 === 0 || index + 1 === rawData.length) {
    console.log(`Progreso: ${index + 1}/${rawData.length} procesados...`);
  }
});

const listOutputPath = path.resolve(__dirname, '../public/data/pokemonList.json');
fs.writeFileSync(listOutputPath, JSON.stringify(pokemonList, null, 2));

console.log(`¡División completada con éxito! Se creó 'pokemonList.json' y ${rawData.length} archivos individuales.`);