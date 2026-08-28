import { FiSearch, FiBell, FiClock, FiHelpCircle, FiPlus } from "react-icons/fi";
import Breadcrumbs from "../Navigation/Breadcrumbs";

export default function DashboardHeader({
  searchQuery = "",
  onSearchChange = () => {},
  onAddWorkspace = () => {},
  onExploreArchitecture = () => {},
  onGenerateReport = () => {},
}) {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center gap-6">
        <Breadcrumbs />
        <div className="relative hidden md:flex items-center w-80">
          <FiSearch className="absolute left-3.5 text-[#8b949e] text-xs" />
          <input
            type="text"
            placeholder="Search architecture, workspaces..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-[#ADC6FF]/70 transition-all font-mono"
          />
        </div>
      </div>

      {/* Quick Action Icons & Buttons */}
      <div className="flex items-center gap-4">
        {/* Utility Icon Buttons */}
        <div className="flex items-center gap-1 text-[#8b949e]">
          <button
            type="button"
            className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm"
            aria-label="Notifications"
          >
            <FiBell />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm"
            aria-label="Recent audit history"
          >
            <FiClock />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm"
            aria-label="Help and Documentation"
          >
            <FiHelpCircle />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#232730]">
          <button
            type="button"
            onClick={onAddWorkspace}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-(--primary) hover:bg-(--primary)/80 text-(--text-primary)/80 font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 cursor-pointer font-mono"
          >
            <FiPlus className="text-sm stroke-[2.5]" />
            <span>Add Workspace</span>
          </button>
          <button
            type="button"
            onClick={onExploreArchitecture}
            className="px-3.5 py-1.5 rounded-lg bg-[#161920] hover:bg-[#1f242e] text-white border border-[#2B3240] font-medium text-xs tracking-wider uppercase transition-all cursor-pointer font-mono"
          >
            Explore Architecture
          </button>
          <button
            type="button"
            onClick={onGenerateReport}
            className="px-3.5 py-1.5 rounded-lg bg-[#161920] hover:bg-[#1f242e] text-white border border-[#2B3240] font-medium text-xs tracking-wider uppercase transition-all cursor-pointer font-mono"
          >
            Generate Report
          </button>
        </div>
      </div>
    </header>
  );
}

