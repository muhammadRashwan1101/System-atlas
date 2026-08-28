import React, { memo, useState } from "react";
import { FiEye, FiEdit2, FiCompass, FiFolder, FiActivity } from "react-icons/fi";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "recently";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const ProjectCard = memo(({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const status = (project?.status || "ACTIVE").toUpperCase();
  const managerName =
    project?.managerName ||
    (typeof project?.manager === "object" ? project?.manager?.name : project?.manager) ||
    "Sarah K.";
  const techLead =
    project?.techLeadName ||
    (typeof project?.techLead === "object" ? project?.techLead?.name : project?.techLead) ||
    "Alex M.";
  const environment = project?.targetEnvironment || project?.env || "Production";

  const healthMetric = project?.healthScore ?? 98;
  const nodesCount = project?.nodesCount ?? 0;
  const docProgress = project?.documentationProgress ?? 85;

  const getStatusBadge = (st) => {
    switch (st) {
      case "CRITICAL":
      case "WARNING":
        return {
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dot: "bg-rose-400",
        };
      case "SUSPENDED":
        return {
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dot: "bg-amber-400",
        };
      case "ACTIVE":
      case "HEALTHY":
      default:
        return {
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-400",
        };
    }
  };

  const statusStyle = getStatusBadge(status);

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
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
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
          title="Inspect Project"
          aria-label="Inspect Project"
        >
          <FiEye />
        </button>

        {/* Explore Graph Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="w-10 h-10 rounded-full bg-[#1e232d] hover:bg-[#2b3240] text-white border border-[#384152] flex items-center justify-center text-base shadow-md transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="Architecture Graph"
          aria-label="Architecture Graph"
        >
          <FiCompass />
        </button>
      </div>

      {/* Card Content (Dims and blurs smoothly on hover) */}
      <div
        className="flex flex-col justify-between h-full transition-all duration-300"
        style={{
          opacity: isHovered ? 0.15 : 1,
          filter: isHovered ? "blur(2px)" : "none",
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Card Header: Icon & Health Status */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center text-sky-400">
              <FiFolder className="text-base" />
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${statusStyle.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {status}
            </span>
          </div>

          {/* Project Title & ID */}
          <div>
            <h3 className="font-semibold text-white text-base leading-tight font-(family-name:--headers)">
              {project?.name || "Untitled Project"}
            </h3>
            <p className="text-[11px] font-mono text-[#8b949e] mt-1">
              ID: {project?.code || "PROD-01"}
            </p>
          </div>

          {/* Metadata Rows */}
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Environment</span>
              <span className="px-2 py-0.5 rounded bg-[#1a1e26] border border-[#2b3240] text-[11px] text-white font-mono capitalize">
                {environment}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Manager</span>
              <span className="text-white font-medium truncate max-w-[150px]">
                {managerName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Tech Lead</span>
              <span className="text-white font-medium truncate max-w-[150px]">
                {techLead}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Nodes Count</span>
              <span className="text-white font-medium font-mono">{nodesCount} Nodes</span>
            </div>
          </div>

          {/* Health Score Metric */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8b949e]">Health Metric</span>
              <span
                className={`font-bold ${
                  healthMetric > 90
                    ? "text-emerald-400"
                    : healthMetric > 75
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {typeof healthMetric === "number" ? healthMetric.toFixed(1) : healthMetric}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#1a1e26] rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  healthMetric > 90
                    ? "bg-emerald-400"
                    : healthMetric > 75
                    ? "bg-amber-400"
                    : "bg-rose-400"
                } transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(0, healthMetric))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#232730]/70 text-xs text-[#8b949e]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FiActivity className="text-xs text-[#8b949e]" />
            <span>Updated {formatTimeAgo(project?.updatedAt || project?.createdAt)}</span>
          </div>
          <span className="text-[11px] font-mono text-sky-400/90 font-medium">
            {project?.code || "ACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;