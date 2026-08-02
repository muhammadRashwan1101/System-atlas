import { FiEye } from "react-icons/fi";

export default function EntityPreview({
  teamName = "Untitled Team",
  teamCode = "NOT-SET",
  leaderName = "Unassigned",
  metrics = { components: 0, services: 0, projects: 0 },
}) {
  return (
    <div className="relative overflow-hidden w-full max-w-sm p-6 rounded-2xl border border-slate-800/80 bg-[#0A0C10] text-slate-200 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-blue-500/15 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 text-slate-100 font-medium text-base">
        <FiEye className="text-slate-300 text-lg" />
        <span>Entity Preview</span>
      </div>

      {/* Proposed Team Identity */}
      <div className="relative z-10 flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Proposed Team Identity
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight break-words">
          {teamName || "Untitled Team"}
        </h3>
        <p className="font-mono text-xs text-[#34D399] font-medium">
          Code: <span className="uppercase">{teamCode || "NOT-SET"}</span>
        </p>
      </div>

      {/* Expected Ownership Scope */}
      <div className="relative z-10 flex flex-col gap-3">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Expected Ownership Scope
        </span>

        {/* Metrics List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/50 bg-[#0d0f14]/80">
            <span className="text-xs font-medium text-slate-300">Components</span>
            <span className="font-mono text-sm font-bold text-[#FF8A7A]">
              {metrics.components}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/50 bg-[#0d0f14]/80">
            <span className="text-xs font-medium text-slate-300">Services</span>
            <span className="font-mono text-sm font-bold text-[#FF8A7A]">
              {metrics.services}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/50 bg-[#0d0f14]/80">
            <span className="text-xs font-medium text-slate-300">Projects</span>
            <span className="font-mono text-sm font-bold text-[#FF8A7A]">
              {metrics.projects}
            </span>
          </div>
        </div>
      </div>

      {/* Governance Lead */}
      <div className="relative z-10 flex flex-col gap-2.5">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Governance Lead
        </span>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/60 flex items-center justify-center font-mono text-xs font-bold text-slate-300 uppercase">
            {leaderName !== "Unassigned" && leaderName.trim().length > 0
              ? leaderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "--"}
          </div>
          <span className="text-xs font-medium text-slate-200">
            {leaderName || "Unassigned"}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 p-3.5 rounded-xl border border-slate-800/40 bg-[#0d0f14]/50">
        <p className="text-[11px] leading-relaxed text-slate-500 italic">
          Note: Final ownership will be established upon completion of the metadata synchronization cycle.
        </p>
      </div>
    </div>
  );
}