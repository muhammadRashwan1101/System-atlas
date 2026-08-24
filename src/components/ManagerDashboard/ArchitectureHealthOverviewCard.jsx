import { FiArrowUp } from "react-icons/fi";

export default function ArchitectureHealthOverviewCard({ healthOverview = {} }) {
  const {
    lastSync = "12:44:01",
    healthyCount = 384,
    healthyPercent = 93,
    warningCount = 21,
    warningPercent = 5,
    criticalCount = "07",
    criticalPercent = 2,
    ownershipCoverage = 98.2,
    ownershipDelta = "0.4%",
  } = healthOverview;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white font-['Geist',sans-serif]">
          Architecture Health Overview
        </h2>

        <span className="px-2.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-mono text-[10px] tracking-wider uppercase">
          Last Sync: {lastSync}
        </span>
      </div>

      {/* 4 Metrics Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Healthy */}
        <div className="flex flex-col p-3 rounded-lg bg-[#161920] border border-[#232730]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white font-medium uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            <span>HEALTHY</span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold font-mono text-white">
              {healthyCount}
            </span>
            <span className="text-[11px] font-mono text-[#8b949e]">
              ({healthyPercent}%)
            </span>
          </div>
        </div>

        {/* 2. Warning */}
        <div className="flex flex-col p-3 rounded-lg bg-[#161920] border border-[#232730]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white font-medium uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            <span>WARNING</span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold font-mono text-white">
              {warningCount}
            </span>
            <span className="text-[11px] font-mono text-[#8b949e]">
              ({warningPercent}%)
            </span>
          </div>
        </div>

        {/* 3. Critical */}
        <div className="flex flex-col p-3 rounded-lg bg-[#161920] border border-[#232730]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white font-medium uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A7A] shadow-[0_0_6px_#FF8A7A]" />
            <span>CRITICAL</span>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold font-mono text-white">
              {criticalCount}
            </span>
            <span className="text-[11px] font-mono text-[#8b949e]">
              ({criticalPercent}%)
            </span>
          </div>
        </div>

        {/* 4. Ownership Coverage */}
        <div className="flex flex-col p-3 rounded-lg bg-[#121915] border border-[#10B981]/40">
          <span className="text-[10px] font-mono uppercase text-[#8b949e] font-medium">
            OWNERSHIP COVERAGE
          </span>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold font-mono text-white">
              {ownershipCoverage}%
            </span>
            <span className="inline-flex items-center text-[10px] font-mono font-medium text-[#10B981]">
              <FiArrowUp className="text-xs" /> {ownershipDelta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
