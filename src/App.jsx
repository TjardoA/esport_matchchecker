import React, { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { MatchList } from "./components/MatchList";
import { LiveSidebar } from "./components/LiveSidebar";
import { GameFilter } from "./components/GameFilter";
import { fetchPandaMatches } from "./api/pandascore";
import rawMatches from "./data/matches.json";

export function App() {
  const [matches, setMatches] = useState(null);
  const [filter, setFilter] = useState("upcoming");
  const [game, setGame] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("local");
  const [now, setNow] = useState(() => Date.now());

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

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const allMatches = useMemo(
    () =>
      (matches || [])
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches],
  );

  const filteredMatches = useMemo(() => {
    let list = allMatches.filter((match) => match.status === filter);
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
    <div className="space-y-10 sm:space-y-12">
      <header className="relative overflow-hidden rounded-3xl border border-stone-800/70 bg-stone-950/80 p-6 sm:p-7 shadow-[0_18px_56px_-38px_rgba(0,0,0,0.85)]">
        <div className="relative space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-purple-200/90 shadow-inner shadow-black/10">
                Esports tracker
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-purple-300" />
              </span>
              <div className="space-y-2">
                <h1
                  className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                  style={{ fontFamily: '"Barlow Semi Condensed", "Work Sans", "Segoe UI", sans-serif' }}
                >
                  Match Overview
                </h1>
                <p className="text-stone-200 text-sm sm:text-base max-w-2xl">
                  Bekijken en filteren van alle wedstrijden met een heldere splitsing tussen aankomende en gespeelde games.
                </p>
              </div>
            </div>
            <FilterBar activeFilter={filter} onChange={setFilter} />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <GameFilter activeGame={game} onChange={setGame} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm shadow-black/10 ${
                source === "pandascore"
                  ? "border-purple-300/70 bg-purple-500/15 text-purple-50"
                  : "border-stone-700 bg-stone-800 text-stone-100"
              }`}>
                <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
                Data:{" "}
                {source === "pandascore" ? "PandaScore live" : "Lokale fallback"}
              </span>
              <button
                onClick={loadMatches}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-stone-800 bg-stone-900/90 text-stone-50 hover:border-stone-700 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm shadow-black/20"
              >
                {loading ? "Laden..." : "Refresh"}
              </button>
              {error && <span className="text-purple-200/90">{error}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <MatchList matches={filteredMatches} now={now} />
          </div>
          <LiveSidebar liveMatches={liveMatches} />
        </div>
      </main>
    </div>
  );
}

export default App;
