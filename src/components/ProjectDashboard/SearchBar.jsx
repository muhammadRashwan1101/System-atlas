import React, { memo, useMemo } from "react";

const SearchBar = memo(({ 
  filters, 
  onFilterChange, 
  onReset,
  managersOptions = ["Any", "Hager Mohamed", "Sarah K."],
  techLeadsOptions = ["Any", "Alex M.", "Maria G."],
  statusOptions = ["All", "ACTIVE", "CRITICAL", "SUSPENDED", "DEVELOPMENT"],
  envOptions = [
    { label: "All Environments", value: "All" },
    { label: "Production Ready", value: "production ready" },
    { label: "Development", value: "development" },
    { label: "Prototype", value: "prototype" },
    { label: "Staging", value: "staging" },
  ]
}) => {

  const isFiltered = useMemo(() => {
    return (
      filters.status !== "All" ||
      filters.targetEnvironment !== "All" ||
      filters.manager !== "Any" ||
      filters.techLead !== "Any"
    );
  }, [filters]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0b0d] p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 w-full shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        
        {/* STATUS FILTER */}
        <div className={`flex items-center bg-[#121520] border rounded px-2.5 py-1 transition-colors ${filters.status && filters.status !== "All" ? "border-sky-500/50" : "border-slate-800"}`}>
          <label htmlFor="status-filter" className="text-slate-500 mr-2 uppercase text-[10px] select-none">
            STATUS:
          </label>
          <select
            id="status-filter"
            aria-label="Filter by Status"
            value={filters.status || "All"}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0a0b0d]">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* ENV FILTER */}
        <div className={`flex items-center bg-[#121520] border rounded px-2.5 py-1 transition-colors ${filters.targetEnvironment && filters.targetEnvironment !== "All" ? "border-sky-500/50" : "border-slate-800"}`}>
          <label htmlFor="env-filter" className="text-slate-500 mr-2 uppercase text-[10px] select-none">
            ENV:
          </label>
          <select
            id="env-filter"
            aria-label="Filter by Environment"
            value={filters.targetEnvironment || "All"}
            onChange={(e) => onFilterChange("targetEnvironment", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {envOptions.map((env) => (
              <option key={env.value} value={env.value} className="bg-[#0a0b0d]">
                {env.label}
              </option>
            ))}
          </select>
        </div>

        {/* MANAGER FILTER */}
        <div className={`flex items-center bg-[#121520] border rounded px-2.5 py-1 transition-colors ${filters.manager && filters.manager !== "Any" ? "border-sky-500/50" : "border-slate-800"}`}>
          <label htmlFor="manager-filter" className="text-slate-500 mr-2 uppercase text-[10px] select-none">
            MANAGER:
          </label>
          <select
            id="manager-filter"
            aria-label="Filter by Manager"
            value={filters.manager || "Any"}
            onChange={(e) => onFilterChange("manager", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {managersOptions.map((mgr) => (
              <option key={mgr} value={mgr} className="bg-[#0a0b0d]">
                {mgr}
              </option>
            ))}
          </select>
        </div>

        {/* TECH LEAD FILTER */}
        <div className={`flex items-center bg-[#121520] border rounded px-2.5 py-1 transition-colors ${filters.techLead && filters.techLead !== "Any" ? "border-sky-500/50" : "border-slate-800"}`}>
          <label htmlFor="techlead-filter" className="text-slate-500 mr-2 uppercase text-[10px] select-none">
            TECH LEAD:
          </label>
          <select
            id="techlead-filter"
            aria-label="Filter by Tech Lead"
            value={filters.techLead || "Any"}
            onChange={(e) => onFilterChange("techLead", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {techLeadsOptions.map((lead) => (
              <option key={lead} value={lead} className="bg-[#0a0b0d]">
                {lead}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* RESET BUTTON */}
      <button
        type="button"
        onClick={onReset}
        disabled={!isFiltered}
        className={`text-[10px] uppercase tracking-wider transition-all cursor-pointer px-2.5 py-1 rounded font-bold ${
          isFiltered
            ? "text-sky-400 hover:text-sky-300 hover:bg-sky-950/40"
            : "text-slate-600 cursor-not-allowed opacity-50"
        }`}
      >
        RESET FILTERS
      </button>
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;