import React from "react";

export default function GovernanceChecklist({ checklist = [] }) {
  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-6 space-y-4 w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider font-(family-name:--labels)">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        GOVERNANCE CHECKLIST
      </div>

      {checklist.length === 0 ? (
        <p className="text-xs text-slate-500 font-(family-name:--body-font)">No governance metrics found.</p>
      ) : (
        <div className="space-y-3">
          {checklist.map((item, index) => {
            const isPassed = item.status === "PASSED" || item.isPassed;
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${isPassed ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isPassed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      )}
                    </svg>
                  </div>
                  <span className="text-xs text-slate-200 font-medium font-(family-name:--body-font)">{item.title || item.name}</span>
                </div>
                <span className={`text-xs font-bold font-(family-name:--labels) ${isPassed ? "text-emerald-400" : "text-rose-400"}`}>
                  {item.value || (isPassed ? "PASSED" : "FAILED")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}