import React from "react";
import PropTypes from "prop-types";
import games from "../data/games.json";

const statusBadgeStyles = {
  upcoming: "text-amber-300 bg-amber-500/10 border border-amber-400/30",
  played: "text-emerald-300 bg-emerald-500/10 border border-emerald-400/30",
};

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatTime = (value) => {
  const date = new Date(value);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

export function MatchCard({ match }) {
  const { teamA, teamB, teamAAbbr, teamBAbbr, date, status, score, accent, isLive, game } = match;
  const showScore = status === "played";
  const accentColor = accent || "#22d3ee";
  const live = status === "upcoming" && isLive;
  const gameMeta = games.find((g) => g.key === game);
  const gameLabel = gameMeta?.label || "Other";
  const gameLogo = gameMeta?.logo;

  return (
    <article className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 shadow-md shadow-black/30 flex flex-col gap-4 hover:border-slate-700/80 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {gameLogo ? (
            <img
              src={gameLogo}
              alt={`${gameLabel} logo`}
              className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900/80 object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-200 bg-slate-900/80">{gameLabel}</span>
          )}
          <span>{formatDate(date)}</span>
        </div>
        <span
          className={[
            "text-xs px-3 py-1 rounded-full tracking-wide border",
            live ? "text-rose-100 bg-rose-500/20 border-rose-400/40" : statusBadgeStyles[status],
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {live ? "Live" : status === "upcoming" ? "Upcoming" : "Played"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-full grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border border-white/10"
            style={{ backgroundColor: accentColor }}
          >
            {teamAAbbr || teamA.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">Team A</div>
            <div className="text-xl font-bold text-white leading-tight">{teamA}</div>
          </div>
        </div>
        <div className="text-sm text-slate-300 mx-1">vs</div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">Team B</div>
            <div className="text-xl font-bold text-white leading-tight">{teamB}</div>
          </div>
          <div
            className="w-12 h-12 rounded-full grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border border-white/10"
            style={{ backgroundColor: accentColor }}
          >
            {teamBAbbr || teamB.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {showScore && <div className="text-3xl font-extrabold text-emerald-300 tracking-wider min-w-[72px] text-right">{score}</div>}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-200 font-semibold">
        <span
          className="inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: live ? "#f87171" : "#38bdf8" }}
        ></span>
        <span>{live ? "Live now" : status === "played" ? "Final" : `Starts ${formatTime(date)}`}</span>
      </div>
    </article>
  );
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.number.isRequired,
    teamA: PropTypes.string.isRequired,
    teamAAbbr: PropTypes.string,
    teamB: PropTypes.string.isRequired,
    teamBAbbr: PropTypes.string,
    date: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["upcoming", "played"]).isRequired,
    score: PropTypes.string,
    accent: PropTypes.string,
    isLive: PropTypes.bool,
    game: PropTypes.string,
  }).isRequired,
};
