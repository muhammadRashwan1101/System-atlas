import { FiLogIn, FiLogOut, FiExternalLink, FiPlus } from "react-icons/fi";

export default function DependenciesConsumersCard({
  dependencies = [],
  consumers = [],
  onSelectComponent = () => {},
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Dependencies Subcard */}
      <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
            <span>DEPENDENCIES ({dependencies.length})</span>
          </div>
          <FiLogIn className="text-[#8b949e] text-sm" />
        </div>

        {dependencies.length > 0 ? (
          <div className="flex flex-col divide-y divide-[#232730]/60">
            {dependencies.map((dep, idx) => (
              <div
                key={idx}
                onClick={() => onSelectComponent(dep)}
                className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-1 rounded transition-colors cursor-pointer group"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-[#ADC6FF] transition-colors">
                      {dep.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161920] border border-[#2B3240] text-[9px] font-mono text-[#ADC6FF]">
                      {dep.protocol}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8b949e] mt-0.5">
                    {dep.team}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-[#8b949e] uppercase">{dep.action}</span>
                  <FiExternalLink className="text-[#8b949e] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-[#161920]/50 border border-dashed border-[#232730] gap-1">
            <span className="text-xs font-mono text-[#8b949e]">
              No outgoing dependencies recorded in graph.
            </span>
          </div>
        )}
      </div>

      {/* Consumers Subcard */}
      <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
            <span>CONSUMERS ({consumers.length})</span>
          </div>
          <FiLogOut className="text-[#8b949e] text-sm" />
        </div>

        {consumers.length > 0 ? (
          <div className="flex flex-col divide-y divide-[#232730]/60">
            {consumers.map((con, idx) => (
              <div
                key={idx}
                onClick={() => onSelectComponent(con)}
                className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-1 rounded transition-colors cursor-pointer group"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-[#ADC6FF] transition-colors">
                      {con.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#161920] border border-[#2B3240] text-[9px] font-mono text-[#10B981]">
                      {con.protocol}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8b949e] mt-0.5">
                    {con.team}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-[#8b949e] uppercase">{con.action}</span>
                  <FiExternalLink className="text-[#8b949e] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-[#161920]/50 border border-dashed border-[#232730] gap-1">
            <span className="text-xs font-mono text-[#8b949e]">
              No upstream callers registered in graph.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
