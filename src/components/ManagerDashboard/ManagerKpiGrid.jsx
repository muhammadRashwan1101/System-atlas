export default function ManagerKpiGrid({ metrics = {} }) {
  const {
    activeProjects = 12,
    teams = "08",
    components = 412,
    relationships = "1,842",
    criticalComps = "07",
    openRisks = 24,
  } = metrics;

  const kpis = [
    {
      id: "active-projects",
      label: "ACTIVE PROJECTS",
      value: activeProjects,
      variant: "default",
    },
    {
      id: "teams",
      label: "TEAMS",
      value: teams,
      variant: "default",
    },
    {
      id: "components",
      label: "COMPONENTS",
      value: components,
      variant: "default",
    },
    {
      id: "relationships",
      label: "RELATIONSHIPS",
      value: relationships,
      variant: "default",
    },
    {
      id: "critical-comps",
      label: "CRITICAL COMPS",
      value: criticalComps,
      variant: "danger-border",
    },
    {
      id: "open-risks",
      label: "OPEN RISKS",
      value: openRisks,
      variant: "danger-text",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {kpis.map((item) => {
        const isDangerBorder = item.variant === "danger-border";
        const isDangerText = item.variant === "danger-text";

        return (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-xl p-4 transition-all duration-150 ${
              isDangerBorder
                ? "bg-[#161214] border border-[#FF8A7A]/60 shadow-[0_0_15px_rgba(255,138,122,0.1)]"
                : "bg-[#121418] border border-[#232730] hover:border-[#384152]"
            }`}
          >
            {/* Label */}
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-medium ${
                isDangerBorder || isDangerText
                  ? "text-[#FF8A7A]"
                  : "text-[#8b949e]"
              }`}
            >
              {item.label}
            </span>

            {/* Value */}
            <div
              className={`text-2xl font-bold font-mono tracking-tight mt-2 ${
                isDangerBorder || isDangerText
                  ? "text-[#FF8A7A]"
                  : "text-white"
              }`}
            >
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
