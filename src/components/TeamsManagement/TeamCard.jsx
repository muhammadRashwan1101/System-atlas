import React, { useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiUsers,
  FiCheckCircle,
  FiChevronDown,
  FiLayers,
  FiFolder,
} from "react-icons/fi";
import Avatar from "../Utils/Avatar";

export default function TeamCard({ team, onStatusChange, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const teamId = team._id || team.id;
  const teamName = team.teamName || team.name || "Untitled Team";
  const teamCode = team.teamCode || team.code || "TEAM-01";
  const rawStatus = (team.status || "ACTIVE").toUpperCase();
  const status =
    rawStatus === "ACTIVE"
      ? "ACTIVE"
      : rawStatus === "REVIEW"
      ? "REVIEW"
      : rawStatus === "SUSPENDED"
      ? "SUSPENDED"
      : rawStatus;

  // Tech Lead resolution
  const leadObj = team.teamLead || {};
  const leadName =
    typeof team.teamLead === "string"
      ? team.teamLead
      : `${leadObj.firstName || ""} ${leadObj.lastName || ""}`.trim() ||
        leadObj.name ||
        "Unassigned";
  const leadAvatar = leadObj.avatar;

  // Metrics
  const developersCount =
    team.developersCount ??
    (Array.isArray(team.members) ? team.members.length : 0);
  const componentsCount = team.componentsCount ?? 0;
  const projectsCount = team.projectsCount ?? 0;
  const docCoverage =
    typeof team.docCoverage === "number" ? team.docCoverage : 85;

  // Last Updated format
  const updatedAt = team.updatedAt ? new Date(team.updatedAt) : new Date();
  const diffHours = Math.max(
    1,
    Math.round((new Date() - updatedAt) / (1000 * 60 * 60))
  );
  const updatedText =
    diffHours < 24 ? `${diffHours}h ago` : `${Math.round(diffHours / 24)}d ago`;

  // Status Styles
  const getStatusBadge = (st) => {
    switch (st) {
      case "ACTIVE":
        return {
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-400",
        };
      case "REVIEW":
        return {
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dot: "bg-amber-400",
        };
      case "SUSPENDED":
        return {
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dot: "bg-rose-400",
        };
      default:
        return {
          badge: "bg-slate-800 text-slate-400 border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const statusStyle = getStatusBadge(status);

  // Progress Bar Colors
  const getProgressColor = (val) => {
    if (val >= 80) return "bg-emerald-400";
    if (val >= 50) return "bg-amber-400";
    return "bg-rose-400";
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between bg-[#121418] rounded-xl p-5 transition-all duration-300 shadow-lg overflow-hidden cursor-pointer ${
        isHovered
          ? "border border-[#ADC6FF] shadow-[0_0_20px_rgba(173,198,255,0.2)]"
          : "border border-[#232730]"
      }`}
    >
      {/* Centered Hover Action Overlay (Matching ComponentCard) */}
      <div
        className="absolute inset-0 z-30 flex items-center justify-center gap-3 bg-[#0A0B0D]/70 backdrop-blur-[2px] transition-all duration-300"
        style={{
          opacity: isHovered && !isStatusMenuOpen ? 1 : 0,
          pointerEvents: isHovered && !isStatusMenuOpen ? "auto" : "none",
        }}
      >
        {/* View / Inspect Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="w-10 h-10 rounded-full bg-[#ADC6FF] hover:bg-[#ccdaff] text-[#002E6A] font-semibold flex items-center justify-center text-base shadow-lg shadow-blue-500/30 transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="View Team Details"
          aria-label="View Team Details"
        >
          <FiEye />
        </button>

        {/* Change Status Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsStatusMenuOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-[#1e232d] hover:bg-[#2b3240] text-white border border-[#384152] flex items-center justify-center text-sm shadow-md transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="Change Status"
          aria-label="Change Status"
        >
          <FiEdit2 />
        </button>
      </div>

      {/* Card Content (Dims and blurs smoothly on hover) */}
      <div
        className="flex flex-col justify-between h-full transition-all duration-300"
        style={{
          opacity: isHovered && !isStatusMenuOpen ? 0.15 : 1,
          filter: isHovered && !isStatusMenuOpen ? "blur(2px)" : "none",
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Card Header: Icon & Health Status */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center text-sky-400">
              <FiUsers className="text-base" />
            </div>

            {/* Status Badge with quick dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStatusMenuOpen(!isStatusMenuOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border cursor-pointer ${statusStyle.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                <span>{status}</span>
                <FiChevronDown className="text-[9px] opacity-70 ml-0.5" />
              </button>

              {isStatusMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-1.5 w-36 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-2xl py-1 z-40 font-mono text-[11px] flex flex-col"
                >
                  {["ACTIVE", "REVIEW", "SUSPENDED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setIsStatusMenuOpen(false);
                        if (onStatusChange) onStatusChange(teamId, st);
                      }}
                      className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer uppercase"
                    >
                      <span>{st}</span>
                      {status === st && (
                        <FiCheckCircle className="text-xs text-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Team Title & ID */}
          <div>
            <h3 className="font-semibold text-white text-base leading-tight font-(family-name:--headers)">
              {teamName}
            </h3>
            <p className="text-[11px] font-mono text-[#8b949e] mt-1">
              ID: {teamCode}
            </p>
          </div>

          {/* Metadata Rows */}
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Tech Lead</span>
              <div className="flex items-center gap-1.5 font-medium text-white truncate max-w-[150px]">
                <Avatar
                  avatarUrl={leadAvatar}
                  name={leadName}
                  size="w-4 h-4 text-[9px]"
                  className="ring-1 ring-slate-700 shrink-0"
                />
                <span className="truncate">{leadName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Developers</span>
              <span className="px-2 py-0.5 rounded bg-[#1a1e26] border border-[#2b3240] text-[11px] text-white font-mono">
                {developersCount} Developers
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Components</span>
              <span className="text-white font-medium">{componentsCount} Components</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Active Projects</span>
              <span className="text-white font-medium">{projectsCount} Projects</span>
            </div>
          </div>

          {/* Documentation Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8b949e]">Doc Coverage</span>
              <span className="text-white font-bold">{docCoverage}%</span>
            </div>
            <div className="w-full h-1 bg-[#1a1e26] rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(
                  docCoverage
                )} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(0, docCoverage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#232730]/70 text-xs text-[#8b949e]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FiFolder className="text-xs text-[#8b949e]" />
            <span>Updated {updatedText}</span>
          </div>
          <span className="text-[11px] font-mono text-sky-400/90 font-medium">
            {team.teamCode || "ACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
}
