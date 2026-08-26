import { PiTreeViewFill, PiTreeStructure } from "react-icons/pi";
import { IoMdFolderOpen } from "react-icons/io";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { MdOutlineRocketLaunch, MdOutlineHub } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

export default function ProjecPreview({ projectSummary }) {
  return (
    <div className="flex flex-col w-1/2 h-full p-8 shadow-[-2px_-4px_7px_rgba(0,0,0,0.6)] border-l border-[#44474F30] bg-(--main-bg)">
      <div className="flex items-center justify-between w-full py-8">
        <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm tracking-wider">
          Project Hierarchy Preview
        </h2>
        <PiTreeViewFill className="w-6 h-6 text-(--primary)" />
      </div>

      <div className="flex flex-col justify-between w-full p-8 bg-[#1E1F23] rounded-xl shadow-[inset_2px_2px_7px_0px_rgba(145,150,161,0.2),inset_-2px_-2px_7px_rgba(0,0,0,0.6)] border border-white/5">
        <div className="flex flex-col gap-6 w-full p-2">
          {/* Project root */}
          <div className="flex items-center gap-3">
            <IoMdFolderOpen className="w-5 h-5 text-(--primary)" />
            <h3 className="font-(family-name:--labels) text-white text-sm font-semibold uppercase truncate">
              {projectSummary.name || "New Project Target"}
            </h3>
          </div>

          {/* Department */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-3 border-s border-b border-slate-600"></div>
            <span className="font-(family-name:--labels) text-slate-400 text-xs">
              Dept: <span className="text-slate-200">{projectSummary.department || "Unassigned"}</span>
            </span>
          </div>

          {/* Environment */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-3 border-s border-b border-slate-600"></div>
            <MdOutlineRocketLaunch className="w-4 h-4 text-[#FEB685]" />
            <span className="font-(family-name:--labels) text-slate-400 text-xs">
              Env: <span className="text-slate-200">{projectSummary.targetEnvironment || "Standard"}</span>
            </span>
          </div>

          {/* Topology */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-3 border-s border-b border-slate-600"></div>
            <MdOutlineHub className="w-4 h-4 text-[#4EDEA3]" />
            <span className="font-(family-name:--labels) text-slate-400 text-xs">
              Topology: <span className="text-slate-200">{projectSummary.systemTopology || "Unassigned"}</span>
            </span>
          </div>

          {/* Manager */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-3 border-s border-b border-slate-600"></div>
            <FaRegUser className="w-3.5 h-3.5 text-(--primary)" />
            <span className="font-(family-name:--labels) text-slate-400 text-xs">
              Lead: <span className="text-slate-200">{projectSummary.managerName || "Unassigned"}</span>
            </span>
          </div>
        </div>

        <div className="border-t border-[#44474F30] mt-8 pt-4">
          <p className="font-(family-name:--labels) text-slate-500 text-[11px] leading-relaxed">
            *Architecture topology and node graph will be initialized automatically upon project creation.
          </p>
        </div>
      </div>
    </div>
  );
}
