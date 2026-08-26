import React from "react";

export default function ProjectStats({ stats, components, relationships }) {

  const componentsCount =
    typeof stats?.components === "number"
      ? stats.components
      : Array.isArray(components)
      ? components.length
      : 0;

  const relationshipsCount =
    typeof stats?.relationships === "number"
      ? stats.relationships
      : Array.isArray(relationships)
      ? relationships.length
      : 0;

  const teamsCount = typeof stats?.teams === "number" ? stats.teams : 0;


  const docsCoverage =
    stats?.docsCoverage ?? stats?.docsCov ?? "N/A";

  const govScore =
    stats?.govScore !== undefined && stats?.govScore !== null
      ? stats.govScore
      : "N/A";

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
      {/* 1. COMPONENTS */}
      <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
        <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          COMPONENTS
        </span>
        <span className="text-3xl font-bold text-white tracking-tight">
          {componentsCount}
        </span>
      </div>

      {/* 2. RELATIONSHIPS */}
      <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
        <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          RELATIONSHIPS
        </span>
        <span className="text-3xl font-bold text-white tracking-tight">
          {relationshipsCount}
        </span>
      </div>

      {/* 3. TEAMS */}
      <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
        <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          TEAMS
        </span>
        <span className="text-3xl font-bold text-white tracking-tight">
          {teamsCount}
        </span>
      </div>

      {/* 4. DOCS COVERAGE */}
      <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg">
        <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          DOCS COV.
        </span>
        <span className="text-3xl font-bold text-emerald-400 tracking-tight">
          {docsCoverage}
        </span>
      </div>

      {/* 5. GOVERNANCE SCORE */}
      <div className="bg-[#0e1017] border-l-4 border-l-emerald-500 border-y border-r border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-28 shadow-lg col-span-2 sm:col-span-1">
        <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          GOV SCORE
        </span>
        <span className="text-3xl font-bold text-emerald-400 tracking-tight">
          {govScore}
        </span>
      </div>
    </div>
  );
}