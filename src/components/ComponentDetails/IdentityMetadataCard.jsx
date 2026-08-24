import { FiSliders, FiTag } from "react-icons/fi";

export default function IdentityMetadataCard({
  description = "The Recommendation Service provides personalized content suggestions for users based on historical interaction patterns and real-time behavioral vectors.",
  tags = ["#personalization", "#ml-inference", "#tier-0"],
  metadata = {},
}) {
  const {
    type = "Backend Service",
    status = "Active",
    environment = "Production",
    version = "v2.4.0",
    createdDate = "Jan 12, 2023",
    lastUpdated = "Oct 12, 2023",
  } = metadata;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <FiSliders className="text-sm" />
        <span>IDENTITY & METADATA</span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#C4C6D0] leading-relaxed">
        {description || "No description provided for this component."}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded bg-[#161920] border border-[#2B3240] text-[11px] font-mono text-[#8b949e] hover:text-[#ADC6FF] hover:border-[#ADC6FF]/40 transition-colors"
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}

      {/* Key-Value Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 pt-2 border-t border-[#232730]/70 text-xs">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Type
          </span>
          <span className="font-medium text-white">{type}</span>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Status
          </span>
          <span className="font-medium text-[#10B981]">{status}</span>
        </div>

        {/* Environment */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Environment
          </span>
          <span className="font-medium text-white">{environment}</span>
        </div>

        {/* Version */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Version
          </span>
          <span className="font-mono text-white text-[11px]">{version}</span>
        </div>

        {/* Created Date */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Created Date
          </span>
          <span className="font-mono text-white text-[11px]">{createdDate}</span>
        </div>

        {/* Last Updated */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            Last Updated
          </span>
          <span className="font-mono text-white text-[11px]">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
