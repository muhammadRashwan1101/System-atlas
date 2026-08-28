import React from "react";
import { FiPlus } from "react-icons/fi";

export default function AddTeamCard({ onAddTeam }) {
  return (
    <div
      onClick={onAddTeam}
      className="flex flex-col items-center justify-center p-8 bg-[#0d0f14]/50 border-2 border-dashed border-[#232730] hover:border-[#ADC6FF]/60 rounded-xl transition-all duration-200 cursor-pointer min-h-[300px] gap-3 text-center group hover:shadow-[0_0_20px_rgba(173,198,255,0.15)]"
    >
      <div className="w-12 h-12 rounded-full bg-[#1a1e26] border border-[#232730] group-hover:border-[#ADC6FF]/50 group-hover:bg-[#ADC6FF]/10 flex items-center justify-center text-[#8b949e] group-hover:text-[#ADC6FF] transition-all">
        <FiPlus className="text-2xl" />
      </div>
      <div>
        <h3 className="font-semibold text-white text-base group-hover:text-[#ADC6FF] transition-colors">
          Add New Team
        </h3>
        <p className="text-xs text-[#8b949e] mt-0.5">Provision engineering unit</p>
      </div>
    </div>
  );
}
