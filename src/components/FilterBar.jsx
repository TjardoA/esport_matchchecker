import React from "react";
import PropTypes from "prop-types";

const filterOptions = [
  { key: "upcoming", label: "Upcoming" },
  { key: "played", label: "Played" },
];

export function FilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 bg-stone-900/60 border border-stone-800/70 rounded-2xl px-2 py-2 shadow-inner shadow-black/15">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.key;
        const base =
          "relative px-4 py-2 rounded-xl text-sm font-semibold transition border shadow-sm shadow-black/20 text-stone-200";
        const active =
          "border-amber-300/70 text-amber-50 bg-amber-500/10 ring-1 ring-amber-200/30";
        const idle = "border-stone-800 bg-stone-950/80 hover:border-stone-700 hover:bg-stone-900";
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            aria-pressed={isActive}
            className={`${base} ${isActive ? active : idle}`}
          >
            <span className={`inline-block h-2 w-2 rounded-full mr-2 align-middle transition ${isActive ? "bg-amber-300" : "bg-stone-500"}`} />
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
