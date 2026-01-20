import React, { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { MatchList } from "./components/MatchList";
import { LiveSidebar } from "./components/LiveSidebar";
import { GameFilter } from "./components/GameFilter";
import { fetchPandaMatches } from "./api/pandascore";
import rawMatches from "./data/matches.json";

export function App() {
  const [matches, setMatches] = useState(null);
  const [filter, setFilter] = useState("all");
  const [game, setGame] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("local");

  const loadMatches = async () => {
    const token = import.meta.env.VITE_PANDASCORE_TOKEN;
    if (!token) {
      setError("Geen PandaScore token gevonden; toon lokale data.");
      setSource("local");
      setMatches(rawMatches);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await fetchPandaMatches(token, { perPage: 40 });
      if (data.length) {
        setMatches(data);
        setSource("pandascore");
      } else {
        setMatches(rawMatches);
        setSource("local");
        setError("Geen remote matches ontvangen; toon lokale data.");
      }
    } catch (err) {
      console.error(err);
      setError("PandaScore ophalen mislukt; toon lokale data.");
      setMatches(rawMatches);
      setSource("local");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const allMatches = useMemo(
    () =>
      (matches || [])
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches],
  );

  const filteredMatches = useMemo(() => {
    let list = allMatches;
    if (filter === "all") {
      list = list.filter((match) => match.status !== "played");
    } else {
      list = list.filter((match) => match.status === filter);
    }
    if (game !== "all") {
      list = list.filter((match) => match.game === game);
    }
    return list;
  }, [filter, game, allMatches]);

  const liveMatches = useMemo(() => {
    const lives = allMatches.filter((match) => match.isLive);
    if (game === "all") return lives;
    return lives.filter((match) => match.game === game);
  }, [game, allMatches]);

  return (
    <div className="space-y-10">
      <header className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-lg shadow-black/25 backdrop-blur">
        <div className="space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">
                Esports tracker
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Match Overview
              </h1>
              <p className="text-slate-300 text-sm">
                Filter upcoming and played matches in one view.
              </p>
            </div>
            <FilterBar activeFilter={filter} onChange={setFilter} />
          </div>
          <GameFilter activeGame={game} onChange={setGame} />
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={[
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border",
                source === "pandascore"
                  ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                  : "border-amber-400/50 bg-amber-500/10 text-amber-100",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
              Data:{" "}
              {source === "pandascore" ? "PandaScore live" : "Lokale fallback"}
            </span>
            <button
              onClick={loadMatches}
              disabled={loading}
              className="px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-slate-600 hover:bg-slate-800/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Laden..." : "Refresh"}
            </button>
            {error && <span className="text-rose-200/90">{error}</span>}
          </div>
        </div>
      </header>

      <main className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <MatchList matches={filteredMatches} />
          </div>
          <LiveSidebar liveMatches={liveMatches} />
        </div>
      </main>
    </div>
  );
}

export default App;
