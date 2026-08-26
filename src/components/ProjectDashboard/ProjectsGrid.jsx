import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({
  projects = [],
  loading = false,
  error = null,
  onResetFilters,
  onAddProject,
  onProjectClick,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400 font-mono text-sm">
        <span className="animate-pulse">Loading projects data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 font-mono text-sm gap-3">
        <p className="text-red-400">{error}</p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 font-mono text-sm gap-3">
        <p>No projects match your current filters.</p>
        <div className="flex gap-3">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
          >
            Reset Filters
          </button>
          {onAddProject && (
            <button
              onClick={onAddProject}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs transition-colors"
            >
              + Create Project
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => {
        const projectId = project._id || project.id;
        return (
          <ProjectCard
            key={projectId}
            project={project}
            onClick={() => onProjectClick && onProjectClick(project)}
          />
        );
      })}
    </div>
  );
}