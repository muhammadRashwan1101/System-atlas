import { FiPlusCircle, FiUsers, FiFileText, FiCompass } from "react-icons/fi";
import { IoExtensionPuzzleOutline } from "react-icons/io5";

export default function QuickActionsCard({
  onCreateProject = () => {},
  onCreateTeam = () => {},
  onCreateComponent = () => {},
  onOpenExplorer = () => {},
  onGenerateReport = () => {},
}) {
  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-5 gap-3.5">
      {/* Header */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-semibold">
        QUICK ACTIONS
      </span>

      {/* 2x2 Grid Actions */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* New Project */}
        <button
          type="button"
          onClick={onCreateProject}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors cursor-pointer"
        >
          <FiPlusCircle className="text-xs text-[#ADC6FF]" />
          <span>Project</span>
        </button>

        {/* New Team */}
        <button
          type="button"
          onClick={onCreateTeam}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors cursor-pointer"
        >
          <FiUsers className="text-xs text-[#ADC6FF]" />
          <span>Team</span>
        </button>

        {/* New Component */}
        <button
          type="button"
          onClick={onCreateComponent}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors cursor-pointer"
        >
          <IoExtensionPuzzleOutline className="text-xs text-[#ADC6FF]" />
          <span>Component</span>
        </button>

        {/* Explorer */}
        <button
          type="button"
          onClick={onOpenExplorer}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors cursor-pointer"
        >
          <FiCompass className="text-xs text-[#ADC6FF]" />
          <span>Explorer</span>
        </button>
      </div>

      {/* Full Width Button: Generate Governance Report */}
      <button
        type="button"
        onClick={onGenerateReport}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#161920] hover:bg-[#202530] text-white border border-[#232730] transition-colors text-xs font-mono cursor-pointer"
      >
        <FiFileText className="text-xs text-[#ADC6FF]" />
        <span>Generate Governance Report</span>
      </button>
    </div>
  );
}
