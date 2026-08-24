import React, { memo } from "react";
import { RxCross2 } from "react-icons/rx";

const SearchBar = memo(({ filters, onFilterChange, onReset, workspaces = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0b0d] p-2 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 w-full">
      <div className="flex flex-wrap items-center gap-2">
        
        {/* WORKSPACE FILTER */}
        <div className="flex items-center bg-[#121520] border border-slate-800 rounded px-2.5 py-1">
          <span className="text-slate-500 mr-2 uppercase text-[10px]">WORKSPACE:</span>
          <select
            value={filters.workspaceId || "All"}
            onChange={(e) => onFilterChange("workspaceId", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 font-medium"
          >
            <option value="All" className="bg-[#0a0b0d]">All Workspaces</option>
            {workspaces.map((ws) => (
              <option key={ws._id} value={ws._id} className="bg-[#0a0b0d]">
                {ws.name}
              </option>
            ))}
          </select>

          {filters.workspaceId && filters.workspaceId !== "All" && (
            <button
              onClick={() => onFilterChange("workspaceId", "All")}
              className="ml-1.5 text-slate-500 hover:text-red-400 transition-colors"
              title="Clear Workspace Filter"
            >
              <RxCross2 className="text-xs" />
            </button>
          )}
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center bg-[#121520] border border-slate-800 rounded px-2.5 py-1">
          <span className="text-slate-500 mr-2 uppercase text-[10px]">STATUS:</span>
          <select
            value={filters.status || "All"}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            <option value="All" className="bg-[#0a0b0d]">All</option>
            <option value="ACTIVE" className="bg-[#0a0b0d]">ACTIVE</option>
            <option value="CRITICAL" className="bg-[#0a0b0d]">CRITICAL</option>
            <option value="SUSPENDED" className="bg-[#0a0b0d]">SUSPENDED</option>
            <option value="DEVELOPMENT" className="bg-[#0a0b0d]">DEVELOPMENT</option>
          </select>
        </div>

        {/* ENV FILTER */}
    {/* ENV FILTER */}
<div className="flex items-center bg-[#121520] border border-slate-800 rounded px-2.5 py-1">
  <span className="text-slate-500 mr-2 uppercase text-[10px]">ENV:</span>
  <select
    value={filters.targetEnvironment || "All"}
    onChange={(e) => onFilterChange("targetEnvironment", e.target.value)}
    className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
  >
    <option value="All" className="bg-[#0a0b0d]">All Environments</option>
    <option value="production ready" className="bg-[#0a0b0d]">Production Ready</option>
    <option value="development" className="bg-[#0a0b0d]">Development</option>
    <option value="prototype" className="bg-[#0a0b0d]">Prototype</option>
    <option value="staging" className="bg-[#0a0b0d]">Staging</option>
  </select>
</div>
        {/* MANAGER FILTER */}
        <div className="flex items-center bg-[#121520] border border-slate-800 rounded px-2.5 py-1">
          <span className="text-slate-500 mr-2 uppercase text-[10px]">MANAGER:</span>
          <select
            value={filters.manager || "Any"}
            onChange={(e) => onFilterChange("manager", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            <option value="Any" className="bg-[#0a0b0d]">Any</option>
            <option value="Hager Mohamed" className="bg-[#0a0b0d]">Hager Mohamed</option>
            <option value="Sarah K." className="bg-[#0a0b0d]">Sarah K.</option>
          </select>
        </div>

        {/* TECH LEAD FILTER */}
        <div className="flex items-center bg-[#121520] border border-slate-800 rounded px-2.5 py-1">
          <span className="text-slate-500 mr-2 uppercase text-[10px]">TECH LEAD:</span>
          <select
            value={filters.techLead || "Any"}
            onChange={(e) => onFilterChange("techLead", e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            <option value="Any" className="bg-[#0a0b0d]">Any</option>
            <option value="Alex M." className="bg-[#0a0b0d]">Alex M.</option>
            <option value="Maria G." className="bg-[#0a0b0d]">Maria G.</option>
          </select>
        </div>

      </div>

      <button
        onClick={onReset}
        className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer px-2 py-1 font-bold"
      >
        RESET FILTERS
      </button>
    </div>
  );
});

export default SearchBar;