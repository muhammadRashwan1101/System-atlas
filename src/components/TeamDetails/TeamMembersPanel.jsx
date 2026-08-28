import React from "react";
import { FiEdit2, FiUserPlus, FiUser } from "react-icons/fi";
import Avatar from "../Utils/Avatar";

export default function TeamMembersPanel({
  members = [],
  onAddMemberClick,
  onManageRoles,
}) {
  const activeCount = members.filter((m) => (m.status || "").toUpperCase() === "ACTIVE").length || members.length || 10;
  const dayOffCount = members.filter((m) => (m.status || "").toUpperCase() === "DAY-OFF").length || 2;

  const defaultMembers = [
    {
      _id: "m1",
      name: "Alex Rivera",
      codeId: "USR-22910",
      role: "Architect",
      rank: "L7",
      projectsCount: 3,
      status: "ACTIVE",
    },
    {
      _id: "m2",
      name: "Jamie Volts",
      codeId: "USR-38112",
      role: "Tech Lead",
      rank: "L6",
      projectsCount: 3,
      status: "DAY-OFF",
    },
    {
      _id: "m3",
      name: "Samir Gupta",
      codeId: "USR-10023",
      role: "Senior Engineer",
      rank: "L5",
      projectsCount: 3,
      status: "ACTIVE",
    },
    {
      _id: "m4",
      name: "Chloe Marks",
      codeId: "USR-44201",
      role: "Senior Engineer",
      rank: "L5",
      projectsCount: 3,
      status: "ACTIVE",
    },
  ];

  const list = members && members.length > 0 ? members : defaultMembers;

  return (
    <div className="bg-[#0b0d13] border-l border-slate-800/80 h-full flex flex-col justify-between p-6 font-mono text-xs w-full lg:w-[480px] shrink-0">
      <div className="space-y-5">
        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white font-(family-name:--headers)">
              Members
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active: {activeCount}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              DAY-OFF: {dayOffCount}
            </span>
          </div>

          <button
            type="button"
            onClick={onManageRoles}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <FiEdit2 className="text-[10px]" />
            <span>MANAGE ROLES</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => alert("Assign Project")}
            className="py-1.5 px-2 bg-[#12151e] hover:bg-slate-800 border border-slate-800 rounded-lg text-center uppercase tracking-wider transition-colors cursor-pointer"
          >
            ASSIGN PROJECT
          </button>
          <button
            type="button"
            onClick={() => alert("Transfer Member")}
            className="py-1.5 px-2 bg-[#12151e] hover:bg-slate-800 border border-slate-800 rounded-lg text-center uppercase tracking-wider transition-colors cursor-pointer"
          >
            TRANSFER
          </button>
          <button
            type="button"
            onClick={() => alert("Promote Member")}
            className="py-1.5 px-2 bg-[#12151e] hover:bg-slate-800 border border-slate-800 rounded-lg text-center uppercase tracking-wider transition-colors cursor-pointer"
          >
            PROMOTE
          </button>
          <button
            type="button"
            onClick={() => alert("Export Member Roster")}
            className="py-1.5 px-2 bg-[#12151e] hover:bg-slate-800 border border-slate-800 rounded-lg text-center uppercase tracking-wider transition-colors cursor-pointer"
          >
            EXPORT
          </button>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">
                <th className="py-2.5 font-medium">NAME / ID</th>
                <th className="py-2.5 font-medium">ROLE</th>
                <th className="py-2.5 font-medium">RANK</th>
                <th className="py-2.5 font-medium text-center">PROJECTS</th>
                <th className="py-2.5 font-medium text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {list.map((m, idx) => {
                const isDayOff = (m.status || "").toUpperCase() === "DAY-OFF";
                const codeId = m.codeId || `USR-${(m._id || `${idx}`).slice(-5).toUpperCase()}`;

                return (
                  <tr key={m._id || idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          avatarUrl={m.avatar}
                          name={m.name}
                          size="w-7 h-7 text-[10px]"
                          className="bg-slate-800 text-slate-300 rounded-md border border-slate-700/60"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-white block truncate max-w-[110px]">
                            {m.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {codeId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 text-[11px] truncate max-w-[90px]">
                      {m.role || "Engineer"}
                    </td>
                    <td className="py-3 font-bold text-slate-200 text-[11px]">
                      {m.rank || "L5"}
                    </td>
                    <td className="py-3 text-center text-slate-300 text-[11px]">
                      {m.projectsCount ?? 3}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          isDayOff ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDayOff ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                        />
                        {isDayOff ? "DAY-OFF" : "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Full-Width CTA: + ADD A MEMBER */}
      <div className="pt-6 border-t border-slate-800/80 mt-6">
        <button
          type="button"
          onClick={onAddMemberClick}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#34d399] hover:bg-[#10b981] text-slate-950 font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
        >
          <FiUserPlus className="text-base" />
          <span>ADD A MEMBER</span>
        </button>
      </div>
    </div>
  );
}
