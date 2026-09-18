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
import { Navbar } from "../components/Navbar/Navbar"; // Si usas Navbar arriba

export const PokedleView = ({ onBack, onOpenPokedle }) => {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [query, setQuery] = useState("");
  const [isWon, setIsWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function initGame() {
      try {
        const data = await getCachedPokemonList();
        if (data && data.length > 0) {
          setAllPokemon(data);
          const dailyBasic = getDailyPokemon(data);

          if (!dailyBasic) return;

          let fullDaily = dailyBasic;

          // Si le faltan datos detallados, cargamos su JSON local correspondiente de la carpeta public/data/pokemon/
          if (!dailyBasic.stats || !dailyBasic.weight) {
            try {
              const response = await fetch(
                `/data/pokemon/${dailyBasic.id}.json`,
              );
              if (response.ok) {
                fullDaily = await response.json();
              } else {
                console.error(
                  `No se pudo cargar el archivo local para el ID ${dailyBasic.id}`,
                );
              }
            } catch (e) {
              console.warn("Error al cargar el JSON detallado local:", e);
            }
          }

          setTargetPokemon(fullDaily);
          console.log("🎯 POKÉMON DEL DÍA CARGADO DESDE LOCAL:", fullDaily);

        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initGame();
  }, []);

  

  const handleGuessSubmit = async (pokemonToGuess) => {
    if (gameOver || isWon || !targetPokemon) return;

    // Evitar repetir el mismo Pokémon
    if (guesses.some(g => g.pokemon.id === pokemonToGuess.id)) {
      setQuery('');
      return;
    }

    let fullGuess = pokemonToGuess;

    // Si al Pokémon elegido le faltan los stats o el peso, cargamos su JSON local detallado
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
    setQuery('');

    if (evaluation.isWinner) {
      setIsWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= 8) {
      setGameOver(true);
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

  // Helper para mostrar nombres traducidos o en texto limpio
  const getPokeName = (p) => {
    if (!p) return "";
    if (typeof p.name === "object")
      return p.name[lang] || p.name.en || p.name.es || "Unknown";
    return p.name;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-16">
      {/* Si tienes la Navbar unificada */}
      <Navbar onOpenPokedle={onOpenPokedle} />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#161d31] hover:bg-slate-800 border-2 border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 transition-all"
          >
            ← {lang === "es" ? "Volver a la Pokédex" : "Back to Pokédex"}
          </button>

        </div>

        <main className="bg-[#121826] border-2 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              PókEdle <span className="text-amber-400">Diario</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {lang === "es"
                ? "Adivina el Pokémon oculto del día en base a sus atributos."
                : "Guess today’s hidden Pokémon based on its attributes."}
            </p>
          </div>

          {/* Buscador / Input de intentos */}
          {!gameOver ? (
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
            <div className="text-center p-6 bg-[#1a2234] border-2 border-amber-500/40 rounded-2xl mb-8">
              <h2 className="text-2xl font-black text-amber-400">
                {isWon
                  ? lang === "es"
                    ? "¡Felicidades! Has ganado 🎉"
                    : "Congratulations! You won 🎉"
                  : lang === "es"
                    ? "¡Se acabaron los intentos!"
                    : "Game Over!"}
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                El Pokémon era:{" "}
                <strong className="text-white uppercase">
                  {getPokeName(targetPokemon)}
                </strong>
              </p>
            </div>
          )}

          {/* Tabla de Pistas / Intentos Realizados */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="p-3">Pokémon</th>
                  <th className="p-3">Tipo 1</th>
                  <th className="p-3">Tipo 2</th>
                  <th className="p-3">Evolución</th>
                  <th className="p-3">Peso</th>
                  <th className="p-3">Stats Totales</th>
                  <th className="p-3">Debilidades</th>
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
                          src={
                            item.pokemon.sprites?.front_default ||
                            item.pokemon.image
                          }
                          alt=""
                          className="w-8 h-8 object-contain"
                        />
                        <span>{pName}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.type1.status)}`}
                        >
                          {item.type1.value ? item.type1.value : "—"} (
                          {item.type1.status === "correct" ? "✓" : "✗"})
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-lg border ${getStatusColor(item.type2.status)}`}
                        >
                          {item.type2.value ? item.type2.value : "—"} (
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
                          {/* CORREGIDO: Usamos .value en lugar del objeto entero */}
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
                          {/* CORREGIDO: Usamos .value */}
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
                          {/* CORREGIDO: Usamos .value */}
                          {item.weaknesses.value}{" "}
                          {item.weaknesses.status === "higher"
                            ? "⬆️"
                            : item.weaknesses.status === "lower"
                              ? "⬇️"
                              : ""}
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
