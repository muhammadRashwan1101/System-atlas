// src/components/TeamManagmentDashboard/TeamGrid.jsx

import React from "react";
import TeamCard from "./TeamCard";
import { FiPlus } from "react-icons/fi";

export default function TeamGrid({
  teams = [],
  onSelectTeam,
  onAddTeam,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      
      {teams.map((team) => (
        <TeamCard
          key={team._id}
          team={team}
          onClick={() => onSelectTeam?.(team)}
        />
      ))}

      {/* Add New Team */}
      <div
        onClick={onAddTeam}
        className="
          w-full
          min-h-[280px]
          bg-[#10131A]/40
          border-2 border-dashed border-slate-800
          rounded-2xl
          p-6
          flex flex-col
          items-center
          justify-center
          text-center
          hover:border-slate-700
          hover:bg-[#10131A]/70
          transition-all duration-200
          cursor-pointer
          group
          space-y-3
        "
      >
        <div
          className="
            w-10 h-10
            rounded-full
            border border-slate-700
            flex items-center justify-center
            text-slate-400
            group-hover:text-slate-200
            group-hover:border-slate-500
            transition-colors
          "
        >
          <FiPlus size={20} />
        </div>

        <div>
          <h4 className="text-base font-semibold text-slate-200">
            Add New Team
          </h4>

          <p className="text-xs text-slate-500 mt-1 font-mono">
            Provision a new engineering unit
          </p>
        </div>
      </div>
    </div>
  );
}