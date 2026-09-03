const TYPE_THEMES = {
  normal: {
    bg: 'from-slate-900/30 via-slate-900/60 to-slate-900',
    border: 'border-slate-700 hover:border-slate-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(148,163,184,0.06)]',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    accent: 'bg-slate-400'
  },
  fighting: {
    bg: 'from-amber-950/30 via-slate-900/70 to-slate-900',
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accent: 'bg-amber-400'
  },
  flying: {
    bg: 'from-sky-950/30 via-slate-900/70 to-slate-900',
    border: 'border-sky-500/40 hover:border-sky-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    accent: 'bg-sky-400'
  },
  poison: {
    bg: 'from-purple-950/40 via-slate-900/80 to-slate-900',
    border: 'border-purple-500/40 hover:border-purple-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accent: 'bg-purple-400'
  },
  ground: {
    bg: 'from-yellow-950/30 via-slate-900/70 to-slate-900',
    border: 'border-yellow-700/40 hover:border-yellow-600',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,0,0.12)]',
    badge: 'bg-yellow-700/20 text-yellow-300 border-yellow-700/30',
    accent: 'bg-yellow-600'
  },
  rock: {
    bg: 'from-stone-950/30 via-slate-900/70 to-slate-900',
    border: 'border-stone-500/40 hover:border-stone-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(120,113,108,0.12)]',
    badge: 'bg-stone-700/20 text-stone-300 border-stone-700/30',
    accent: 'bg-stone-500'
  },
  bug: {
    bg: 'from-emerald-950/30 via-slate-900/70 to-slate-900',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.14)]',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accent: 'bg-emerald-400'
  },
  ghost: {
    bg: 'from-violet-950/30 via-slate-900/70 to-slate-900',
    border: 'border-violet-500/40 hover:border-violet-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.14)]',
    badge: 'bg-violet-700/20 text-violet-300 border-violet-700/30',
    accent: 'bg-violet-500'
  },
  steel: {
    bg: 'from-slate-800/30 via-slate-900/80 to-slate-900',
    border: 'border-slate-500/40 hover:border-slate-400',
    glow: 'group-hover:shadow-[0_0_18px_rgba(148,163,184,0.12)]',
    badge: 'bg-slate-700/20 text-slate-300 border-slate-700/30',
    accent: 'bg-slate-500'
  },
  fire: {
    bg: 'from-orange-950/40 via-slate-900/80 to-slate-900',
    border: 'border-orange-500/40 hover:border-orange-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(249,115,22,0.18)]',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    accent: 'bg-orange-400'
  },
  water: {
    bg: 'from-blue-950/40 via-slate-900/80 to-slate-900',
    border: 'border-blue-500/40 hover:border-blue-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    accent: 'bg-blue-400'
  },
  grass: {
    bg: 'from-emerald-950/40 via-slate-900/80 to-slate-900',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accent: 'bg-emerald-400'
  },
  electric: {
    bg: 'from-amber-950/40 via-slate-900/80 to-slate-900',
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.18)]',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accent: 'bg-amber-400'
  },
  psychic: {
    bg: 'from-pink-950/30 via-slate-900/70 to-slate-900',
    border: 'border-pink-500/40 hover:border-pink-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(236,72,153,0.14)]',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    accent: 'bg-pink-400'
  },
  ice: {
    bg: 'from-cyan-950/30 via-slate-900/70 to-slate-900',
    border: 'border-cyan-500/40 hover:border-cyan-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(34,211,238,0.14)]',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    accent: 'bg-cyan-400'
  },
  dragon: {
    bg: 'from-indigo-950/30 via-slate-900/70 to-slate-900',
    border: 'border-indigo-500/40 hover:border-indigo-400',
    glow: 'group-hover:shadow-[0_0_25px_rgba(79,70,229,0.14)]',
    badge: 'bg-indigo-700/20 text-indigo-300 border-indigo-700/30',
    accent: 'bg-indigo-500'
  },
  dark: {
    bg: 'from-slate-950/50 via-slate-900/90 to-slate-900',
    border: 'border-slate-800/60 hover:border-slate-600',
    glow: 'group-hover:shadow-[0_0_25px_rgba(2,6,23,0.2)]',
    badge: 'bg-slate-800/20 text-slate-300 border-slate-800/30',
    accent: 'bg-slate-600'
  },
  fairy: {
    bg: 'from-pink-950/30 via-slate-900/70 to-slate-900',
    border: 'border-pink-400/40 hover:border-pink-300',
    glow: 'group-hover:shadow-[0_0_25px_rgba(244,114,182,0.12)]',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    accent: 'bg-pink-400'
  },
  unknown: {
    bg: 'from-slate-900/30 via-slate-900/60 to-slate-900',
    border: 'border-slate-700 hover:border-slate-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(148,163,184,0.06)]',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    accent: 'bg-slate-400'
  }
};

export function getTypeTheme(type) {
  if (!type || typeof type !== 'string') return TYPE_THEMES.normal;
  const key = type.toLowerCase();
  return TYPE_THEMES[key] || TYPE_THEMES.normal;
}

export default TYPE_THEMES;

// Default stat palettes (configurable). Values are hex colors used for gradients and glows.
export const STAT_PALETTES = {
  low: { label: 'Bajo', from: '#ef4444', to: '#f87171', glow: 'rgba(239,68,68,0.28)', badgeBg: '#7f1d1d' },
  regular: { label: 'Normal', from: '#f59e0b', to: '#fb923c', glow: 'rgba(245,158,11,0.26)', badgeBg: '#78350f' },
  optimal: { label: 'Bueno', from: '#10b981', to: '#34d399', glow: 'rgba(16,185,129,0.26)', badgeBg: '#064e3b' },
  elite: { label: 'Élite', from: '#06b6d4', to: '#0891b2', glow: 'rgba(6,182,212,0.3)', badgeBg: '#064e63' }
};

// Return stat palette. We allow an optional type to potentially customize palettes per type later.
export function getStatPalette(/* type */) {
  // For now we return the default palettes. This function centralizes palette retrieval for future overrides.
  return STAT_PALETTES;
}
