import { IoClose } from "react-icons/io5";
import { MdOutlineDomain } from "react-icons/md";
import { FaFolderOpen, FaPlus, FaArrowRight } from "react-icons/fa6";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FiLayers } from "react-icons/fi";

export default function WorkspaceSelectionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  items = [],
  type = "workspace", // "workspace" | "project" | "empty_projects"
  workspaceName = "",
  onSelect,
  onCreateProject,
  onSwitchWorkspace,
  onGoDashboard,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-lg bg-[#0F1117] border border-[#232733] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#232733]/80 bg-[#141720]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ADC6FF]/10 text-(--primary) border border-(--primary)/20">
              {type === "workspace" ? (
                <MdOutlineDomain className="w-5 h-5" />
              ) : type === "project" ? (
                <FaFolderOpen className="w-5 h-5" />
              ) : (
                <FiLayers className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide">
                {title ||
                  (type === "workspace"
                    ? "Select Workspace"
                    : type === "project"
                    ? "Select Project"
                    : "No Projects Found")}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {subtitle ||
                  (type === "empty_projects"
                    ? "Architecture components and graph explorers require an active project."
                    : "Choose an environment to proceed")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {type === "empty_projects" ? (
          <div className="flex flex-col p-6 gap-5 bg-[#0A0B0E]">
            <div className="p-4 rounded-xl bg-[#141721] border border-[#262C3D] flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Workspace: {workspaceName || "Current Workspace"}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                There are currently no architecture projects configured in this workspace. You can initialize the first project, switch to another workspace, or return to the main dashboard.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              {/* CTA 1: Create New Project */}
              <button
                type="button"
                onClick={() => {
                  if (onCreateProject) onCreateProject();
                  onClose();
                }}
                className="flex items-center justify-between w-full p-4 rounded-xl bg-(--primary) hover:bg-[#ccdaff] text-(--text-primary) shadow-[0_0_12px_rgba(173,198,255,0.3)] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-(--text-primary)/10 text-(--text-primary) font-bold">
                    <FaPlus className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-(--text-primary)">
                      Create New Project
                    </span>
                    <span className="text-[11px] text-(--text-primary)/80 font-mono">
                      Initialize architecture mapping in this workspace
                    </span>
                  </div>
                </div>
                <FaArrowRight className="w-3.5 h-3.5 text-(--text-primary) group-hover:translate-x-1 transition-transform" />
              </button>

              {/* CTA 2: Switch Workspace */}
              <button
                type="button"
                onClick={() => {
                  if (onSwitchWorkspace) onSwitchWorkspace();
                }}
                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-[#141721] hover:bg-[#1A1F2C] border border-[#232733] hover:border-[#353D52] text-slate-200 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <HiOutlineSwitchHorizontal className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      Switch Workspace
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Select another workspace that may contain active projects
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200">&rarr;</span>
              </button>

              {/* CTA 3: Return to Dashboard */}
              <button
                type="button"
                onClick={() => {
                  if (onGoDashboard) onGoDashboard();
                  onClose();
                }}
                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-[#141721] hover:bg-[#1A1F2C] border border-[#232733] hover:border-[#353D52] text-slate-200 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <RxDashboard className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      Return to Dashboard
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Go back to global overview and metrics
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200">&rarr;</span>
              </button>
            </div>
          </div>
        ) : (
          /* List Mode */
          <div className="flex flex-col max-h-80 overflow-y-auto p-4 gap-2 divide-y divide-[#232733]/40">
            {items.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No accessible {type}s found.
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-[#191D28] border border-transparent hover:border-[#2D3344] transition-all text-left group cursor-pointer"
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-sky-300 transition-colors">
                        {item.name}
                      </span>
                      {item.status && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.status}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-mono text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open &rarr;
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-[#232733]/80 bg-[#141720]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
