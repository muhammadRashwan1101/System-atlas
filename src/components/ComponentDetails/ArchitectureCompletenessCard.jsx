import { FiCheckCircle, FiAlertTriangle, FiCheckSquare } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function ArchitectureCompletenessCard({ completeness = {} }) {
  const items = [
    { label: "Owner Assigned", status: completeness.ownerAssigned ?? true },
    { label: "Documentation Available", status: completeness.documentation ?? true },
    { label: "API Specification Linked", status: completeness.apiSpec ?? true },
    { label: "Relationships Documented", status: completeness.relationships ?? true },
    { label: "Technologies Assigned", status: completeness.technologies ?? true },
    { label: "Tagged", status: completeness.tagged ?? true },
    { label: "ADR Available", status: completeness.adrAvailable ?? false },
    { label: "Runbook Available", status: completeness.runbookAvailable ?? false },
  ];

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <FiCheckSquare className="text-sm" />
        <span>ARCHITECTURE COMPLETENESS</span>
      </div>

      {/* Checklist items */}
      <div className="flex flex-col gap-2.5 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1 text-xs border-b border-[#232730]/40 last:border-0"
          >
            <span className="text-[#C4C6D0]">{item.label}</span>
            <div>
              {item.status ? (
                <AiOutlineCheckCircle className="text-[#10B981] text-base" />
              ) : (
                <FiAlertTriangle className="text-[#FEB685] text-sm" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
