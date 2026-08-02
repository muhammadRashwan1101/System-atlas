

export default function Cards() {
    const statss = [
        { label: "OWNED COMPONENTS", value: "42", color: "text-emerald-400" },
        { label: "OWNED PROJECTS", value: "08", color: "text-slate-200" },
        { label: "RELATIONSHIPS", value: "156", color: "text-slate-200" },
        { label: "CRITICAL (TIER 0)", value: "04", color: "text-red-400" },
        { label: "DOCS CONTRIBUTIONS", value: "28", color: "text-slate-200" },
      ];
  return (
    <>
     {statss.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-[#2D303A] bg-[#1E1F23] p-6 flex jusify-center items-center flex-col`}
            >
              <p className="text-[10px] tracking-wider text-neutral-400 uppercase mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
    </>
  )
}
