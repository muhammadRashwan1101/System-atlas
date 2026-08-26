import React from "react";

export default function ArchitectureEvents({ events = [] }) {
  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-6 space-y-4 font-mono w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        ARCHITECTURE EVENTS
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-slate-500">No recent events logged.</p>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-800">
          {events.map((evt, index) => (
            <div key={index} className="relative flex items-start gap-4 pl-6 text-xs">
              <span className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 -translate-x-1/2"></span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{evt.title}</span>
                  <span className="text-[10px] text-slate-400">{evt.time || evt.createdAt}</span>
                </div>
                <p className="text-slate-400">{evt.description}</p>
                {evt.author && <span className="text-[10px] text-slate-400 block">by {evt.author}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}