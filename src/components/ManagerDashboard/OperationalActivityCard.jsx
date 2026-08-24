export default function OperationalActivityCard({ activities = [] }) {
  const defaultActivities = [
    {
      id: "op-1",
      actionPrefix: "j.doe created",
      target: "PaymentGatewayV4",
      timestamp: "14:02:11 / UTC",
      dotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
    },
    {
      id: "op-2",
      actionPrefix: "s.system updated",
      target: "EdgeProxy ownership",
      timestamp: "13:44:00 / UTC",
      dotColor: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
    },
    {
      id: "op-3",
      actionPrefix: "m.chen marked",
      target: "LegacyAuth as deprecated",
      timestamp: "13:12:05 / UTC",
      dotColor: "bg-[#FEB685] shadow-[0_0_6px_#FEB685]",
    },
    {
      id: "op-4",
      actionPrefix: "auto-bot synced workspace with",
      target: "GitLab-Terraform",
      timestamp: "12:00:01 / UTC",
      dotColor: "bg-slate-400",
    },
  ];

  const list = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-3.5">
      {/* Header */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
        OPERATIONAL ACTIVITY
      </span>

      {/* Activity items */}
      <div className="flex flex-col gap-3.5 pt-1">
        {list.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5 text-xs">
            <span
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.dotColor}`}
            />

            <div className="flex flex-col">
              <span className="text-[#C4C6D0]">
                {item.actionPrefix}{" "}
                <strong className="text-white font-semibold">
                  {item.target}
                </strong>
              </span>
              <span className="font-mono text-[10px] text-[#8b949e] mt-0.5">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
