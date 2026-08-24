import { FiClock } from "react-icons/fi";

export default function ActivityTimelineCard({
  activities = [
    {
      time: "Today, 14:15",
      action: "Documentation Updated: API Spec v2.4.1",
      dotColor: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
    },
    {
      time: "Yesterday, 18:03",
      action: "Relationship Added: Notification Svc",
      dotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
    },
    {
      time: "Oct 10, 16:20",
      action: "Ownership Assigned to Growth Team",
      dotColor: "bg-[#FEB685] shadow-[0_0_6px_#FEB685]",
    },
  ],
}) {
  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <span>ACTIVITY TIMELINE</span>
      </div>

      {/* Timeline List */}
      <div className="flex flex-col gap-4 pt-1">
        {activities.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs">
            <div className="pt-1.5 shrink-0">
              <span className={`block w-2 h-2 rounded-full ${item.dotColor}`} />
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#8b949e]">
                {item.time}
              </span>
              <span className="text-[#C4C6D0] font-medium mt-0.5">
                {item.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
