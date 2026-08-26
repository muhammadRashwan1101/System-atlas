import React from "react";

export default function OwnershipSection({ teams = [] }) {
  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-6 space-y-4 font-mono w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        OWNERSHIP & ACCOUNTABILITY
      </div>

      {teams.length === 0 ? (
        <p className="text-xs text-slate-500">No ownership info assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <div key={team._id || team.id || index} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{team.name}</h4>
                {team.role && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                    {team.role}
                  </span>
                )}
              </div>
              {team.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{team.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}