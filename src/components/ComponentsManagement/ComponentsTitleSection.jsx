import { FiUpload, FiDownload } from "react-icons/fi";
import Breadcrumbs from "../Navigation/Breadcrumbs";

export default function ComponentsTitleSection({
  selectedEnv,
  workspaceName,
  projectName,
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <Breadcrumbs workspaceName={workspaceName} projectName={projectName} />
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
      </div>
    </div>
  );
}
