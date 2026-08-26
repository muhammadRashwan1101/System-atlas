import React from "react";

export default function ArchitectureSummary({ components = [], relationships = [] }) {
  const apiServices = components.filter(
    (c) => (c.type || "").toLowerCase().includes("api") || (c.type || "").toLowerCase().includes("backend")
  ).length;

  const dataStores = components.filter(
    (c) => (c.type || "").toLowerCase().includes("database") || (c.type || "").toLowerCase().includes("store")
  ).length;

  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-6 space-y-4 font-mono w-full">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>ARCHITECTURE</span>
        <span className="text-[10px] text-slate-500">{relationships.length} Relationships</span>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">{apiServices} API Services</div>
            <div className="text-[10px] text-slate-400">Exposed via gRPC, REST & Gateway</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">{dataStores} Data Stores</div>
            <div className="text-[10px] text-slate-400">Managed RDS, SQL & NoSQL Instances</div>
          </div>
        </div>
      </div>
    </div>
  );
}