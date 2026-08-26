import React from "react";

export default function TechnologyStack({ techStack = {} }) {
  const categories = Object.keys(techStack);

  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-6 space-y-4 font-mono w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        TECHNOLOGY STACK
      </div>

      {categories.length === 0 ? (
        <p className="text-xs text-slate-500">No tech stack data available.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="grid grid-cols-4 items-center gap-2 text-xs">
              <span className="text-slate-400 capitalize">{category}</span>
              <div className="col-span-3 flex flex-wrap gap-2">
                {Array.isArray(techStack[category]) ? (
                  techStack[category].map((item, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs flex items-center gap-1.5"
                    >
                      {typeof item === "string" ? item : item.name}
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs">
                    {String(techStack[category])}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}