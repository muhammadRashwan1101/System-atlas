import React from "react";
import ProjectCard from "./ProjectCard";
import AddProjectCard from "./AddProjectCard";

export default function ProjectsGrid({ projects, loading, error, onResetFilters, onAddProject }) {
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-mono text-xs animate-pulse">
        Fetching system projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400 font-mono text-xs border border-red-900/40 bg-red-950/10 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
        
   
        <AddProjectCard onAddProject={onAddProject} />
      </div>

      {!loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-[#0a0b0d] rounded-xl border border-slate-800/60 text-center px-4">
          <p className="text-slate-400 font-mono text-xs mb-1">
            No projects matched your active search & filters.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono rounded transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}