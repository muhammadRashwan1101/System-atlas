import React, { useState } from "react";
import {
  FiChevronDown,
  FiRotateCcw,
  FiGrid,
  FiList,
  FiCheck,
} from "react-icons/fi";

export default function TeamsFilterBar({
  filters,
  workspaces = [],
  leads = [],
  viewMode = "grid",
  onFilterChange,
  onReset,
  onViewModeChange,
  sortBy = "recent",
  setSortBy,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const statusOptions = ["All Statuses", "Active", "Review", "Suspended"];
  const sizeOptions = [
    { label: "Any Size", value: "Any Size" },
    { label: "Small (<5)", value: "Small" },
    { label: "Medium (5-15)", value: "Medium" },
    { label: "Large (>15)", value: "Large" },
  ];

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121418] border border-[#232730] text-xs">
      {/* Left Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("workspace")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Workspace:</span>
            <span className="font-medium">
              {filters.workspaceName || "All"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "workspace" && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-60 overflow-y-auto flex flex-col">
              <button
                type="button"
                onClick={() => {
                  onFilterChange("workspaceId", "");
                  onFilterChange("workspaceName", "All");
                  setOpenDropdown(null);
                }}
                className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>All Workspaces</span>
                {!filters.workspaceId && <FiCheck className="text-sky-400" />}
              </button>
              {workspaces.map((ws) => (
                <button
                  key={ws._id || ws.id}
                  type="button"
                  onClick={() => {
                    onFilterChange("workspaceId", ws._id || ws.id);
                    onFilterChange("workspaceName", ws.name);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer truncate"
                >
                  <span className="truncate">{ws.name}</span>
                  {filters.workspaceId === (ws._id || ws.id) && (
                    <FiCheck className="text-sky-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("status")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Status:</span>
            <span className="font-medium">
              {filters.status || "All"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "status" && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onFilterChange("status", st === "All Statuses" ? "" : st);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{st}</span>
                  {(filters.status === st || (!filters.status && st === "All Statuses")) && (
                    <FiCheck className="text-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lead Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("lead")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Lead:</span>
            <span className="font-medium truncate max-w-[110px]">
              {filters.leadName || "Any"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "lead" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-60 overflow-y-auto flex flex-col">
              <button
                type="button"
                onClick={() => {
                  onFilterChange("lead", "");
                  onFilterChange("leadName", "Any");
                  setOpenDropdown(null);
                }}
                className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>Any Lead</span>
                {!filters.lead && <FiCheck className="text-sky-400" />}
              </button>
              {leads.map((lead) => {
                const leadId = lead._id || lead.id;
                const leadName =
                  `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
                  lead.name ||
                  lead.email;
                return (
                  <button
                    key={leadId}
                    type="button"
                    onClick={() => {
                      onFilterChange("lead", leadId);
                      onFilterChange("leadName", leadName);
                      setOpenDropdown(null);
                    }}
                    className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer truncate"
                  >
                    <span className="truncate">{leadName}</span>
                    {filters.lead === leadId && <FiCheck className="text-sky-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("size")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Size:</span>
            <span className="font-medium">
              {filters.sizeLabel || "Any"}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {openDropdown === "size" && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange("size", opt.value === "Any Size" ? "" : opt.value);
                    onFilterChange("sizeLabel", opt.label);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {(filters.size === opt.value || (!filters.size && opt.value === "Any Size")) && (
                    <FiCheck className="text-sky-400" />
                  )}
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

      {/* Right Controls: View Mode & Sort */}
      <div className="flex items-center gap-4">
        {/* View Switch */}
        <div className="flex items-center bg-[#1a1e26] border border-[#2b3240] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            title="Grid View"
            aria-label="Grid view"
          >
            <FiGrid />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            title="Table View"
            aria-label="Table view"
          >
            <FiList />
          </button>
        </div>
      </div>
    </div>
  );
}
