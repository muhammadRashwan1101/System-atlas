import { FiCrosshair, FiGitBranch, FiFileText, FiCode } from "react-icons/fi";
import { PiGraph } from "react-icons/pi";

export default function ArchitectureActionsCard({
  onHighlightInGraph = () => {},
  onTraceDependencies = () => {},
  onGenerateReport = () => {},
  onExportProfile = () => {},
}) {
  const actions = [
    {
      id: "highlight-graph",
      title: "Highlight in Graph",
      subtitle: "View node in topology visualization",
      icon: <FiCrosshair className="text-base text-[#ADC6FF]" />,
      onClick: onHighlightInGraph,
    },
    {
      id: "trace-deps",
      title: "Trace Dependency Chain",
      subtitle: "Discover all upstream consumers",
      icon: <FiGitBranch className="text-base text-[#ADC6FF]" />,
      onClick: onTraceDependencies,
    },
    {
      id: "gen-report",
      title: "Generate Architecture Report",
      subtitle: "Export architectural profile (PDF)",
      icon: <FiFileText className="text-base text-[#ADC6FF]" />,
      onClick: onGenerateReport,
    },
    {
      id: "export-profile",
      title: "Export Profile (ADR/JSON)",
      subtitle: "Download machine-readable metadata",
      icon: <FiCode className="text-base text-[#ADC6FF]" />,
      onClick: onExportProfile,
    },
  ];

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <span>ARCHITECTURE ACTIONS</span>
      </div>

      {/* Action list */}
      <div className="flex flex-col gap-2 pt-1">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className="flex items-center gap-3.5 p-3 rounded-lg bg-[#161920] hover:bg-[#1f242e] border border-[#232730] hover:border-[#384152] transition-all text-left group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-[#121418] border border-[#2B3240] shrink-0 group-hover:scale-105 transition-transform">
              {action.icon}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white group-hover:text-[#ADC6FF] transition-colors">
                {action.title}
              </span>
              <span className="text-[11px] text-[#8b949e] truncate">
                {action.subtitle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
