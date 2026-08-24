export default function TeamUtilizationCard({ teams = [] }) {
  const defaultTeams = [
    {
      id: "util-1",
      name: "Platform Ops",
      rate: 82,
      color: "bg-[#10B981] shadow-[0_0_8px_#10B981]",
      textColor: "text-[#10B981]",
      hasDot: false,
    },
    {
      id: "util-2",
      name: "Frontend Eng",
      rate: 94,
      color: "bg-[#FEB685] shadow-[0_0_8px_#FEB685]",
      textColor: "text-[#FEB685]",
      hasDot: true,
      dotColor: "bg-[#FEB685]",
    },
    {
      id: "util-3",
      name: "Backend Core",
      rate: 103,
      color: "bg-[#FF8A7A] shadow-[0_0_8px_#FF8A7A]",
      textColor: "text-[#FF8A7A]",
      hasDot: true,
      dotColor: "bg-[#FF8A7A]",
    },
    {
      id: "util-4",
      name: "DevOps / SRE",
      rate: 71,
      color: "bg-slate-400",
      textColor: "text-slate-300",
      hasDot: false,
    },
  ];

  const list = teams.length > 0 ? teams : defaultTeams;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-4">
      {/* Header */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
        TEAM UTILIZATION
      </span>

      {/* Utilization Bars */}
      <div className="flex flex-col gap-4 pt-1">
        {list.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{item.name}</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className={`font-bold ${item.textColor}`}>
                  {item.rate}%
                </span>
                {item.hasDot && (
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                )}
              </div>
            </div>

            <div className="w-full h-1.5 bg-[#1f242e] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${item.color}`}
                style={{ width: `${Math.min(100, item.rate)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
