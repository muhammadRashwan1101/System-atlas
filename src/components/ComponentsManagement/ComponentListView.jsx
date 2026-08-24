import { FiShare2 } from "react-icons/fi";
import ComponentIcon from "./ComponentIcon";

export default function ComponentListView({ components, onInspect }) {
  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-6 gap-4 p-3.5 bg-[#1a1e26] border-b border-[#232730] text-[11px] font-mono uppercase text-[#8b949e] font-semibold">
        <span className="col-span-2">Component Name & ID</span>
        <span>Type</span>
        <span>Environment</span>
        <span>Owner Team</span>
        <span>Relationships</span>
      </div>

      <div className="divide-y divide-[#232730]/60">
        {components.map((comp) => (
          <div
            key={comp._id}
            onClick={() => onInspect && onInspect(comp)}
            className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-white/5 transition-colors text-xs cursor-pointer"
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center shrink-0">
                <ComponentIcon iconType={comp.iconType} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs hover:text-[#ADC6FF] transition-colors">{comp.name}</h4>
                <span className="text-[10px] font-mono text-[#8b949e]">
                  {comp._id}
                </span>
              </div>
            </div>

            <span className="text-[#c9d1d9]">{comp.type}</span>
            <div>
              <span className="px-2 py-0.5 rounded bg-[#1a1e26] border border-[#2b3240] text-[11px] font-mono text-white">
                {comp.environment}
              </span>
            </div>
            <span className="text-[#c9d1d9]">{comp.ownerTeam}</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8b949e]">
              <FiShare2 /> {comp.relationshipsCount || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
