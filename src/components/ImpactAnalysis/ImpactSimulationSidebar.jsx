import { useState } from "react";
import { FiSearch, FiFileText } from "react-icons/fi";

export default function ImpactSimulationSidebar({
  activeSimulation = {
    name: "Recommendation Service",
    status: "LIVE",
    description: "Traffic redirection simulation to legacy cache nodes.",
  },
  history = [
    {
      id: "hist-1",
      name: "Auth Service Failure",
      status: "CRITICAL",
      time: "2 hours ago",
    },
    {
      id: "hist-2",
      name: "Redis Removal",
      status: "STABLE",
      time: "5 hours ago",
    },
  ],
  savedReports = [
    { id: "rep-1", title: "Q3 Scalability Baseline" },
    { id: "rep-2", title: "Post-Mortem: #442" },
  ],
  onSelectSimulation = () => {},
  onOpenReport = () => {},
}) {
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <aside className="flex flex-col w-72 h-full bg-[#0A0B0D] border-r border-[#232730] p-4 gap-5 shrink-0 select-none overflow-y-auto">
      {/* Search / Filter Input */}
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3 text-[#8b949e] text-xs" />
        <input
          type="text"
          placeholder="Filter Analysis..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-[#ADC6FF] transition-all font-mono"
        />
      </div>

      {/* Active Simulation */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
          ACTIVE SIMULATION
        </span>

        <div className="flex flex-col p-3 rounded-xl bg-[#161920] border border-[#2B3240] gap-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white text-xs">
              {activeSimulation.name}
            </h4>
            <span className="px-1.5 py-0.2 rounded bg-[#1f242e] border border-[#2B3240] text-[9px] font-mono text-[#8b949e]">
              {activeSimulation.status}
            </span>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-snug">
            {activeSimulation.description}
          </p>
        </div>
      </div>

      {/* Analysis History */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
          ANALYSIS HISTORY
        </span>

        <div className="flex flex-col gap-2">
          {history.map((item) => {
            const isCritical = item.status === "CRITICAL";

            return (
              <div
                key={item.id}
                onClick={() => onSelectSimulation(item)}
                className="flex flex-col p-2.5 rounded-lg bg-[#121418] hover:bg-[#161920] border border-[#232730] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white text-xs">
                    {item.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-semibold tracking-wider ${
                      isCritical ? "text-[#FF8A7A]" : "text-[#10B981]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8b949e] mt-0.5">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Reports */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]/60">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
          SAVED REPORTS
        </span>

        <div className="flex flex-col gap-2">
          {savedReports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => onOpenReport(report)}
              className="flex items-center gap-2 text-left text-xs text-[#C4C6D0] hover:text-[#ADC6FF] transition-colors cursor-pointer"
            >
              <FiFileText className="text-xs text-[#8b949e] shrink-0" />
              <span className="truncate">{report.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
