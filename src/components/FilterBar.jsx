import React from "react";
import PropTypes from "prop-types";

const filterOptions = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "played", label: "Played" },
];

export function FilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={[
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              "border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/90",
              "shadow-sm shadow-black/15",
              isActive && "border-cyan-300/80 text-cyan-100 bg-cyan-500/10",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

FilterBar.propTypes = {
  activeFilter: PropTypes.oneOf(["all", "upcoming", "played"]).isRequired,
  onChange: PropTypes.func.isRequired,
};
