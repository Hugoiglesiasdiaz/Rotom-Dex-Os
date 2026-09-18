import { useState, useEffect } from "react";
import { getCachedPokemonList } from "../utils/pokemonCache";
import {
  getDailyPokemon,
  evaluateGuess,
  getEvolutionStage,
  getTotalStats,
  getTotalWeaknesses,
} from "../utils/PokedleHelper";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/i18n";
import { Navbar } from "../components/Navbar/Navbar";

export const PokedleView = ({ onBack, onOpenPokedle }) => {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [query, setQuery] = useState("");
  const [isWon, setIsWon] = useState(false);
  const [streakData, setStreakData] = useState({
    streak: 0,
    hasPlayedToday: false,
  });

  const t = (key) => {
    const keys = key.split(".");
    let result = translations[lang];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  const translateType = (typeName) => {
    if (!typeName || typeName === "—") return "—";
    const lowerType = typeName.toLowerCase().trim();
    return translations[lang]?.types?.[lowerType] || typeName;
  };

  useEffect(() => {
    async function initGame() {
      try {
        const data = await getCachedPokemonList();
        if (data && data.length > 0) {
          setAllPokemon(data);
          const dailyBasic = getDailyPokemon(data);

          if (!dailyBasic) return;

          let fullDaily = dailyBasic;

          if (!dailyBasic.stats || !dailyBasic.weight) {
            try {
              const response = await fetch(
                `/data/pokemon/${dailyBasic.id}.json`,
              );
              if (response.ok) {
                fullDaily = await response.json();
              }
            } catch (e) {
              console.warn("Error al cargar el JSON detallado local:", e);
            }
          }

          setTargetPokemon(fullDaily);

          // Cargar racha actual y comprobar si ya se completó el día de hoy
          loadAndVerifyStreak(fullDaily.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initGame();
  }, []);

  const loadAndVerifyStreak = (targetId) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const savedData = JSON.parse(
      localStorage.getItem("pokedle_streak_data"),
    ) || {
      streak: 0,
      lastSolvedDate: null,
      lastGuessedId: null,
    };

    // Comprobar si perdió la racha por inactividad de más de 1 día
    let currentStreak = savedData.streak;
    if (savedData.lastSolvedDate) {
      const lastDate = new Date(savedData.lastSolvedDate);
      const currentDate = new Date(todayStr);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        currentStreak = 0;
      }
    }

    const alreadyDone = savedData.lastSolvedDate === todayStr;
    setStreakData({ streak: currentStreak, hasPlayedToday: alreadyDone });
  };

  const handleGuessSubmit = async (pokemonToGuess) => {
    if (isWon || !targetPokemon) return;

    if (guesses.some((g) => g.pokemon.id === pokemonToGuess.id)) {
      setQuery("");
      return;
    }

    let fullGuess = pokemonToGuess;

    if (!fullGuess.stats || !fullGuess.weight) {
      try {
        const response = await fetch(`/data/pokemon/${fullGuess.id}.json`);
        if (response.ok) {
          fullGuess = await response.json();
        }
      } catch (e) {
        console.warn("No se pudo cargar el JSON detallado del intento", e);
      }
    }

    const evaluation = evaluateGuess(fullGuess, targetPokemon);
    const newGuesses = [evaluation, ...guesses];
    setGuesses(newGuesses);
    setQuery("");

    if (evaluation.isWinner) {
      setIsWon(true);

      // Actualizar racha solo si es la primera vez que acierta hoy
      const todayStr = new Date().toISOString().split("T")[0];
      const savedData = JSON.parse(
        localStorage.getItem("pokedle_streak_data"),
      ) || {
        streak: 0,
        lastSolvedDate: null,
      };

      if (savedData.lastSolvedDate !== todayStr) {
        let newStreak = savedData.streak;
        if (savedData.lastSolvedDate) {
          const lastDate = new Date(savedData.lastSolvedDate);
          const currentDate = new Date(todayStr);
          const diffDays = Math.ceil(
            Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24),
          );
          if (diffDays > 1) newStreak = 0;
        }
        newStreak += 1;

        const newData = {
          streak: newStreak,
          lastSolvedDate: todayStr,
          lastGuessedId: targetPokemon.id,
        };
        localStorage.setItem("pokedle_streak_data", JSON.stringify(newData));
        setStreakData({ streak: newStreak, hasPlayedToday: true });
      }
    }
  };

  const filteredSuggestions = allPokemon
    .filter((p) => {
      if (!query.trim()) return false;
      const q = query.toLowerCase();
      const name =
        typeof p.name === "object"
          ? (p.name[lang] || p.name.en || "").toLowerCase()
          : p.name.toLowerCase();
      const idStr = String(p.id);
      return name.includes(q) || idStr.includes(q);
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getPokeImage = (p) => {
    if (!p) return "";
    return p.sprites?.front_default || p.image || "";
  };

  const getPokeName = (p) => {
    if (!p) return "";
    if (typeof p.name === "object")
      return p.name[lang] || p.name.en || p.name.es || "Unknown";
    return p.name;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-16">
      <Navbar onOpenPokedle={onOpenPokedle} />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#161d31] hover:bg-slate-800 border-2 border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 transition-all"
          >
            ← {lang === "es" ? "Volver a la Pokédex" : "Back to Pokédex"}
          </button>

          {/* RACHA FIJA VISIBLE ARRIBA */}
          <div className="px-4 py-2 bg-[#161d31] border-2 border-slate-700 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 shadow-md">
            <span>🔥 {lang === "es" ? "Racha:" : "Streak:"}</span>
            <strong className="text-emerald-400 text-sm">
              {streakData.streak} {lang === "es" ? "días" : "days"}
            </strong>
          </div>
        </div>

        <main className="bg-[#121826] border-2 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              PókEdle{" "}
              <span className="text-amber-400">
                {lang === "es" ? "Diario" : "Daily"}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {lang === "es"
                ? "Adivina el Pokémon oculto del día en base a sus atributos."
                : "Guess today’s hidden Pokémon based on its attributes."}
            </p>
          </div>

          {!isWon ? (
            <div className="relative max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder={
                  lang === "es"
                    ? "Escribe un Pokémon para adivinar..."
                    : "Type a Pokémon to guess..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#161d31] border-2 border-slate-700 rounded-2xl text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
              />
              {filteredSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-2 bg-[#161d31] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                  {filteredSuggestions.map((p) => {
                    const displayName = getPokeName(p);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleGuessSubmit(p)}
                        className="px-4 py-3 hover:bg-amber-400/10 cursor-pointer flex items-center justify-between border-b border-slate-800 last:border-none"
                      >
                        <span className="font-mono text-white font-bold">
                          {displayName}
                        </span>
                        <span className="font-mono text-xs text-amber-400">
                          #{String(p.id).padStart(3, "0")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-[#1a2234] border-2 border-amber-500/40 rounded-2xl mb-8 flex flex-col items-center">
              {targetPokemon && (
                <div className="mb-4">
                  <img
                    src={getPokeImage(targetPokemon)}
                    alt={getPokeName(targetPokemon)}
                    className="w-28 h-28 object-contain mx-auto drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-bounce"
                  />
                </div>
              )}
              <h2 className="text-2xl font-black text-amber-400">
                {lang === "es"
                  ? "¡Felicidades! Has ganado 🎉"
                  : "Congratulations! You won 🎉"}
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                {lang === "es" ? "El Pokémon era:" : "The Pokémon was:"}{" "}
                <strong className="text-white uppercase">
                  {getPokeName(targetPokemon)}
                </strong>
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#101622] border border-slate-700 rounded-xl text-xs font-mono text-slate-300">
                <span>
                  🎯 {lang === "es" ? "Intentos necesarios:" : "Total guesses:"}{" "}
                  <strong className="text-amber-400">{guesses.length}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Tabla de Pistas / Intentos Realizados */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead className="border-b-2 border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="p-3">
                    {lang === "es" ? "Pokémon" : "Pokémon"}
                  </th>
                  <th className="p-3">{lang === "es" ? "Tipo 1" : "Type 1"}</th>
                  <th className="p-3">{lang === "es" ? "Tipo 2" : "Type 2"}</th>
                  <th className="p-3">
                    {lang === "es" ? "Evolución" : "Evolution"}
                  </th>
                  <th className="p-3">{lang === "es" ? "Peso" : "Weight"}</th>
                  <th className="p-3">
                    {lang === "es" ? "Stats Totales" : "Total Stats"}
                  </th>
                  <th className="p-3">
                    {lang === "es" ? "Debilidades" : "Weaknesses"}
                  </th>
                  {/* NUEVA COLUMNA DE GENERACIÓN */}
                  <th className="p-3">
                    {lang === "es" ? "Generación" : "Generation"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {guesses.map((item, idx) => {
                  const getStatusColor = (status) => {
                    if (status === "correct")
                      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
                    if (status === "higher")
                      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
                    if (status === "lower")
                      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
                    return "bg-rose-500/20 text-rose-400 border-rose-500/40";
                  };

                  const pName = getPokeName(item.pokemon);

                  return (
                    <tr
                      key={idx}
                      className="border-b border-slate-800/60 font-mono text-xs"
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-2 justify-center">
                        <img
                          src={getPokeImage(item.pokemon)}
                          alt=""
                          className="w-8 h-8 object-contain"
                        />
                        <span>{pName}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.type1.status)}`}
                        >
                          {translateType(item.type1.value)} (
                          {item.type1.status === "correct" ? "✓" : "✗"})
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.type2.status)}`}
                        >
                          {translateType(item.type2.value)} (
                          {item.type2.status === "correct" ? "✓" : "✗"})
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.evolutionStage.status)}`}
                        >
                          {item.evolutionStage.value}{" "}
                          {item.evolutionStage.status === "higher"
                            ? "⬆️"
                            : item.evolutionStage.status === "lower"
                              ? "⬇️"
                              : ""}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.weight.status)}`}
                        >
                          {item.weight.value} kg{" "}
                          {item.weight.status === "higher"
                            ? "⬆️"
                            : item.weight.status === "lower"
                              ? "⬇️"
                              : ""}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.totalStats.status)}`}
                        >
                          {item.totalStats.value}{" "}
                          {item.totalStats.status === "higher"
                            ? "⬆️"
                            : item.totalStats.status === "lower"
                              ? "⬇️"
                              : ""}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.weaknesses.status)}`}
                        >
                          {item.weaknesses.value}{" "}
                          {item.weaknesses.status === "higher"
                            ? "⬆️"
                            : item.weaknesses.status === "lower"
                              ? "⬇️"
                              : ""}
                        </span>
                      </td>

                      {/* NUEVA CELDA DE GENERACIÓN */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.generation.status)}`}
                        >
                          Gen {item.generation.value} (
                          {item.generation.status === "correct" ? "✓" : "✗"})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
