import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directorio de salida en public/sprites
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sprites');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadAndConvertSprites() {
  try {
    const listPath = path.join(process.cwd(), 'public', 'data', 'pokemonList.json');
    if (!fs.existsSync(listPath)) {
      console.error('No se encontró el archivo pokemonList.json en public/data/');
      return;
    }

    const rawData = fs.readFileSync(listPath, 'utf-8');
    const pokemonList = JSON.parse(rawData);

    console.log(`🚀 Iniciando descarga y conversión a WebP de ${pokemonList.length} Pokémon...`);

    for (const pokemon of pokemonList) {
      const id = pokemon.id;
      const imageUrl = pokemon.sprites?.other?.['official-artwork'] || pokemon.sprites?.front_default;

      if (!imageUrl) continue;

      const filePath = path.join(OUTPUT_DIR, `${id}.webp`);

      if (fs.existsSync(filePath)) continue; // Si ya existe, lo salta

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(filePath);

        console.log(`✅ Procesado: Pokémon #${id}`);
      } catch (err) {
        console.error(`❌ Error en Pokémon #${id}:`, err.message);
      }
    }

    console.log('🎉 ¡Todas las imágenes listas en /public/sprites/!');
  } catch (error) {
    console.error('Error general:', error);
  }
}

downloadAndConvertSprites();