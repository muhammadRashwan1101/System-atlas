import { FiTrendingUp, FiTrash2, FiRefreshCw, FiZap } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";

export default function ImpactScorePanel({
  score = 84,
  riskLevel = "HIGH RISK",
  healthDelta = "-24%",
  factors = {
    components: 12,
    teams: "04",
    projects: "09",
    criticalPaths: "02",
  },
  stats = {
    components: 12,
    teams: "04",
    projects: "09",
  },
  businessImpacts = [
    { name: "Checkout Pipeline", status: "CRITICAL", color: "text-[#FF8A7A]" },
    { name: "User Auth", status: "CRITICAL", color: "text-[#FF8A7A]" },
    { name: "Product Search", status: "REDUCED", color: "text-[#FEB685]" },
  ],
  insights = [
    "Single Point of Failure: No fallback path for Auth requests.",
    "Chain depth (4) exceeds platform safety threshold.",
    "Ownership data missing for legacy cache node.",
  ],
  isFailureActive = false,
  onToggleFailure = () => {},
  onRemoveComponent = () => {},
  onSwapTechnology = () => {},
  onSaveScenario = () => {},
  onGenerateReport = () => {},
}) {
  return (
    <aside className="flex flex-col justify-between w-80 h-full bg-[#0A0B0D] border-l border-[#232730] p-5 gap-5 shrink-0 select-none overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Impact Score Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
              IMPACT SCORE
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#FF8A7A]">
              <FiTrendingUp className="text-xs" /> {riskLevel}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-[#FF8A7A]">
              {score}
            </span>
            <span className="text-xs font-mono text-[#8b949e]">/100</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF8A7A] rounded-full shadow-[0_0_8px_#FF8A7A]"
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="text-right text-[10px] font-mono text-[#8b949e]">
            Arch. Health: <span className="text-[#FF8A7A]">{healthDelta}</span>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
            CONTRIBUTING FACTORS
          </span>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Components</span>
              <span className="font-mono font-semibold text-white">
                {factors.components}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Teams</span>
              <span className="font-mono font-semibold text-white">
                {factors.teams}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Projects</span>
              <span className="font-mono font-semibold text-white">
                {factors.projects}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Crit-Paths</span>
              <span className="font-mono font-semibold text-[#FF8A7A]">
                {factors.criticalPaths}
              </span>
            </div>
          </div>

          {/* Double Sub-bars */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="w-full h-0.5 bg-[#2B3240] rounded-full overflow-hidden">
              <div className="h-full bg-[#8b949e] w-3/4" />
            </div>
            <div className="w-full h-0.5 bg-[#2B3240] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF8A7A] w-5/6" />
            </div>
          </div>
        </div>

        {/* Blast Radius Stats (3-card grid) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
            BLAST RADIUS STATS
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#121418] border border-[#232730]">
              <span className="text-base font-bold font-mono text-white">
                {stats.components}
              </span>
              <span className="text-[9px] font-mono text-[#8b949e] uppercase">
                COMP.
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#121418] border border-[#232730]">
              <span className="text-base font-bold font-mono text-white">
                {stats.teams}
              </span>
              <span className="text-[9px] font-mono text-[#8b949e] uppercase">
                TEAMS
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#121418] border border-[#232730]">
              <span className="text-base font-bold font-mono text-white">
                {stats.projects}
              </span>
              <span className="text-[9px] font-mono text-[#8b949e] uppercase">
                PROJECTS
              </span>
            </div>
          </div>
        </div>

        {/* Simulation Center */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
            SIMULATION CENTER
          </span>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onRemoveComponent}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-xs font-mono cursor-pointer"
            >
              <FiTrash2 className="text-xs text-[#8b949e]" />
              <span>Remove Component</span>
            </button>

            <button
              type="button"
              onClick={onSwapTechnology}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-xs font-mono cursor-pointer"
            >
              <FiRefreshCw className="text-xs text-[#8b949e]" />
              <span>Swap Technology</span>
            </button>

            <button
              type="button"
              onClick={onToggleFailure}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white font-semibold transition-all text-xs font-mono cursor-pointer ${
                isFailureActive
                  ? "bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                  : "bg-[#FF8A7A]/90 hover:bg-[#ff7563] text-black shadow-md shadow-red-500/20"
              }`}
            >
              <FiZap className="text-xs" />
              <span>
                {isFailureActive ? "Stop Failure Simulation" : "Introduce Failure"}
              </span>
            </button>
          </div>
        </div>

        {/* Business Impact */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#ADC6FF] font-semibold">
            <MdOutlineAnalytics />
            <span>BUSINESS IMPACT</span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            {businessImpacts.map((biz, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[#C4C6D0]">{biz.name}</span>
                <span className={`font-mono text-[10px] font-bold ${biz.color}`}>
                  {biz.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Insights */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
            ARCHITECTURE INSIGHTS
          </span>

          <ul className="flex flex-col gap-2 text-[11px] text-[#8b949e] leading-snug">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#FF8A7A] mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Actions: Save Scenario & Generate Report */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#232730]">
        <button
          type="button"
          onClick={onSaveScenario}
          className="py-2 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-xs font-mono cursor-pointer text-center"
        >
          Save Scenario
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          className="py-2 px-3 rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-semibold transition-colors text-xs font-mono cursor-pointer text-center shadow-md shadow-blue-500/10"
        >
          Generate Report
        </button>
      </div>
    </aside>
  );
}
