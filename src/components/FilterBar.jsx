import React from "react";
import PropTypes from "prop-types";

const filterOptions = [
  { key: "upcoming", label: "Upcoming" },
  { key: "played", label: "Played" },
];

export function FilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 bg-slate-900/40 border border-slate-800/70 rounded-2xl px-2 py-2 shadow-inner shadow-black/15">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            aria-pressed={isActive}
            className={[
              "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all group",
              "border border-slate-800 bg-gradient-to-br from-slate-900/85 to-slate-950/75 hover:border-slate-700 hover:from-slate-900 hover:to-slate-900",
              "shadow-sm shadow-black/20 text-slate-200",
              isActive &&
                "border-cyan-200/70 text-cyan-50 bg-gradient-to-br from-cyan-400/12 via-cyan-300/10 to-emerald-300/10 ring-1 ring-cyan-300/30 shadow-cyan-300/15",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full mr-2 align-middle transition",
                isActive ? "bg-cyan-300" : "bg-slate-600",
              ]
                .filter(Boolean)
                .join(" ")}
            />
              {option.label}
            </button>
          );
        })}
    </div>
  );
}

FilterBar.propTypes = {
  activeFilter: PropTypes.oneOf(["upcoming", "played"]).isRequired,
  onChange: PropTypes.func.isRequired,
};
