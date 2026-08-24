import { FiPlusCircle, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";

export default function RecentActivityCard({ activities = [] }) {
  const defaultActivities = [
    {
      id: "act-1",
      title: "Workspace Created: Omni-Channel-Beta",
      meta: "Initiated by Architect Sarah Jenkins • 45 minutes ago",
      icon: <FiPlusCircle className="text-sm text-[#10B981]" />,
    },
    {
      id: "act-2",
      title: "Team Created: Edge Integrity Unit",
      meta: "Assigned to Core Workspace • 2 hours ago",
      icon: <HiUserGroup className="text-sm text-[#8b949e]" />,
    },
    {
      id: "act-3",
      title: "Ownership Assigned: Payment-Vault API",
      meta: "Technical Lead: David Strauss • 5 hours ago",
      icon: <FiCheckCircle className="text-sm text-[#10B981]" />,
    },
  ];

  const list = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-[#ADC6FF]/10 text-[#ADC6FF]">
          <FiClock className="text-sm" />
        </span>
        <span className="font-sans text-sm font-bold text-white">
          Recent Activity
        </span>
      </div>

      {/* Activity List */}
      <div className="flex flex-col divide-y divide-[#232730]/60">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 py-3.5 first:pt-1 last:pb-0"
          >
            <div className="mt-0.5 shrink-0">{item.icon}</div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                {item.title}
              </span>
              <span className="text-[11px] text-[#8b949e] mt-0.5 font-sans">
                {item.meta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
