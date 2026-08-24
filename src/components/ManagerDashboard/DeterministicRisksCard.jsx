import { FiLink2, FiCheck } from "react-icons/fi";
import { PiGraph } from "react-icons/pi";

export default function DeterministicRisksCard({ risks = [] }) {
  const defaultRisks = [
    {
      id: "unowned-comps",
      title: "Unowned Components",
      meta: "12 entities require assignment",
      variant: "critical-alert",
    },
    {
      id: "critical-deps",
      title: "Critical Dependencies",
      meta: "4 nodes in high-risk path",
      icon: <FiLink2 className="text-[#8b949e] text-sm" />,
      variant: "default",
    },
    {
      id: "spof",
      title: "Single Points of Failure",
      meta: "2 bottlenecks detected",
      icon: <PiGraph className="text-[#8b949e] text-sm" />,
      variant: "default",
    },
    {
      id: "dep-density",
      title: "Dependency Density",
      meta: "Metric within threshold",
      icon: <FiCheck className="text-[#8b949e] text-sm" />,
      variant: "default",
    },
  ];

  const list = risks.length > 0 ? risks : defaultRisks;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-3.5">
      {/* Header */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
        DETERMINISTIC RISKS
      </span>

      {/* Risks List */}
      <div className="flex flex-col gap-2.5 pt-1">
        {list.map((item) => {
          const isCritical = item.variant === "critical-alert";

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCritical
                  ? "bg-[#1f1315] border border-[#FF8A7A]/40"
                  : "bg-[#161920] border border-[#232730]"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold ${
                    isCritical ? "text-[#FF8A7A]" : "text-white"
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-[11px] font-mono text-[#8b949e]">
                  {item.meta}
                </span>
              </div>

              {isCritical ? (
                <span className="text-base font-bold text-[#FF8A7A] pr-1">!</span>
              ) : (
                item.icon && <div className="shrink-0">{item.icon}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
