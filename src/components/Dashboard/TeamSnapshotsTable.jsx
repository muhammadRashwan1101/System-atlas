import { FiUsers } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";

export default function TeamSnapshotsTable({ teams = [] }) {
  const defaultTeams = [
    {
      id: "team-1",
      name: "Cloud Platform Ops",
      managedAssets: "412 Components",
      lead: "J. Doe",
      coverage: "99.1%",
      isCompliant: true,
    },
    {
      id: "team-2",
      name: "Core API Engineers",
      managedAssets: "288 Components",
      lead: "A. Smith",
      coverage: "94.5%",
      isCompliant: true,
    },
    {
      id: "team-3",
      name: "Security & IAM",
      managedAssets: "112 Components",
      lead: "R. Vance",
      coverage: "100%",
      isCompliant: true,
    },
    {
      id: "team-4",
      name: "Frontend Experience",
      managedAssets: "567 Components",
      lead: "L. Parks",
      coverage: "62.8%",
      isCompliant: false,
    },
  ];

  const list = teams.length > 0 ? teams : defaultTeams;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#ADC6FF]/10 text-[#ADC6FF]">
            <HiUserGroup className="text-sm" />
          </span>
          <span className="font-sans text-sm font-bold text-white">
            Team Snapshots
          </span>
        </div>

        <span className="text-[10px] font-mono text-[#8b949e] uppercase tracking-wider">
          TOP BY COMPONENT COUNT
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pt-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#232730] text-[10px] font-mono uppercase text-[#8b949e]">
              <th className="pb-2.5 font-medium">TEAM NAME</th>
              <th className="pb-2.5 font-medium">MANAGED ASSETS</th>
              <th className="pb-2.5 font-medium">LEAD</th>
              <th className="pb-2.5 font-medium text-right">COVERAGE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232730]/60">
            {list.map((team) => (
              <tr
                key={team.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 font-semibold text-white">{team.name}</td>
                <td className="py-3 text-[#8b949e] font-mono text-[11px]">
                  {team.managedAssets}
                </td>
                <td className="py-3 text-[#C4C6D0]">{team.lead}</td>
                <td
                  className={`py-3 text-right font-mono font-semibold text-[11px] ${
                    team.isCompliant ? "text-[#10B981]" : "text-[#FF8A7A]"
                  }`}
                >
                  {team.coverage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
