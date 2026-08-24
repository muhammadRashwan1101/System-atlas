import React, { memo } from "react";


const formatTimeAgo = (dateString) => {
  if (!dateString) return "Updated recently";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return "Updated just now";
  if (diffInMinutes < 60) return `Updated ${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Updated ${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `Updated ${diffInDays}d ago`;
};


const getStatusStyles = (status) => {
  const s = status?.toUpperCase() || "ACTIVE";
  switch (s) {
    case "CRITICAL":
      return {
        badge: "bg-[#2d1217] text-[#f87171] border-[#7f1d1d]/60",
        code: "text-[#f87171]",
        metric: "text-[#f87171]",
        ownershipBar: "bg-[#f87171]",
      };
    case "SUSPENDED":
      return {
        badge: "bg-[#1e2330] text-[#94a3b8] border-[#334155]/60",
        code: "text-[#94a3b8]",
        metric: "text-[#94a3b8]",
        ownershipBar: "bg-[#64748b]",
      };
    case "DEVELOPMENT":
    case "STAGING":
      return {
        badge: "bg-[#13233b] text-[#60a5fa] border-[#1e40af]/60",
        code: "text-[#60a5fa]",
        metric: "text-[#60a5fa]",
        ownershipBar: "bg-[#60a5fa]",
      };
    case "ACTIVE":
    default:
      return {
        badge: "bg-[#0d2822] text-[#34d399] border-[#065f46]/60",
        code: "text-[#34d399]",
        metric: "text-[#34d399]",
        ownershipBar: "bg-[#34d399]",
      };
  }
};

const ProjectCard = memo(({ project }) => {
  const styles = getStatusStyles(project.status);

  // جلب البيانات من الباك إند
  const managerName = project.managerName || project.manager || "N/A";
  const techLead = project.techLead || "N/A";
  const environment = project.targetEnvironment || project.env || "Development";

  return (
    <div className="p-5 bg-[#12151e]/90 border border-slate-800/80 rounded-xl font-mono text-xs transition-all duration-200 hover:border-slate-700/80 shadow-md flex flex-col justify-between select-none">
      <div>
        {/* Header: Project Code & Status */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold tracking-wider uppercase ${styles.code}`}>
            {project.code || "PROD-00"}
          </span>
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${styles.badge}`}>
            {project.status || "ACTIVE"}
          </span>
        </div>

        {/* Project Name */}
        <h3 className="text-base font-bold text-slate-100 mb-4 tracking-tight">
          {project.name}
        </h3>

        {/* Zeroed Health Metric (بدون رسمة) */}
        <div className="mb-5">
          <div className={`text-2xl font-bold tracking-tight ${styles.metric}`}>
            0.0%
          </div>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
            HEALTH METRIC
          </span>
        </div>

        {/* Environment & Scale Info */}
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-800/50 mb-4">
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
              ENVIRONMENT
            </span>
            <span className="text-slate-200 text-xs font-semibold capitalize">
              {environment}
            </span>
          </div>

          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
              SCALE
            </span>
            <span className="text-slate-400 text-xs font-medium">
              0 Nodes <span className="text-slate-600 mx-1">|</span> 0 L
            </span>
          </div>
        </div>

        {/* Progress Bars (متصفرة 0%) */}
        <div className="space-y-3 pt-1">
          {/* Documentation Progress */}
          <div>
            <div className="flex justify-between text-[9px] text-slate-500 mb-1">
              <span className="uppercase tracking-wider">DOCUMENTATION</span>
              <span>0%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-200/80 rounded-full" style={{ width: "0%" }} />
            </div>
          </div>

          {/* Ownership Progress */}
          <div>
            <div className="flex justify-between text-[9px] text-slate-500 mb-1">
              <span className="uppercase tracking-wider">OWNERSHIP</span>
              <span>0%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${styles.ownershipBar} rounded-full`} style={{ width: "0%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Dynamic Update Time & Real Backend Team Info */}
      <div className="pt-4 mt-5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span className="text-slate-400 font-normal">
          {formatTimeAgo(project.updatedAt || project.createdAt)}
        </span>
        <span className="text-slate-300 font-medium tracking-wide">
          {managerName} <span className="text-slate-600 mx-1">/</span> {techLead}
        </span>
      </div>
    </div>
  );
});

export default ProjectCard;