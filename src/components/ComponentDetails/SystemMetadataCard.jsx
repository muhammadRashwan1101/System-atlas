import { FiHash } from "react-icons/fi";

export default function SystemMetadataCard({ systemMetadata = {} }) {
  const {
    componentId = "svc-rec-001",
    project = "Atlas Core",
    workspace = "Growth-Prod",
    createdBy = "System Admin",
    labels = ["critical", "pii", "internal"],
  } = systemMetadata;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <span>SYSTEM METADATA</span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            COMPONENT ID
          </span>
          <span className="font-mono text-white text-xs">{componentId}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            PROJECT
          </span>
          <span className="text-white font-medium text-xs">{project}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            WORKSPACE
          </span>
          <span className="text-white font-medium text-xs">{workspace}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            CREATED BY
          </span>
          <span className="text-white font-medium text-xs">{createdBy}</span>
        </div>
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex flex-col gap-1 pt-2 border-t border-[#232730]/70">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            LABELS
          </span>
          <span className="font-mono text-xs text-[#C4C6D0]">
            {Array.isArray(labels) ? labels.join(", ") : labels}
          </span>
        </div>
      )}
    </div>
  );
}
