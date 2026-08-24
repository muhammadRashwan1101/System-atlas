import {
  FiAlertTriangle,
  FiFileText,
  FiUserPlus,
  FiShield,
  FiCheckSquare,
} from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";

export default function GovernanceFindingsCard({ findings = [] }) {
  const defaultFindings = [
    {
      id: "missing-ownership",
      title: "Missing Ownership",
      description:
        "24 components in 'Payment Gateway' workspace have no technical lead assigned. Escalation protocol triggered.",
      icon: <FiAlertTriangle className="text-sm text-[#FF8A7A]" />,
      variant: "critical",
    },
    {
      id: "missing-docs",
      title: "Projects Missing Docs",
      description:
        "12 active projects are below the 70% documentation threshold. Impacting 'Velocity' score.",
      icon: <FiFileText className="text-sm text-[#8b949e]" />,
      variant: "neutral",
    },
    {
      id: "pending-invites",
      title: "Pending Invitations",
      description:
        "45 external collaborator invites have remained unaccepted for > 30 days. Risk of zombie accounts.",
      icon: <FiUserPlus className="text-sm text-[#8b949e]" />,
      variant: "neutral",
    },
    {
      id: "system-integrity",
      title: "System Integrity Check",
      description:
        "Cross-workspace relationship audit completed. No circular dependencies detected in Tier 0 services.",
      icon: <FiShield className="text-sm text-[#10B981]" />,
      variant: "success",
    },
  ];

  const items = findings.length > 0 ? findings : defaultFindings;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-[#ADC6FF]/10 text-[#ADC6FF]">
          <BsShieldCheck className="text-sm" />
        </span>
        <span className="font-sans text-sm font-bold text-white">
          Governance Findings
        </span>
      </div>

      {/* Findings List */}
      <div className="flex flex-col gap-3 pt-1">
        {items.map((item) => {
          const isCritical = item.variant === "critical";

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl transition-all ${
                isCritical
                  ? "bg-[#251314]/70 border border-[#FF8A7A]/30"
                  : "bg-[#161920] border border-[#232730]"
              }`}
            >
              <div className="mt-0.5 shrink-0">{item.icon}</div>

              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold ${
                    isCritical ? "text-[#FF8A7A]" : "text-white"
                  }`}
                >
                  {item.title}
                </span>
                <p className="text-[11px] text-[#8b949e] leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
