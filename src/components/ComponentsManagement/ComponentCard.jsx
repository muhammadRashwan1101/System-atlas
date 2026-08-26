import { useState } from "react";
import { FiShare2, FiEye, FiEdit2, FiCompass } from "react-icons/fi";
import ComponentIcon from "./ComponentIcon";

export default function ComponentCard({
  comp,
  onInspect,
  onEdit,
  onExploreGraph,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onInspect && onInspect(comp)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between bg-[#121418] rounded-xl p-5 transition-all duration-300 shadow-lg overflow-hidden cursor-pointer ${
        isHovered
          ? "border border-(--primary) shadow-[0_0_20px_rgba(173,198,255,0.2)]"
          : "border border-[#232730]"
      }`}
    >
      {/* Centered Hover Action Overlay */}
      <div
        className="absolute inset-0 z-30 flex items-center justify-center gap-3 bg-[#0A0B0D]/70 backdrop-blur-[2px] transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
        }}
      >
        {/* View / Inspect Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onInspect) onInspect(comp);
          }}
          className="w-10 h-10 rounded-full bg-(--primary) hover:bg-[#ccdaff] text-(--text-primary) font-semibold flex items-center justify-center text-base shadow-lg shadow-blue-500/30 transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="View Component"
          aria-label="View Component"
        >
          <FiEye />
        </button>

        {/* Edit Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(comp);
          }}
          className="w-10 h-10 rounded-full bg-[#1e232d] hover:bg-[#2b3240] text-white border border-[#384152] flex items-center justify-center text-sm shadow-md transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="Edit Component"
          aria-label="Edit Component"
        >
          <FiEdit2 />
        </button>

        {/* Relationships / Explore in Graph Action */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onExploreGraph) onExploreGraph(comp);
          }}
          className="w-10 h-10 rounded-full bg-[#1e232d] hover:bg-[#2b3240] text-white border border-[#384152] flex items-center justify-center text-base shadow-md transition-transform duration-150 hover:scale-110 cursor-pointer"
          title="View Relationships & Graph"
          aria-label="View Relationships & Graph"
        >
          <FiCompass />
        </button>
      </div>

      {/* Existing Card Content (Dims and blurs smoothly on hover) */}
      <div
        className="flex flex-col justify-between h-full transition-all duration-300"
        style={{
          opacity: isHovered ? 0.15 : 1,
          filter: isHovered ? "blur(2px)" : "none",
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Card Header: Icon & Health Status */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center">
              <ComponentIcon iconType={comp.iconType} />
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                comp.status === "WARNING"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  comp.status === "WARNING" ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              {comp.status}
            </span>
          </div>

          {/* Component Title & ID */}
          <div>
            <h3 className="font-semibold text-white text-base leading-tight">
              {comp.name}
            </h3>
            <p className="text-[11px] font-mono text-[#8b949e] mt-1">
              ID: {comp._id}
            </p>
          </div>

          {/* Metadata Rows */}
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Type</span>
              <span className="text-white font-medium">{comp.type}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Environment</span>
              <span className="px-2 py-0.5 rounded bg-[#1a1e26] border border-[#2b3240] text-[11px] text-white font-mono">
                {comp.environment}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Owner Team</span>
              <span className="text-white font-medium">{comp.ownerTeam}</span>
            </div>
          </div>

          {/* Tech Stack Pills */}
          {Array.isArray(comp.technologies) && comp.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {comp.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-[#1a1e26] border border-[#2b3240] text-[10px] text-[#c9d1d9] font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer: Relationships */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#232730]/70 text-xs text-[#8b949e]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FiShare2 className="text-xs text-[#8b949e]" />
            <span>{comp.relationshipsCount || 0} Relationships</span>
          </div>
        </div>
      </div>
    </div>
  );
}
