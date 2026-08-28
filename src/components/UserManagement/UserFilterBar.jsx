import React, { useState } from "react";
import { FiChevronDown, FiUpload, FiSend, FiCheck } from "react-icons/fi";

export default function UserFilterBar({
  statusFilter = "All",
  onStatusChange,
  roleFilter = "Any",
  onRoleChange,
  teamFilter = "All",
  onTeamChange,
  roles = ["Any", "SRE Lead", "DevOps Eng", "System Architect", "Security Eng", "Developer", "Admin", "Manager"],
  teams = ["All", "Infrastructure", "Core Services", "Platform", "Security Operations"],
  onImportCSV,
  onBulkInvite,
}) {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const statusTabs = ["All", "Active", "Pending", "Suspended"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-2.5 rounded-xl bg-[#121418] border border-[#232730] text-xs font-mono">
      {/* Left: Status Segmented Controls & Dropdown Selectors */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Segmented Buttons */}
        <div className="flex items-center bg-[#1a1e26] border border-[#2b3240] rounded-lg p-0.5">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onStatusChange(tab)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                statusFilter.toLowerCase() === tab.toLowerCase()
                  ? "bg-[#2b3240] text-white shadow-sm font-semibold"
                  : "text-[#8b949e] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Role Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Role:</span>
            <span className="font-medium text-white">{roleFilter}</span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {isRoleOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onRoleChange(r);
                    setIsRoleOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{r}</span>
                  {roleFilter === r && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTeamOpen(!isTeamOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Team:</span>
            <span className="font-medium text-white truncate max-w-[110px]">
              {teamFilter}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {isTeamOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-56 overflow-y-auto flex flex-col">
              {teams.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onTeamChange(t);
                    setIsTeamOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer truncate"
                >
                  <span className="truncate">{t}</span>
                  {teamFilter === t && <FiCheck className="text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Import CSV & Bulk Invite */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onImportCSV}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1a1e26] hover:bg-[#232730] text-slate-300 hover:text-white border border-[#2b3240] rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <FiUpload className="text-xs text-[#8b949e]" />
          <span>Import CSV</span>
        </button>

        <button
          type="button"
          onClick={onBulkInvite}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1a1e26] hover:bg-[#232730] text-slate-300 hover:text-white border border-[#2b3240] rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <FiSend className="text-xs text-[#8b949e]" />
          <span>Bulk Invite</span>
        </button>
      </div>
    </div>
  );
}
