import React from "react";
import PropTypes from "prop-types";
import games from "../data/games.json";

const statusBadgeStyles = {
  upcoming: "text-amber-200 bg-amber-500/8 border border-amber-300/30",
  played: "text-emerald-200 bg-emerald-500/8 border border-emerald-300/30",
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

export function MatchCard({ match, now }) {
  const { teamA, teamB, teamAAbbr, teamBAbbr, date, status, score, accent, isLive, game } = match;
  const showScore = status === "played";
  const accentColor = accent || "#22d3ee";
  const live = status === "upcoming" && isLive;
  const gameMeta = games.find((g) => g.key === game);
  const gameLabel = gameMeta?.label || "Other";
  const gameLogo = gameMeta?.logo;
  const startMs = new Date(date).getTime();
  const diff = startMs - now;

  const timeLabel = (() => {
    if (live) return "Live now";
    if (status === "played") return "Final";
    if (diff <= 0) return "Starting";
    const minutes = Math.ceil(diff / 60000);
    if (minutes < 60) return `Starts in ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `Starts in ${hours}h` : `Starts in ${hours}h ${mins}m`;
  })();

  return (
    <article
      className="relative overflow-hidden bg-slate-950/75 border border-slate-800/75 rounded-2xl p-5 sm:p-6 shadow-md shadow-black/30 flex flex-col gap-4 hover:border-slate-700/75 transition"
      style={{ boxShadow: `0 16px 36px -26px ${accentColor}70, 0 8px 24px -18px rgba(0,0,0,0.55)` }}
    >
      <div
        className="absolute inset-0 opacity-24 pointer-events-none"
        style={{
          background: `radial-gradient(520px at 18% 22%, ${accentColor}18, transparent 54%)`,
        }}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {gameLogo ? (
            <img
              src={gameLogo}
              alt={`${gameLabel} logo`}
              className="w-8 h-8 rounded-xl border border-slate-700 bg-slate-900/80 object-contain shadow-inner shadow-black/30"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <span className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 bg-slate-900/80 shadow-inner shadow-black/30">
              {gameLabel}
            </span>
          )}
          <span className="text-slate-300 font-semibold">{formatDate(date)}</span>
        </div>
        <span
          className={[
            "text-xs px-3 py-1.5 rounded-full tracking-wide border shadow-sm shadow-black/15",
            live ? "text-rose-100 bg-rose-500/20 border-rose-400/40" : statusBadgeStyles[status],
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {live ? "Live" : status === "upcoming" ? "Upcoming" : "Played"}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border border-white/10"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
          >
            {teamAAbbr || teamA.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">Team A</div>
            <div className="text-xl font-bold text-white leading-tight truncate sm:whitespace-normal">{teamA}</div>
          </div>
        </div>
        <div className="text-sm text-slate-300 text-center sm:hidden">vs</div>
        <div className="flex items-center gap-3 flex-1 w-full sm:justify-end">
          <div className="flex-1 min-w-0 sm:text-right">
            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">Team B</div>
            <div className="text-xl font-bold text-white leading-tight truncate sm:whitespace-normal">{teamB}</div>
          </div>
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border border-white/10"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
          >
            {teamBAbbr || teamB.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {showScore && (
          <div className="w-full sm:w-auto text-center sm:text-right">
            <span className="inline-flex items-center justify-center text-3xl font-extrabold text-emerald-300 tracking-wider min-w-[92px] bg-emerald-500/10 border border-emerald-400/40 rounded-xl px-3 py-2 shadow-inner shadow-black/20">
              {score}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-200 font-semibold">
          <span
            className="inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: live ? "#f87171" : "#38bdf8" }}
          ></span>
          <span className="truncate">{timeLabel}</span>
          {status === "upcoming" && (
            <span className="hidden sm:inline text-slate-400 text-xs font-normal">· {formatTime(date)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
  now: PropTypes.number.isRequired,
};
