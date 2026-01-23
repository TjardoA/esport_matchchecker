import React from "react";
import PropTypes from "prop-types";
import games from "../data/games.json";

const formatTime = (value) => {
  const date = new Date(value);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

export function LiveSidebar({ liveMatches }) {
  return (
    <aside className="relative overflow-hidden bg-stone-950 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/28 space-y-4 self-start w-full min-h-[240px] sm:min-h-[320px]">
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Now playing</p>
          <h2 className="text-xl font-semibold text-white">Live matches</h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-100 border border-amber-300/40 shadow-inner shadow-black/20">
          {liveMatches.length}
        </span>
      </div>

      {liveMatches.length === 0 ? (
        <div className="relative text-sm text-stone-200 border border-dashed border-stone-800 rounded-xl p-4 bg-stone-900/70">
          Geen live wedstrijden nu.
        </div>
      ) : (
        <div className="relative space-y-3">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              className="rounded-xl border border-stone-800 bg-stone-900 p-3 shadow-md shadow-black/25"
              style={{
                borderLeftColor: match.accent || "#d97706",
                borderLeftWidth: "5px",
                borderLeftStyle: "solid",
              }}
            >
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2 gap-2">
                <span className="text-stone-100 font-semibold">{formatTime(match.date)}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-100 border border-amber-400/30 font-semibold">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-300 mb-2">
                {(() => {
                  const meta = games.find((g) => g.key === match.game);
                  if (meta?.logo) {
                    return (
                      <img
                        src={meta.logo}
                        alt={`${meta.label} logo`}
                        className="w-5 h-5 rounded-full border border-stone-700 bg-stone-900/80 object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    );
                  }
                  return null;
                })()}
                <span className="px-2 py-1 rounded-full border border-stone-700 inline-block bg-stone-900/80">
                  {match.game ? match.game.toUpperCase() : "OTHER"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge label={match.teamAAbbr || match.teamA.slice(0, 2).toUpperCase()} color={match.accent} />
                  <div className="text-sm text-white font-semibold">{match.teamA}</div>
                </div>
                <span className="text-stone-300 text-xs">vs</span>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white font-semibold text-right">{match.teamB}</div>
                  <Badge label={match.teamBAbbr || match.teamB.slice(0, 2).toUpperCase()} color={match.accent} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function Badge({ label, color }) {
  return (
    <div
      className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold text-white shadow-md shadow-black/30 border border-white/10"
      style={{ backgroundColor: color || "#d97706" }}
    >
      {label}
    </div>
  );
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

LiveSidebar.propTypes = {
  liveMatches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      teamA: PropTypes.string.isRequired,
      teamAAbbr: PropTypes.string,
      teamB: PropTypes.string.isRequired,
      teamBAbbr: PropTypes.string,
      date: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["upcoming", "played"]).isRequired,
      isLive: PropTypes.bool,
      accent: PropTypes.string,
      game: PropTypes.string,
    })
  ).isRequired,
};
