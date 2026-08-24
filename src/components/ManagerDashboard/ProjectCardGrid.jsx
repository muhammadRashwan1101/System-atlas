export default function ProjectCardGrid({
  projects = [],
  onOpenProject = () => {},
  onOpenExplorer = () => {},
  onRunImpact = () => {},
}) {
  const defaultProjects = [
    {
      id: "PRJ-901-CN",
      name: "Cloud Native Migration",
      displayId: "ID: PRJ-901-CN",
      owner: "E. Musk",
      team: "Platform Ops",
      progress: 82,
      comps: 45,
      relations: 122,
      statusDotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
      progressColor: "bg-[#10B981] shadow-[0_0_8px_#10B981]",
      cardBorder: "border-[#10B981]/40",
    },
    {
      id: "PRJ-442-LA",
      name: "Legacy Auth Deprecation",
      displayId: "ID: PRJ-442-LA",
      owner: "S. Altman",
      team: "Identity Core",
      progress: 34,
      comps: 12,
      relations: 98,
      statusDotColor: "bg-[#FEB685] shadow-[0_0_6px_#FEB685]",
      progressColor: "bg-[#FEB685] shadow-[0_0_8px_#FEB685]",
      cardBorder: "border-[#232730]",
    },
    {
      id: "PRJ-811-DM",
      name: "Data Mesh Realignment",
      displayId: "ID: PRJ-811-DM",
      owner: "J. Huang",
      team: "Data Platforms",
      progress: 61,
      comps: 88,
      relations: 315,
      statusDotColor: "bg-[#ADC6FF] shadow-[0_0_6px_#ADC6FF]",
      progressColor: "bg-[#ADC6FF] shadow-[0_0_8px_#ADC6FF]",
      cardBorder: "border-[#232730]",
    },
    {
      id: "PRJ-221-GW",
      name: "API Gateway v3",
      displayId: "ID: PRJ-221-GW",
      owner: "L. Su",
      team: "Foundation",
      progress: 95,
      comps: "06",
      relations: 42,
      statusDotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
      progressColor: "bg-[#10B981] shadow-[0_0_8px_#10B981]",
      cardBorder: "border-[#232730]",
    },
  ];

  const list = projects.length > 0 ? projects : defaultProjects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list.map((proj) => (
        <div
          key={proj.id}
          className={`flex flex-col justify-between bg-[#121418] rounded-xl p-5 border ${proj.cardBorder} hover:border-[#384152] transition-all`}
        >
          <div>
            {/* Header: Name + Status Dot */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {proj.name}
                </h3>
                <span className="text-[10px] font-mono text-[#8b949e]">
                  {proj.displayId}
                </span>
              </div>

              <span
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${proj.statusDotColor}`}
              />
            </div>

            {/* Owner & Team */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                  OWNER
                </span>
                <span className="text-white font-medium mt-0.5">
                  {proj.owner}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                  TEAM
                </span>
                <span className="text-white font-medium mt-0.5">
                  {proj.team}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-1 mt-4">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="uppercase text-[#8b949e]">PROGRESS</span>
                <span className="text-white font-semibold">{proj.progress}%</span>
              </div>

              <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${proj.progressColor}`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Comps & Relations */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs border-t border-[#232730]/60 pt-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                  COMPS
                </span>
                <span className="text-base font-bold font-mono text-white">
                  {proj.comps}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                  RELATIONS
                </span>
                <span className="text-base font-bold font-mono text-white">
                  {proj.relations}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row: Open | Explorer | Impact */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#232730]/60 text-xs font-mono">
            <button
              type="button"
              onClick={() => onOpenProject(proj)}
              className="py-1.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-center cursor-pointer"
            >
              Open
            </button>

            <button
              type="button"
              onClick={() => onOpenExplorer(proj)}
              className="py-1.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-center cursor-pointer"
            >
              Explorer
            </button>

            <button
              type="button"
              onClick={() => onRunImpact(proj)}
              className="py-1.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-center cursor-pointer"
            >
              Impact
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
