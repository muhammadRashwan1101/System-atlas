import React from "react";
import { FiPlus } from "react-icons/fi";

const AddProjectCard = ({ onAddProject }) => {
  return (
    <button
      onClick={onAddProject}
      className="p-5 bg-[#12151e]/40 hover:bg-[#12151e]/80 border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-xl font-mono text-xs transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] text-slate-500 hover:text-slate-300 cursor-pointer group w-full select-none"
    >
      <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-slate-500 transition-all">
        <FiPlus className="text-xl text-slate-400 group-hover:text-white" />
      </div>

      <span className="text-sm font-bold tracking-tight text-slate-300 mb-1">
        Add Project
      </span>

      <p className="text-[10px] text-slate-500 text-center max-w-[160px] leading-relaxed">
        Initialize a new infrastructure node or workspace.
      </p>
    </button>
  );
};

export default AddProjectCard;