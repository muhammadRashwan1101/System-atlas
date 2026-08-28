import React from "react";
import { FiChevronRight, FiFolder, FiActivity } from "react-icons/fi";

export default function ProjectsTableView({ projects = [], onSelectProject }) {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "HEALTHY":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case "CRITICAL":
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Critical
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
            {status || "Active"}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#121418] border border-[#232730] rounded-xl overflow-hidden shadow-xl text-xs font-mono">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1a1e26] border-b border-[#2b3240] text-[10px] text-[#8b949e] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">PROJECT NAME / ID</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold">ENVIRONMENT</th>
              <th className="py-3 px-4 font-semibold">MANAGER</th>
              <th className="py-3 px-4 font-semibold">TECH LEAD</th>
              <th className="py-3 px-4 font-semibold text-center">HEALTH</th>
              <th className="py-3 px-4 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232730] text-slate-300">
            {projects.map((proj, idx) => {
              const codeId = proj.code || `PRJ-${String(idx + 1).padStart(2, "0")}`;
              const health = proj.healthScore ?? 98;

              return (
                <tr
                  key={proj._id || proj.id || idx}
                  onClick={() => onSelectProject && onSelectProject(proj)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {/* Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-sky-400 shrink-0">
                        <FiFolder className="text-base" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm font-(family-name:--headers)">
                          {proj.name}
                        </span>
                        <span className="text-[11px] text-[#8b949e] block font-mono mt-0.5">
                          ID: {codeId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(proj.status)}</td>

                  {/* Environment */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a1e26] text-slate-300 border border-[#2b3240] capitalize">
                      {proj.targetEnvironment || "Production"}
                    </span>
                  </td>

                  {/* Manager */}
                  <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                    {proj.managerName || "Sarah K."}
                  </td>

                  {/* Tech Lead */}
                  <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                    {proj.techLead || "Alex M."}
                  </td>

                  {/* Health */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold ${
                        health > 90
                          ? "text-emerald-400"
                          : health > 75
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {health}%
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="p-1.5 text-[#8b949e] hover:text-white transition-colors"
                      title="Inspect Project"
                    >
                      <FiChevronRight className="text-base" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
