import fs from 'fs';
import path from 'path';

// Ruta donde tienes guardados los JSONs individuales de cada Pokémon
const DATA_DIR = '../public/data/pokemon';
async function updatePokemonsWithSpanishAbilities() {
  console.log("📥 Paso 1: Obteniendo el diccionario maestro de habilidades en español de la PokéAPI...");
  
  try {
    const listRes = await fetch('https://pokeapi.co/api/v2/ability?limit=400');
    const listData = await listRes.json();

    const abilityEsMap = {};

    for (const item of listData.results) {
      try {
        const res = await fetch(item.url);
        const data = await res.json();
        
        // Buscamos las entradas en español peninsular ('es')
        const spanishEntries = data.flavor_text_entries.filter(
          entry => entry.language.name === 'es'
        );

        // Nos quedamos con la última generación disponible y limpiamos saltos de línea
        let description = "Sin descripción disponible.";
        if (spanishEntries.length > 0) {
          const latestEntry = spanishEntries[spanishEntries.length - 1];
          description = latestEntry.flavor_text.replace(/[\n\f]/g, ' ');
        }

        // También guardamos el nombre oficial en español por si acaso
        const spanishNameObj = data.names.find(n => n.language.name === 'es');
        const nameEs = spanishNameObj ? spanishNameObj.name : item.name;

        // Mapeamos tanto por el nombre en inglés (slug de la API) como por el nombre en español por seguridad
        abilityEsMap[data.name.toLowerCase()] = {
          name: nameEs,
          description: description
        };
      } catch (err) {
        console.error(`⚠️ Error al obtener la habilidad ${item.name}:`, err.message);
      }
    }

    console.log(`✅ Diccionario maestro creado con éxito (${Object.keys(abilityEsMap).length} habilidades).\n`);
    console.log("📂 Paso 2: Actualizando los archivos JSON locales de los Pokémon...");

    // Leemos la carpeta de datos
    if (!fs.existsSync(DATA_DIR)) {
      console.error(`❌ No se encuentra la carpeta ${DATA_DIR}. Comprueba la ruta.`);
      return;
    }

    const files = fs.readdirSync(DATA_DIR);
    let updatedCount = 0;

    for (const file of files) {
      // Filtramos solo archivos tipo 1.json, 2.json, etc. (evitamos carpetas o archivos de texto)
      if (file.endsWith('.json') && !file.includes('abilities')) {
        const filePath = path.join(DATA_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        let pokemonData;
        try {
          pokemonData = JSON.parse(fileContent);
        } catch (e) {
          continue; // Si hay algún archivo que no sea JSON válido, lo salta
        }

        let modified = false;

        // Verificamos si el Pokémon tiene el array 'abilities'
        if (pokemonData.abilities && Array.isArray(pokemonData.abilities)) {
          for (const abilityObj of pokemonData.abilities) {
            // Buscamos por el nombre en inglés que ya tienes guardado
            const englishNameKey = abilityObj.name?.en ? abilityObj.name.en.toLowerCase().replace(/\s+/g, '-') : null;
            
            if (englishNameKey && abilityEsMap[englishNameKey]) {
              const matchedAbility = abilityEsMap[englishNameKey];

              // Si la descripción en español está vacía o dice por defecto "Sin descripción disponible."
              if (!abilityObj.description.es || abilityObj.description.es === "Sin descripción disponible.") {
                abilityObj.description.es = matchedAbility.description;
                modified = true;
              }

              // Opcional: asegurarnos también de que el nombre en español esté correcto
              if (!abilityObj.name.es || abilityObj.name.es === "") {
                abilityObj.name.es = matchedAbility.name;
                modified = true;
              }
            }
          }
        }

        // Si hubo cambios, reescribimos el archivo JSON del Pokémon
        if (modified) {
          fs.writeFileSync(filePath, JSON.stringify(pokemonData, null, 2), 'utf-8');
          updatedCount++;
        }
      }
    }

    console.log(`\n✨ ¡Proceso completado! Se actualizaron ${updatedCount} archivos de Pokémon con sus descripciones en español.`);

  } catch (error) {
    console.error("❌ Error crítico en el proceso:", error);
  }
}

updatePokemonsWithSpanishAbilities();