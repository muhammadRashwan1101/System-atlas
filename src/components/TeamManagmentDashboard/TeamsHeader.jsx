// src/components/TeamManagmentDashboard/TeamsHeader.jsx

import React from "react";
import { FiDownload, FiUpload, FiPlus } from "react-icons/fi";

export default function TeamsHeader({
  title = "Teams Management",
  subtitle = "Manage and audit cross-functional engineering units across the workspace.",
  onImport,
  onExport,
  onCreateTeam,
  buttonText = "New Team",
}) {
  return (
    <header className="w-full flex items-center justify-between py-1">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onImport && (
          <button
            type="button"
            onClick={onImport}
            className="
              flex items-center gap-2
              px-4 py-2.5
              text-sm font-medium
              text-slate-200
              bg-[#12161F]
              border border-slate-800
              rounded-lg
              hover:bg-slate-800/80
              transition-colors
            "
          >
            <FiUpload size={16} className="text-slate-400" />
            Import
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="
              flex items-center gap-2
              px-4 py-2.5
              text-sm font-medium
              text-slate-200
              bg-[#12161F]
              border border-slate-800
              rounded-lg
              hover:bg-slate-800/80
              transition-colors
            "
          >
            <FiDownload size={16} className="text-slate-400" />
            Export
          </button>
        )}

        {onCreateTeam && (
          <button
            type="button"
            onClick={onCreateTeam}
            className="
              flex items-center gap-2
              px-4.5 py-2.5
              text-sm font-semibold
              text-slate-900
              bg-[#B2CCFF]
              hover:bg-[#9ebdfd]
              rounded-lg
              transition-colors
              shadow-sm
            "
          >
            <FiPlus size={16} />
            {buttonText}
          </button>
        )}
      </div>
    </header>
  );
}