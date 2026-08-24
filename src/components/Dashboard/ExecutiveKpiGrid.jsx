export default function ExecutiveKpiGrid({ kpiData = {} }) {
  const {
    workspaces = 24,
    workspacesDelta = "+2",
    projects = 148,
    teams = 42,
    users = "1,204",
    usersDelta = "+14%",
    components = "3,890",
    relationships = "12K+",
    docCoverage = "84%",
    govScore = 92,
  } = kpiData;

  const kpiItems = [
    {
      id: "workspaces",
      label: "WORKSPACES",
      value: workspaces,
      delta: workspacesDelta,
      deltaColor: "text-[#10B981]",
    },
    {
      id: "projects",
      label: "PROJECTS",
      value: projects,
    },
    {
      id: "teams",
      label: "TEAMS",
      value: teams,
    },
    {
      id: "users",
      label: "USERS",
      value: users,
      delta: usersDelta,
      deltaColor: "text-[#10B981]",
    },
    {
      id: "components",
      label: "COMPONENTS",
      value: components,
    },
    {
      id: "relationships",
      label: "RELATIONSHIPS",
      value: relationships,
    },
    {
      id: "doc-coverage",
      label: "DOC COVERAGE",
      value: docCoverage,
    },
    {
      id: "gov-score",
      label: "GOV. SCORE",
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-[#10B981]">{govScore}</span>
          <span className="text-xs font-mono text-[#8b949e]">/100</span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpiItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between bg-[#121418] border border-[#232730] rounded-xl p-3.5 transition-all duration-150 hover:border-[#384152]"
        >
          {/* Label */}
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-medium">
            {item.label}
          </span>

          {/* Value and optional delta */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <div className="text-xl font-bold font-mono text-white">
              {item.value}
            </div>
            {item.delta && (
              <span className={`text-[10px] font-mono font-medium ${item.deltaColor}`}>
                {item.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
