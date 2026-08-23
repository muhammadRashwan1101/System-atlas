import { FiArrowRight } from "react-icons/fi";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "review": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
};

const getProgressColor = (value) => (value >= 80 ? "bg-emerald-400" : value >= 50 ? "bg-emerald-500" : "bg-rose-500");

export default function TeamCard({ team, onClick }) {
  if (!team) return null;

  const developersCount = team.members?.length || team.developersCount || 0;
  const leadName = team.teamLead?.displayName || team.teamLead?.fullName || team.teamLead?.email || team.leadName || "No Tech Lead";
  const leadAvatar = team.teamLead?.avatarUrl || team.leadAvatar;
  const coverage = team.coverage ?? team.documentationCoverage ?? 0;
  const componentsCount = team.componentsCount ?? team.components ?? 0;
  const projectsCount = team.projectsCount ?? team.projects ?? 0;

  return (
    <div onClick={onClick} className="group w-full min-h-[300px] bg-[#10131A] border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 cursor-pointer hover:border-slate-700 hover:bg-[#131720] transition-all">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-mono font-semibold text-slate-400">{team.teamCode || team.code || "N/A"}</span>
          <span className={`px-2.5 py-1 text-xs font-mono font-semibold uppercase rounded border ${getStatusBadge(team.status)}`}>
            {team.status || "ACTIVE"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 tracking-tight truncate">{team.teamName || team.name || "Unnamed Team"}</h3>
      </div>

      {/* Tech Lead & Developers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">TECH LEAD</span>
          <div className="flex items-center gap-2 min-w-0">
            {leadAvatar ? (
              <img src={leadAvatar} alt={leadName} className="w-6 h-6 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300 shrink-0">
                {leadName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-slate-200 truncate text-sm font-medium">{leadName}</span>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">DEVELOPERS</span>
          <span className="text-slate-200 text-sm font-medium">{developersCount} Developers</span>
        </div>
      </div>

      {/* Components & Projects */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">COMPONENTS</span>
          <span className="text-slate-200 text-sm font-medium">{componentsCount} Components</span>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">PROJECTS</span>
          <span className="text-slate-200 text-sm font-medium">{projectsCount} Projects</span>
        </div>
      </div>

      {/* Documentation Coverage */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Documentation Coverage</span>
          <span className={`font-bold text-sm ${coverage < 50 ? "text-rose-400" : "text-emerald-400"}`}>{coverage}%</span>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(coverage)}`}
            style={{ width: `${Math.min(Math.max(coverage, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800/60">
        <span className="text-xs font-mono text-slate-500">
          Last Updated: <span className="text-slate-400">{formatRelativeTime(team.updatedAt)}</span>
        </span>
        <FiArrowRight size={17} className="text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}