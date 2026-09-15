import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold text-sm hover:bg-slate-700 transition-colors shadow-md border border-slate-700"
    >
      {lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
    </button>
  );
}