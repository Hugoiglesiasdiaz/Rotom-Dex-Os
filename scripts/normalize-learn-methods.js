const fs = require('fs');
const path = require('path');

const DATA_PATH = path.resolve(__dirname, '../src/data/pokemonFullData.json');
const BACKUP_PATH = path.resolve(__dirname, '../src/data/pokemonFullData.backup.json');

const MAP = {
  // Spanish variants
  'subida de nivel': 'level-up',
  'subida de nivel.': 'level-up',
  'subida de nivel ': 'level-up',
  'mt/tm': 'machine',
  'mt / mo': 'machine',
  'mt / mo.': 'machine',
  'mt / tm': 'machine',
  'mt/mo': 'machine',
  'tutor': 'tutor',
  'move-tutor': 'move-tutor',
  'huevo': 'egg',
  'huevo ': 'egg',
  'huevo-move': 'egg-move',
  'intercambio': 'trade',
  'estadio': 'stadium',
  'otro': 'other',

  // English/common keys
  'level up': 'level-up',
  'level-up': 'level-up',
  'levelup': 'level-up',
  'machine': 'machine',
  'tm': 'machine',
  'tutor': 'tutor',
  'egg': 'egg',
  'egg-move': 'egg-move',
  'trade': 'trade',
  'stadium': 'stadium',
  'other': 'other'
};

function normalizeMethod(raw) {
  if (!raw && raw !== 0) return raw;
  const s = String(raw).toLowerCase().trim();
  if (MAP[s]) return MAP[s];
  // Try removing punctuation
  const s2 = s.replace(/[^a-z0-9- ]/g, '').trim();
  if (MAP[s2]) return MAP[s2];
  // Fallback: if contains 'level' map to level-up
  if (s2.includes('level')) return 'level-up';
  if (s2.includes('mt') || s2.includes('tm') || s2.includes('machine')) return 'machine';
  if (s2.includes('egg')) return 'egg';
  if (s2.includes('tutor')) return 'tutor';
  if (s2.includes('trade') || s2.includes('intercambio')) return 'trade';
  return raw; // leave unchanged
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Data file not found:', DATA_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  fs.writeFileSync(BACKUP_PATH, raw, 'utf8');
  console.log('Backup written to', BACKUP_PATH);

  const data = JSON.parse(raw);
  let changed = 0;
  data.forEach((p) => {
    if (!p.moves) return;
    p.moves.forEach((m) => {
      if (!m.learn_method) return;
      const orig = m.learn_method;
      const norm = normalizeMethod(orig);
      if (norm !== orig) {
        m.learn_method = norm;
        changed += 1;
      }
    });
  });

  if (changed > 0) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Normalized ${changed} learn_method entries in ${DATA_PATH}`);
  } else {
    console.log('No learn_method entries changed');
  }
}

main();
