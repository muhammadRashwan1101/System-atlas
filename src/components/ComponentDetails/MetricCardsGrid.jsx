import { FiFileText, FiShare2, FiLogIn, FiLogOut, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { PiGraph } from "react-icons/pi";

export default function MetricCardsGrid({ metrics = {} }) {
  const {
    docCoverage = "85%",
    totalRelationships = 8,
    dependenciesCount = 3,
    consumersCount = 5,
    ownerAssigned = true,
    isCritical = true,
  } = metrics;

  const cards = [
    {
      id: "doc-coverage",
      label: "DOC COVERAGE",
      value: typeof docCoverage === "number" ? `${docCoverage}%` : docCoverage,
      valueColor: "text-white",
      icon: <FiFileText className="text-[#10B981] text-sm" />,
    },
    {
      id: "total-relationships",
      label: "TOTAL RELATIONSHIPS",
      value: totalRelationships,
      valueColor: "text-white",
      icon: <PiGraph className="text-[#ADC6FF] text-sm" />,
    },
    {
      id: "dependencies",
      label: "DEPENDENCIES",
      value: dependenciesCount,
      valueColor: "text-white",
      icon: <FiLogIn className="text-[#8b949e] text-sm" />,
    },
    {
      id: "consumers",
      label: "CONSUMERS",
      value: consumersCount,
      valueColor: "text-white",
      icon: <FiLogOut className="text-[#8b949e] text-sm" />,
    },
    {
      id: "owner-assigned",
      label: "OWNER ASSIGNED",
      value: ownerAssigned ? "YES" : "NO",
      valueColor: ownerAssigned ? "text-[#10B981]" : "text-[#8b949e]",
      icon: <FiCheckCircle className="text-[#10B981] text-sm" />,
    },
    {
      id: "critical-component",
      label: "CRITICAL COMPONENT",
      value: isCritical ? "YES" : "NO",
      valueColor: isCritical ? "text-[#FF8A7A]" : "text-[#8b949e]",
      icon: <FiAlertCircle className="text-[#FF8A7A] text-sm" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col justify-between bg-[#121418] border border-[#232730] rounded-xl p-4 transition-all duration-200 hover:border-[#384152] group"
        >
          {/* Top Label & Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-medium">
              {card.label}
            </span>
            <div className="shrink-0">{card.icon}</div>
          </div>

          {/* Large Metric Value */}
          <div className={`text-2xl font-bold font-mono ${card.valueColor} tracking-tight`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
