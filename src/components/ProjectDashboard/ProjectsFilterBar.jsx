import React, { useState } from "react";
import {
  FiChevronDown,
  FiRotateCcw,
  FiGrid,
  FiList,
  FiCheck,
} from "react-icons/fi";

export default function ProjectsFilterBar({
  filters,
  onFilterChange,
  onReset,
  viewMode = "grid",
  onViewModeChange,
  managersOptions = ["Any", "Hager Mohamed", "Sarah K."],
  techLeadsOptions = ["Any", "Alex M.", "Maria G."],
  statusOptions = ["All", "ACTIVE", "CRITICAL", "SUSPENDED", "DEVELOPMENT"],
  envOptions = [
    { label: "All Environments", value: "All" },
    { label: "Production Ready", value: "production ready" },
    { label: "Development", value: "development" },
    { label: "Prototype", value: "prototype" },
    { label: "Staging", value: "staging" },
  ],
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121418] border border-[#232730] text-xs font-mono">
      {/* Left Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("status")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Status:</span>
            <span className="font-medium text-white">{filters.status || "All"}</span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "status" && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onFilterChange("status", st);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{st}</span>
                  {filters.status === st && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Env Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("env")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Env:</span>
            <span className="font-medium text-white capitalize">
              {filters.targetEnvironment === "All"
                ? "All"
                : filters.targetEnvironment || "All"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "env" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {envOptions.map((env) => (
                <button
                  key={env.value}
                  type="button"
                  onClick={() => {
                    onFilterChange("targetEnvironment", env.value);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{env.label}</span>
                  {filters.targetEnvironment === env.value && (
                    <FiCheck className="text-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manager Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("manager")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Manager:</span>
            <span className="font-medium text-white truncate max-w-[110px]">
              {filters.manager || "Any"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "manager" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-56 overflow-y-auto flex flex-col">
              {managersOptions.map((mgr) => (
                <button
                  key={mgr}
                  type="button"
                  onClick={() => {
                    onFilterChange("manager", mgr);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer truncate"
                >
                  <span className="truncate">{mgr}</span>
                  {filters.manager === mgr && <FiCheck className="text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tech Lead Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("techLead")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Lead:</span>
            <span className="font-medium text-white truncate max-w-[110px]">
              {filters.techLead || "Any"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "techLead" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-56 overflow-y-auto flex flex-col">
              {techLeadsOptions.map((lead) => (
                <button
                  key={lead}
                  type="button"
                  onClick={() => {
                    onFilterChange("techLead", lead);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer truncate"
                >
                  <span className="truncate">{lead}</span>
                  {filters.techLead === lead && <FiCheck className="text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8b949e] hover:text-white transition-colors cursor-pointer ml-1"
        >
          <FiRotateCcw className="text-xs" /> Reset
        </button>
      </div>

      {/* Right Controls: View Switch */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#1a1e26] border border-[#2b3240] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            aria-label="Grid view"
          >
            <FiGrid />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            aria-label="List view"
          >
            <FiList />
          </button>
        </div>
      </div>
    </div>
  );
}
