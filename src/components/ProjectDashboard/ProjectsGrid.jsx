import React from "react";
import ProjectCard from "./ProjectCard";
import AddProjectCard from "./AddProjectCard";

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
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 font-(family-name:--body-font) text-sm gap-3">
        <p className="text-rose-400">{error}</p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs uppercase tracking-wider font-semibold font-(family-name:--labels) transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 font-(family-name:--body-font) text-sm gap-3">
        <p>No projects match your current filters.</p>
        <div className="flex gap-3 font-(family-name:--labels)">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
          {onAddProject && (
            <button
              onClick={onAddProject}
              className="px-4 py-2 bg-(--primary) hover:bg-(--primary)/80 text-(--text-primary) font-bold uppercase tracking-wider rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              + Create Project
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
      {onAddProject && (
        <AddProjectCard onAddProject={onAddProject} />
      )}
    </div>
  );
}
