import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectHeader({ project }) {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();

  const name = project?.name || "Atlas Core API";
  const description =
    project?.description ||
    "High-performance gRPC gateway providing unified access to foundational workspace services. Core routing layer for all tenant-specific microservices.";
  const techLead = project?.techLead?.name || project?.techLead || "Erik Magnuson";
  const version = project?.version || "v4.12.0-rc3";
  const status = project?.status || "STABLE";
  const env = project?.targetEnvironment || "PRODUCTION";

  // دالة الانتقال لصفحة الجراف
  const handleGraphClick = () => {
    const targetWorkspace = workspaceId || project?.workspaceId;
    const targetProject = projectId || project?._id || project?.id;
    
    if (targetWorkspace && targetProject) {
      navigate(`/workspaces/${targetWorkspace}/projects/${targetProject}/graph`);
    } else {
      console.warn("Workspace ID or Project ID is missing for graph navigation");
    }
  };

  return (
    <div className="w-full space-y-5 font-mono text-slate-300">
   
      <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-2xl w-full">
        <div className="space-y-4 flex-1 w-full">

          <div className="flex items-center gap-3.5 flex-wrap">
            <h1 className="text-3xl font-bold text-white tracking-tight">{name}</h1>
            <span className="px-3 py-1 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider uppercase">
              {status}
            </span>
            <span className="px-3 py-1 rounded text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 tracking-wider uppercase">
              {env}
            </span>
          </div>

  
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed w-full">
            {description}
          </p>

 
          <div className="flex items-center gap-8 text-xs text-slate-400 pt-1.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase tracking-wider font-semibold">TECH LEAD:</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {techLead}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase tracking-wider font-semibold">VERSION:</span>
              <span className="text-slate-300 font-bold">{version}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
          <button
            onClick={() => alert("Edit modal/page coming soon!")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#161922] hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>

          <button
            onClick={handleGraphClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#161922] hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-300 transition-colors cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Graph
          </button>

          <button
            onClick={() => alert("Generating report...")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f87171] hover:bg-rose-500 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-500/20 cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Report
          </button>
        </div>
      </div>
    </div>
  );
}