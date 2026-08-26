import { FiUpload, FiDownload, FiPlus } from "react-icons/fi";

export default function ComponentsTitleSection({
  selectedEnv,
  onAddNewComponent,
  workspaceName,
  projectName,
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-[#8b949e] font-mono">
          <span className="hover:text-white cursor-pointer">
            {workspaceName || "Workspace"}
          </span>
          <span>&gt;</span>
          <span className="text-white font-medium">
            {projectName || (selectedEnv === "All" ? "Components" : selectedEnv)}
          </span>
        </div>
        <h1 className="font-(family-name:--headers) text-3xl font-bold text-white tracking-tight">
          Components Management
        </h1>
        <p className="text-xs text-[#8b949e] max-w-2xl font-light leading-relaxed">
          Browse and manage all architecture components inside the current
          project. View health telemetry and dependency mapping in real-time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <FiUpload className="text-sm text-[#8b949e]" /> Import
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <FiDownload className="text-sm text-[#8b949e]" /> Export
        </button>
        <button
          type="button"
          onClick={onAddNewComponent}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5B8CFF] hover:bg-[#4a7cee] text-white font-medium text-xs rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <FiPlus className="text-sm font-bold" /> Add Component
        </button>
      </div>
    </div>
  );
}
