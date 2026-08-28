import React from "react";

export default function TeamHeader({ team }) {
  const entityId = team?.teamCode || team?.code || "TEAM-PLT-422";
  const name = team?.teamName || team?.name || "Platform Engineering";
  const description =
    team?.description ||
    "Core infrastructure and foundational services responsible for CI/CD pipelines, cluster management, and cross-cutting security layers.";

  return (
    <div className="space-y-3">
      {/* Entity ID Badge */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
          ENTITY ID:
        </span>
        <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
          {entityId}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-extrabold text-white tracking-tight font-(family-name:--headers)">
        {name}
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl font-(family-name:--body-font)">
        {description}
      </p>
    </div>
  );
}
