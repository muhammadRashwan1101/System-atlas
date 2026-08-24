import { FiX, FiActivity, FiArrowUpRight, FiArrowDownLeft, FiAlertTriangle } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";

export default function ImpactAnalysisModal({
  isOpen,
  onClose,
  componentName = "Recommendation Service",
  dependenciesCount = 3,
  consumersCount = 5,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col bg-[#121418] border border-[#2B3240] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#232730] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ADC6FF]/10 text-[#ADC6FF]">
              <MdOutlineAnalytics className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Impact Analysis Simulation
              </h3>
              <p className="text-xs font-mono text-[#8b949e]">{componentName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4 p-6 text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <FiAlertTriangle className="text-lg shrink-0" />
            <span>
              Outage Simulation: If this component degrades or goes offline, <strong>{consumersCount} downstream consumers</strong> will experience cascade latency or disruption.
            </span>
          </div>

          {/* Blast Radius Grid */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="p-4 rounded-xl bg-[#161920] border border-[#232730] flex flex-col">
              <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                Direct Blast Radius
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1">
                {consumersCount} Services
              </span>
              <span className="text-[11px] text-[#8b949e] mt-1">
                Mobile API, Web BFF, Email Svc
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#161920] border border-[#232730] flex flex-col">
              <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                Upstream Dependencies
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1">
                {dependenciesCount} Services
              </span>
              <span className="text-[11px] text-[#8b949e] mt-1">
                Profile Svc, Catalog API, RDS
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#232730]">
            <span className="text-[10px] font-mono uppercase text-[#8b949e]">
              Recommended Fallbacks
            </span>
            <ul className="list-disc list-inside space-y-1 text-[#C4C6D0]">
              <li>Enable fallback static recommendations cache (TTL: 1 hour)</li>
              <li>Circuit breaker enabled on Web Frontend BFF</li>
              <li>Async retry queue enabled for event listeners</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#232730] bg-[#161920]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] transition-colors cursor-pointer"
          >
            Export Blast Radius
          </button>
        </div>
      </div>
    </div>
  );
}
