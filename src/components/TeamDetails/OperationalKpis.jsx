import React from "react";

export default function OperationalKpis({ kpis = {} }) {
  const componentsOwned = kpis.componentsOwned ?? 42;
  const projectsOwned = kpis.projectsOwned ?? 12;
  const criticalPathServices = kpis.criticalPathServices ?? 12;
  const slaAdherence = kpis.slaAdherence ?? "99.98%";

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
        OPERATIONAL KPIS
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. COMPONENTS OWNED */}
        <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
            COMPONENTS OWNED
          </span>
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {componentsOwned}
          </span>
        </div>

        {/* 2. PROJECTS OWNED */}
        <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
            PROJECTS OWNED
          </span>
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {projectsOwned}
          </span>
        </div>

        {/* 3. CRITICAL PATH SERVICES */}
        <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
            CRITICAL PATH SERVICES
          </span>
          <span className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {criticalPathServices}
          </span>
        </div>

        {/* 4. SLA ADHERENCE */}
        <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
          <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
            SLA ADHERENCE
          </span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {slaAdherence}
          </span>
        </div>
      </div>
    </div>
  );
}
