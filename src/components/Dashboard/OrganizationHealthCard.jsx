import { FiActivity } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";

export default function OrganizationHealthCard({ healthData = {} }) {
  const {
    lastUpdated = "12M AGO",
    ownershipCoverage = 98.2,
    ownershipDetails = "4,210 of 4,288 registered assets have assigned technical owners.",
    docCoverage = 84.6,
    docDetails = "Core API services documentation audit passed. Web frontend requires review.",
    connectedRatio = 92.5,
    connectedDetails = '78 components are currently "orphaned" with no established upstream/downstream links.',
  } = healthData;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-white">
          <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <FiActivity className="text-sm" />
          </span>
          <span className="font-sans text-sm font-bold">Organization Health</span>
        </div>

        <span className="text-[10px] font-mono text-[#8b949e] tracking-wider uppercase">
          LAST UPDATED: {lastUpdated}
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="flex flex-col gap-5 pt-1">
        {/* 1. Ownership Coverage */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Ownership Coverage</span>
            <span className="font-mono font-bold text-[#10B981]">
              {ownershipCoverage}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-500 shadow-[0_0_8px_#10B981]"
              style={{ width: `${ownershipCoverage}%` }}
            />
          </div>

          <p className="text-[11px] text-[#8b949e] mt-0.5">{ownershipDetails}</p>
        </div>

        {/* 2. Documentation Coverage */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">
              Documentation Coverage
            </span>
            <span className="font-mono font-bold text-white">
              {docCoverage}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-300 rounded-full transition-all duration-500"
              style={{ width: `${docCoverage}%` }}
            />
          </div>

          <p className="text-[11px] text-[#8b949e] mt-0.5">{docDetails}</p>
        </div>

        {/* 3. Connected Components vs. Orphans */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">
              Connected Components vs. Orphans
            </span>
            <span className="font-mono font-bold text-[#FF8A7A]">
              {connectedRatio}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF8A7A] rounded-full transition-all duration-500 shadow-[0_0_8px_#FF8A7A]"
              style={{ width: `${connectedRatio}%` }}
            />
          </div>

          <p className="text-[11px] text-[#8b949e] mt-0.5">{connectedDetails}</p>
        </div>
      </div>
    </div>
  );
}
