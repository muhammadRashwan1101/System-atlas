export default function DashboardTitleSection({
  title = "Executive Dashboard",
  subtitle = "Overview of organizational governance and architectural health across 12 clusters.",
  auditPeriod = "Q3-2024 AUDIT PERIOD",
  systemStatus = "SYSTEM STABLE",
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white font-['Geist',sans-serif]">
          {title}
        </h1>
        <p className="text-xs text-[#8b949e] font-sans">{subtitle}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 text-[11px] font-mono">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#121418] border border-[#232730] text-[#10B981] font-medium uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          {systemStatus}
        </span>

        <span className="px-3 py-1 rounded bg-[#121418] border border-[#232730] text-[#8b949e] uppercase tracking-wider">
          {auditPeriod}
        </span>
      </div>
    </div>
  );
}
