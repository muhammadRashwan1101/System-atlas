export default function TopologyCards({
  options,
  selected,
  setSelected,
  setProjectSummary,
}) {
  return (
    <div className="mt-6">
      <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-4">
        SYSTEM TOPOLOGY
      </h2>

      <div className="flex flex-wrap gap-4">
        {options.map((item) => (
          <div
            key={item.value}
            onClick={() => {
              setSelected(item.value);

              setProjectSummary((prev) => ({
                ...prev,
                systemTopology: item.title,
              }));
            }}
            className={`p-5 flex flex-col justify-center items-center w-50 h-25 rounded-lg border cursor-pointer transition-all duration-300 ${
              selected === item.value
                ? "border-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,.4)] scale-105"
                : "border-(--border) bg-(--secondary-bg)"
            }`}
          >
            <item.icon size={30} />

            <h1 className="text-xs mt-3 font-mono text-center">
              {item.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}