import { FiEdit2, FiTrash2, FiShare2 } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { PiGraph } from "react-icons/pi";

export default function ComponentHeroSection({
  component,
  onRunImpactAnalysis,
  onOpenInGraph,
  onEdit,
  onOpenTopology,
  onDelete,
}) {
  const typeLabel = component?.type || "Backend Service";
  const envLabel = component?.environment || "Production";
  const status = component?.status || "HEALTHY";
  const isHealthy = status === "HEALTHY" || status === "Active" || status === "active";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
      {/* Title and Badges */}
      <div className="flex flex-col gap-2.5">
        {/* Category & Status Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-[#121418] border border-[#2B3240] text-[#ADC6FF] text-[11px]">
            {typeLabel}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-[#121418] border border-[#2B3240] text-[#10B981] text-[11px]">
            {envLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-[#10B981] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-amber-400"}`} />
            {isHealthy ? "Healthy" : status}
          </span>
        </div>

        {/* Main Component Title */}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white font-['Geist',sans-serif]">
          {component?.name || "Recommendation Service"}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Run Impact Analysis Button */}
        <button
          type="button"
          onClick={onRunImpactAnalysis}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-semibold text-xs transition-all duration-150 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <MdOutlineAnalytics className="text-base" />
          <span>Run Impact Analysis</span>
        </button>

        {/* Open in Graph Explorer Button */}
        <button
          type="button"
          onClick={onOpenInGraph}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161920] hover:bg-[#1f242e] text-white border border-[#2B3240] font-medium text-xs transition-all duration-150 cursor-pointer"
        >
          <span>Open in Graph Explorer</span>
        </button>

        {/* Icon Action Buttons */}
        <div className="flex items-center gap-1 pl-1">
          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            title="Edit Component"
            aria-label="Edit Component"
            className="p-2 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm"
          >
            <FiEdit2 />
          </button>

          {/* Topology */}
          <button
            type="button"
            onClick={onOpenTopology}
            title="Graph Topology"
            aria-label="Graph Topology"
            className="p-2 rounded-lg text-[#8b949e] hover:text-[#ADC6FF] hover:bg-white/5 transition-colors cursor-pointer text-sm"
          >
            <FiShare2 />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            title="Delete Component"
            aria-label="Delete Component"
            className="p-2 rounded-lg text-[#8b949e] hover:text-[#FF8A7A] hover:bg-red-500/10 transition-colors cursor-pointer text-sm"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
