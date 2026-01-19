import React, { useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { MatchList } from "./components/MatchList";
import { LiveSidebar } from "./components/LiveSidebar";
import { GameFilter } from "./components/GameFilter";
import rawMatches from "./data/matches.json";

export function App() {
  const [filter, setFilter] = useState("all");
  const [game, setGame] = useState("all");

  const allMatches = useMemo(
    () =>
      [...rawMatches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  const filteredMatches = useMemo(() => {
    let list = allMatches;
    if (filter !== "all") {
      list = list.filter((match) => match.status === filter);
    }
    if (game !== "all") {
      list = list.filter((match) => match.game === game);
    }
    return list;
  }, [filter, game]);

  const liveMatches = useMemo(() => {
    const lives = allMatches.filter((match) => match.isLive);
    if (game === "all") return lives;
    return lives.filter((match) => match.game === game);
  }, [game]);

  return (
    <div className="space-y-10">
      <header className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-lg shadow-black/25 backdrop-blur">
        <div className="space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">Esports tracker</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">E-sports Match Overview</h1>
              <p className="text-slate-300 text-sm">Filter upcoming and played matches in one view.</p>
            </div>
            <FilterBar activeFilter={filter} onChange={setFilter} />
          </div>
          <GameFilter activeGame={game} onChange={setGame} />
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
