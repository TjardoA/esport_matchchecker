import React from "react";
import PropTypes from "prop-types";
import gamesData from "../data/games.json";

const games = [{ key: "all", label: "All", badge: "ALL" }, ...gamesData];

export function GameFilter({ activeGame, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {games.map((game) => {
        const isActive = activeGame === game.key;
        const base =
          "flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl transition border shadow-sm shadow-black/20 focus:outline-none focus:ring-2 focus:ring-purple-200/40";
        const active =
          "border-purple-300/70 bg-purple-500/10 text-purple-50 focus:ring-purple-200/50";
        const idle =
          "border-stone-800 bg-stone-950/80 hover:border-stone-700 hover:bg-stone-900 text-stone-200";
        return (
          <button
            key={game.key}
            onClick={() => onChange(game.key)}
            className={`${base} ${isActive ? active : idle}`}
            title={game.label}
            aria-label={game.label}
          >
            {game.logo ? (
              <>
                <span className="sr-only">{game.label}</span>
                <img
                  src={game.logo}
                  alt={`${game.label} logo`}
                  className="w-10 h-10 rounded-2xl border border-stone-700 bg-stone-800 object-contain shadow-inner shadow-black/30"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </>
            ) : (
              <>
                <span className="sr-only">{game.label}</span>
                <span className="inline-flex items-center justify-center rounded-xl bg-stone-800 px-3 py-1.5 text-[11px] font-bold border border-stone-700 text-stone-200 shadow-inner shadow-black/30">
                  {game.badge}
                </span>
              </>
            )}
            <span className="text-sm font-semibold text-stone-200 hidden sm:inline">{game.label}</span>
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
