import React from "react";
import PropTypes from "prop-types";
import gamesData from "../data/games.json";

const games = [{ key: "all", label: "All", badge: "ALL" }, ...gamesData];

export function GameFilter({ activeGame, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {games.map((game) => {
        const isActive = activeGame === game.key;
        return (
          <button
            key={game.key}
            onClick={() => onChange(game.key)}
            className={[
              "flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl transition-all",
              "border border-slate-800 bg-gradient-to-br from-slate-900/85 to-slate-950/75 hover:border-slate-700 hover:from-slate-900 hover:to-slate-900",
              "shadow-sm shadow-black/20 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:ring-offset-0",
              isActive &&
                "border-cyan-200/70 bg-gradient-to-br from-cyan-400/12 via-cyan-300/10 to-emerald-300/10 shadow-cyan-300/15",
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
                  className="w-10 h-10 rounded-2xl border border-slate-700 bg-slate-800 object-contain shadow-inner shadow-black/30"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </>
            ) : (
              <>
                <span className="sr-only">{game.label}</span>
                <span className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-3 py-1.5 text-[11px] font-bold border border-slate-700 text-slate-200 shadow-inner shadow-black/30">
                  {game.badge}
                </span>
              </>
            )}
            <span className="text-sm font-semibold text-slate-200 hidden sm:inline">{game.label}</span>
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
