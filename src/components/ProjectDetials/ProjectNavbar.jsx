import React from "react";
import { Link, useParams } from "react-router-dom";
import { FiFolder, FiSearch, FiBell, FiClock } from "react-icons/fi";

export default function ProjectNavbar({ projectName, loading, onSearchChange, searchValue }) {
  const { workspaceId } = useParams();

  return (
    <header className="w-full bg-[#0a0b0d]/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-3 flex items-center justify-between text-slate-300 font-(family-name:--labels) text-xs select-none">
      <div className="flex items-center gap-2.5">
        <Link 
          to="/app" 
          className="text-sm font-bold text-slate-100 font-(family-name:--headers) tracking-tight hover:text-white transition-colors"
        >
          System Atlas
        </Link>

        <span className="text-slate-700 font-light text-xs">|</span>

        <div className="flex items-center gap-1.5 text-[#94a3b8] text-[11px] font-(family-name:--labels)">
          <FiFolder className="w-3.5 h-3.5 text-slate-400" />
          <Link 
            to={`/workspaces/${workspaceId}/projects`} 
            className="hover:text-slate-200 transition-colors"
          >
            Projects
          </Link>
          <span className="text-slate-600">&gt;</span>

          <div className="relative flex items-center ml-1">
            <span className="absolute -inset-1 rounded-lg bg-sky-500/20 blur-sm pointer-events-none"></span>
            
            {loading ? (
              <span className="relative text-sm font-extrabold text-slate-500 animate-pulse font-(family-name:--headers)">
                Loading Project...
              </span>
            ) : (
              <span className="relative text-sm font-extrabold text-white tracking-wide truncate max-w-[280px] font-(family-name:--headers)">
                {projectName || "Untitled Project"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-2.5 w-3 h-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search architecture..."
            className="w-56 bg-[#12151e] text-slate-200 placeholder-slate-500 text-[11px] font-(family-name:--labels) pl-7 pr-3 py-1.5 rounded-full border border-slate-800/90 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-slate-400 pl-2 border-l border-slate-800">
          <button 
            type="button" 
            className="p-1 hover:text-slate-100 transition-colors cursor-pointer"
            title="Notifications"
          >
            <FiBell className="w-3.5 h-3.5" />
          </button>
          
          <button 
            type="button" 
            className="p-1 hover:text-slate-100 transition-colors cursor-pointer"
            title="Recent Activity"
          >
            <FiClock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}