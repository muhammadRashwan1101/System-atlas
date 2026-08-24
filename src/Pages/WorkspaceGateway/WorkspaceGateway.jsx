import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWorkspace from "../../context/WorkspaceContext";
import WorkspaceSelectionModal from "../../components/Navigation/WorkspaceSelectionModal";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FiLayers } from "react-icons/fi";

export default function WorkspaceGateway() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projectsByWorkspace, fetchProjects } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const activeWorkspace = (workspaces || []).find((w) => w._id === workspaceId);
  const projects = projectsByWorkspace[workspaceId] || [];

  useEffect(() => {
    let isMounted = true;
    if (!workspaceId) return;

    fetchProjects(workspaceId).then((resList) => {
      if (!isMounted) return;
      setLoading(false);
      // If exactly 1 project, auto navigate into graph explorer
      if (resList && resList.length === 1) {
        navigate(
          `/workspaces/${workspaceId}/projects/${resList[0]._id}/graph`,
          { replace: true }
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [workspaceId, fetchProjects, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-[#0A0B0D] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">
            Loading workspace architecture...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#0A0B0D] text-white p-6">
      <div className="flex flex-col w-full max-w-xl bg-[#0F1117] border border-[#232733] rounded-2xl shadow-2xl p-8 gap-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
            <FiLayers className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {projects.length === 0
                ? "No Projects in this Workspace"
                : "Select an Architecture Project"}
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Workspace: {activeWorkspace?.name || "Current Workspace"}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-light">
          {projects.length === 0
            ? "This workspace does not have any active architecture projects yet. Architecture components and telemetry graphs require a project context."
            : "Choose which project to inspect architecture graph for:"}
        </p>

        {/* Project List (if > 1 projects) */}
        {projects.length > 1 && (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-1">
            {projects.map((prj) => (
              <button
                key={prj._id}
                type="button"
                onClick={() =>
                  navigate(
                    `/workspaces/${workspaceId}/projects/${prj._id}/graph`
                  )
                }
                className="flex items-center justify-between w-full p-4 rounded-xl bg-[#141721] hover:bg-[#1A1F2C] border border-[#232733] hover:border-sky-400/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-sky-300">
                    {prj.name}
                  </span>
                  {prj.description && (
                    <span className="text-xs text-slate-400 line-clamp-1">
                      {prj.description}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open &rarr;
                </span>
              </button>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#232733]/60">
          {/* CTA 1: Create New Project */}
          <button
            type="button"
            onClick={() => navigate(`/workspaces/${workspaceId}/new-project`)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            <FaPlus className="w-3.5 h-3.5" />
            Create New Project
          </button>

          <div className="flex items-center gap-3">
            {/* CTA 2: Switch Workspace */}
            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#141721] hover:bg-[#1A1F2C] border border-[#232733] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <HiOutlineSwitchHorizontal className="w-4 h-4" />
              Switch Workspace
            </button>

            {/* CTA 3: Return to Dashboard */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#141721] hover:bg-[#1A1F2C] border border-[#232733] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RxDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Switch Workspace Modal */}
      <WorkspaceSelectionModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        title="Switch Workspace"
        subtitle="Select another workspace to view its projects:"
        items={workspaces}
        type="workspace"
        onSelect={(selectedWs) => {
          navigate(`/workspaces/${selectedWs._id}`);
        }}
      />
    </div>
  );
}
