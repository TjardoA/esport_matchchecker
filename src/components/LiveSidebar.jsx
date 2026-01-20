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
    <aside className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 shadow-md shadow-black/25 space-y-4 self-start w-full min-h-[320px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Now playing</p>
          <h2 className="text-lg font-semibold text-white">Live matches</h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
          {liveMatches.length}
        </span>
      </div>

      {liveMatches.length === 0 ? (
        <div className="text-sm text-slate-400 border border-dashed border-slate-800 rounded-xl p-4">
          Geen live wedstrijden nu.
        </div>
      ) : (
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-3 shadow-sm shadow-black/20"
              style={{ boxShadow: `0 8px 20px -12px ${match.accent || "#22d3ee"}70` }}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{formatTime(match.date)}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-100 border border-rose-400/30 font-semibold">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 mb-2">
                {(() => {
                  const meta = games.find((g) => g.key === match.game);
                  if (meta?.logo) {
                    return (
                      <img
                        src={meta.logo}
                        alt={`${meta.label} logo`}
                        className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900/80 object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    );
                  }
                  return null;
                })()}
                <span className="px-2 py-1 rounded-full border border-slate-700 inline-block bg-slate-900/80">
                  {match.game ? match.game.toUpperCase() : "OTHER"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge label={match.teamAAbbr || match.teamA.slice(0, 2).toUpperCase()} color={match.accent} />
                  <div className="text-sm text-white font-semibold">{match.teamA}</div>
                </div>
                <span className="text-slate-300 text-xs">vs</span>
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
      style={{ backgroundColor: color || "#22d3ee" }}
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
      id: PropTypes.number.isRequired,
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
