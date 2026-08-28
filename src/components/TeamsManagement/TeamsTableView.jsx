import React from "react";
import Avatar from "../Utils/Avatar";

export default function TeamsTableView({
  teams = [],
  onSelectTeam,
}) {
  const statusStyles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    SUSPENDED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    INACTIVE: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <div className="w-full bg-[#0e1017] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-[#12151e]/60 text-[10px] text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Team Code</th>
              <th className="py-3.5 px-6">Team Name</th>
              <th className="py-3.5 px-6">Tech Lead</th>
              <th className="py-3.5 px-6 text-center">Developers</th>
              <th className="py-3.5 px-6 text-center">Components</th>
              <th className="py-3.5 px-6 text-center">Projects</th>
              <th className="py-3.5 px-6">Doc Coverage</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-200">
            {teams.map((team) => {
              const teamId = team._id || team.id;
              const leadObj = team.teamLead || {};
              const leadName =
                typeof team.teamLead === "string"
                  ? team.teamLead
                  : `${leadObj.firstName || ""} ${leadObj.lastName || ""}`.trim() || leadObj.name || "Unassigned";

              const status = (team.status || "ACTIVE").toUpperCase();
              const docCoverage = typeof team.docCoverage === "number" ? team.docCoverage : 85;

              return (
                <tr
                  key={teamId}
                  onClick={() => onSelectTeam && onSelectTeam(team)}
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-slate-300">
                    {team.teamCode || "TEAM"}
                  </td>
                  <td className="py-4 px-6 font-bold text-white font-(family-name:--headers) text-sm">
                    {team.teamName || team.name}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Avatar
                        avatarUrl={leadObj.avatar}
                        name={leadName}
                        size="w-5 h-5 text-[10px]"
                        className="bg-indigo-500/20 text-indigo-300"
                      />
                      <span className="font-(family-name:--body-font) text-slate-200 font-medium">
                        {leadName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-slate-300">
                    {team.developersCount ?? (team.members?.length || 0)}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-300">
                    {team.componentsCount ?? 0}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-300">
                    {team.projectsCount ?? 0}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[11px] text-slate-200">{docCoverage}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${docCoverage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        statusStyles[status] || statusStyles.ACTIVE
                      }`}
                    >
                      {status}
                    </span>
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
