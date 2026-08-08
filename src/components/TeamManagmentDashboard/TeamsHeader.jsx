import { FiDownload, FiUpload, FiPlus } from "react-icons/fi";

export default function TeamsHeader({
  onImport,
  onExport,
  onCreateTeam,
}) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-[#0B0C10]">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Teams Management
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage and audit cross-functional engineering units across the workspace.
        </p>
      </div>

      <div className="flex gap-3">

        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm hover:bg-slate-800 transition"
        >
          <FiUpload />
          Import
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm hover:bg-slate-800 transition"
        >
          <FiDownload />
          Export
        </button>

        <button
          onClick={onCreateTeam}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#AFC7FF] text-slate-900 font-semibold hover:bg-[#9db9ff] transition"
        >
          <FiPlus />
          New Team
        </button>

      </div>
    </header>
  );
}