import React from "react";
import PropTypes from "prop-types";
import { MatchCard } from "./MatchCard";

export function MatchList({ matches, now }) {
  if (!matches.length) {
    return (
      <div className="text-stone-200 text-center py-10 border border-dashed border-stone-800 rounded-xl bg-stone-900/60">
        No matches found for this filter.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} now={now} />
      ))}
    </div>
  );
}

MatchList.propTypes = {
  matches: PropTypes.arrayOf(MatchCard.propTypes.match).isRequired,
  now: PropTypes.number.isRequired,
};
