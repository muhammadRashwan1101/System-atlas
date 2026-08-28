import React from "react";

export default function CriticalFindings({ findings = [] }) {
  if (!findings || findings.length === 0) return null;

  return (
    <div className="bg-[#0e1017] border border-rose-900/30 rounded-2xl p-6 space-y-4 w-full">
      <div className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 font-(family-name:--labels)">
        <span>!</span> CRITICAL FINDINGS
      </div>

      <div className="space-y-3">
        {findings.map((item, index) => (
          <div key={index} className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-1">
            <h5 className="text-xs font-bold text-rose-400 font-(family-name:--headers)">{item.title}</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-(family-name:--body-font)">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}