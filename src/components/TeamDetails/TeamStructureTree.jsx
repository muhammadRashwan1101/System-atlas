import React from "react";

export default function TeamStructureTree({ members = [], lead }) {
  const leadName =
    typeof lead === "string"
      ? lead
      : `${lead?.firstName || ""} ${lead?.lastName || ""}`.trim() || lead?.name || "Alex Rivera";

  const leadRole = lead?.role === "admin" ? "Architect" : "Architect";

  // Sub-leads and engineers
  const techLead = members.find((m) => m.role?.toLowerCase().includes("lead")) || {
    name: "Jamie Volts",
    role: "Tech Lead",
  };

  const engineers = members.filter((m) => !m.role?.toLowerCase().includes("lead") && m.name !== leadName);
  const displayEngineers = engineers.length > 0 ? engineers : [
    { name: "Samir Gupta", role: "Senior" },
    { name: "Chloe Marks", role: "Senior" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
        TEAM STRUCTURE
      </div>

      <div className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-5 font-mono text-xs text-slate-300">
        {/* Root: Architect / Primary Lead */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
          <span className="font-bold text-white">
            {leadName} <span className="text-slate-400 font-normal">({leadRole})</span>
          </span>
        </div>

        {/* Tree Branch: Tech Lead */}
        <div className="pl-6 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-slate-800">
          <div className="relative pl-6 py-2">
            <span className="absolute left-0 top-4 w-4 h-px bg-slate-700"></span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">
                {techLead.name} <span className="text-slate-400 font-normal">({techLead.role || "Tech Lead"})</span>
              </span>
            </div>

            {/* Sub-Branch: Engineers */}
            <div className="pl-6 mt-2 relative before:absolute before:left-2 before:top-0 before:bottom-3 before:w-px before:bg-slate-800 space-y-2">
              {displayEngineers.map((eng, idx) => (
                <div key={idx} className="relative pl-4 flex items-center gap-2">
                  <span className="absolute left-0 top-2.5 w-3 h-px bg-slate-700"></span>
                  <span className="text-slate-300">
                    {eng.name} <span className="text-slate-400 font-normal">({eng.role || "Senior"})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
