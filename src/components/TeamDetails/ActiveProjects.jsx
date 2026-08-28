import React from "react";

export default function ActiveProjects({ projects = [] }) {
  const defaultProjects = [
    {
      _id: "p1",
      name: "Core Mesh Upgrade",
      componentsCount: 8,
      priority: "High Priority",
      progress: 75,
    },
    {
      _id: "p2",
      name: "Security Hardening",
      componentsCount: 12,
      priority: "Medium Priority",
      progress: 40,
    },
  ];

  const list = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
        ACTIVE PROJECTS
      </div>

      <div className="space-y-3">
        {list.map((proj, index) => {
          const compCount = proj.componentsCount ?? 8;
          const priority = proj.priority || "Medium Priority";
          const progress = proj.progress ?? 50;

          return (
            <div
              key={proj._id || index}
              className="bg-[#0e1017] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-(family-name:--headers)">
                    {proj.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {compCount} Components • {priority}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {progress}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
