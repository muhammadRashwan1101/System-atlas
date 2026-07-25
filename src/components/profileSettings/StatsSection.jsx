export default function StatsSection() {
  const stats = [
    {
      label: "OWNED COMPONENTS",
      value: "42",
      color: "text-[#D8E2FF]",
      border: "border-[#D8E2FF]",
    },
    {
      label: "OWNED PROJECTS",
      value: "08",
      color: "text-[#4EDEA3]",
      border: "border-[#4EDEA3]",
    },
    {
      label: "RELATIONSHIPS",
      value: "156",
      color: "text-[#ADC6FF]",
      border: "border-[#ADC6FF]",
    },
    {
      label: "CRITICAL COMPONENTS",
      value: "04",
      color: "text-[#FF8A80]",
      border: "border-[#FF8A80]",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 my-14">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={` rounded-lg border ${stat.border} border-l-5 p-6 flex flex-col jusify-center items-center`}
          >
            <p className="text-[14px] text-neutral-400 uppercase mb-4">
              {stat.label}
            </p>
            <p className={`text-4xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
