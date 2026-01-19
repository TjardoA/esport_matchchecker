import React from "react";
import PropTypes from "prop-types";
import gamesData from "../data/games.json";

const games = [{ key: "all", label: "All", badge: "ALL" }, ...gamesData];

export function GameFilter({ activeGame, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {games.map((game) => {
        const isActive = activeGame === game.key;
        return (
          <button
            key={game.key}
            onClick={() => onChange(game.key)}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all",
              "border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/90",
              "shadow-sm shadow-black/15",
              isActive && "border-cyan-300/80 text-cyan-100 bg-cyan-500/10",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {game.logo ? (
              <img
                src={game.logo}
                alt={`${game.label} logo`}
                className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold border border-slate-700 text-slate-200">
                {game.badge}
              </span>
            )}
            <span>{game.label}</span>
          </button>
        );
      })}
    </div>
  );
}

GameFilter.propTypes = {
  activeGame: PropTypes.oneOf(games.map((g) => g.key)).isRequired,
  onChange: PropTypes.func.isRequired,
};
