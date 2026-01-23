import React from "react";
import PropTypes from "prop-types";
import games from "../data/games.json";

const statusBadgeStyles = {
  upcoming: "text-amber-50 bg-amber-500/15 border border-amber-300/35",
  played: "text-emerald-50 bg-emerald-500/12 border border-emerald-300/35",
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
  const accentColor = accent || "#d97706";
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
      className="relative overflow-hidden bg-stone-950 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/30 flex flex-col gap-4 hover:border-stone-700 transition"
      style={{
        borderLeftColor: accentColor,
        borderLeftWidth: "6px",
        borderLeftStyle: "solid",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 text-xs text-stone-400">
          {gameLogo ? (
            <img
              src={gameLogo}
              alt={`${gameLabel} logo`}
              className="w-8 h-8 rounded-xl border border-stone-700 bg-stone-900/80 object-contain shadow-inner shadow-black/30"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <span className="px-3 py-1.5 rounded-xl border border-stone-700 text-stone-200 bg-stone-900/80 shadow-inner shadow-black/30">
              {gameLabel}
            </span>
          )}
          <span className="text-stone-200 font-semibold">{formatDate(date)}</span>
        </div>
        <span
          className={[
            "text-xs px-3 py-1.5 rounded-full tracking-wide border shadow-sm shadow-black/15",
            live ? "text-amber-50 bg-amber-600/15 border-amber-300/40" : statusBadgeStyles[status],
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
            className="w-14 h-14 rounded-2xl grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border"
            style={{ borderColor: accentColor, background: "#1b1c21", color: accentColor }}
          >
            {teamAAbbr || teamA.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-stone-400 uppercase tracking-wide mb-1">Team A</div>
            <div className="text-xl font-bold text-white leading-tight truncate sm:whitespace-normal">{teamA}</div>
          </div>
        </div>
        <div className="text-sm text-stone-300 text-center sm:hidden">vs</div>
        <div className="flex items-center gap-3 flex-1 w-full sm:justify-end">
          <div className="flex-1 min-w-0 sm:text-right">
            <div className="text-sm text-stone-400 uppercase tracking-wide mb-1">Team B</div>
            <div className="text-xl font-bold text-white leading-tight truncate sm:whitespace-normal">{teamB}</div>
          </div>
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-base font-bold text-white shadow-md shadow-black/40 border"
            style={{ borderColor: accentColor, background: "#1b1c21", color: accentColor }}
          >
            {teamBAbbr || teamB.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {showScore && (
          <div className="w-full sm:w-auto text-center sm:text-right">
            <span className="inline-flex items-center justify-center text-3xl font-extrabold text-amber-100 tracking-wider min-w-[92px] bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 shadow-inner shadow-black/20">
              {score}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-stone-200 font-semibold">
          <span
            className="inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: live ? "#ea580c" : "#d97706" }}
          ></span>
          <span className="truncate">{timeLabel}</span>
          {status === "upcoming" && (
            <span className="hidden sm:inline text-stone-400 text-xs font-normal">- {formatTime(date)}</span>
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



