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
              "flex items-center justify-center w-12 h-12 rounded-full transition-all",
              "border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/90",
              "shadow-sm shadow-black/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-0",
              isActive && "border-cyan-300/80 bg-cyan-500/10",
            ]
              .filter(Boolean)
              .join(" ")}
            title={game.label}
            aria-label={game.label}
          >
            {game.logo ? (
              <>
                <span className="sr-only">{game.label}</span>
                <img
                  src={game.logo}
                  alt={`${game.label} logo`}
                  className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </>
            ) : (
              <>
                <span className="sr-only">{game.label}</span>
                <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold border border-slate-700 text-slate-200">
                  {game.badge}
                </span>
              </>
            )}
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
