// src/components/ProjectDashboard/PageHeader.jsx
import React from "react";
import { FiDownload, FiUpload, FiPlus } from "react-icons/fi";

export default function PageHeader({
  title,
  subtitle,
  onImport,
  onExport,
  onGetReport,
  buttonText = "Get a Report", 
}) {
  return (
    <div className="flex items-center justify-between w-full py-4 px-8 bg-[#0A0B0D] border-b border-slate-800/80 text-white shrink-0">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-white font-(family-name:--headers) leading-tight">
          {title}
        </h1>
        <span className="text-[10px] font-(family-name:--labels) tracking-widest text-slate-400 uppercase mt-0.5">
          {subtitle}
        </span>
      </div>

      <div className="flex items-center gap-3 font-(family-name:--labels)">
        {onImport && (
          <button
            type="button"
            onClick={onImport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 bg-[#12141a] border border-slate-800 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FiUpload className="text-xs text-slate-400" />
            <span>Import</span>
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 bg-[#12141a] border border-slate-800 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FiDownload className="text-xs text-slate-400" />
            <span>Export</span>
          </button>
        )}

        {onGetReport && (
          <button
            type="button"
            onClick={onGetReport}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 bg-[#C6D4FF] hover:bg-[#b0c2ff] rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <FiPlus className="text-sm stroke-[2.5]" />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
}