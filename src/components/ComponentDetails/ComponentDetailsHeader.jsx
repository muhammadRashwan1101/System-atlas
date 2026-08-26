import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import Breadcrumbs from "../Navigation/Breadcrumbs";

export default function ComponentDetailsHeader({
  workspaceName = "Growth-Prod",
  projectName = "Atlas Core",
  componentName = "Recommendation Service",
  searchQuery = "",
  onSearchChange = () => {},
}) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Breadcrumb Path */}
      <Breadcrumbs
        workspaceName={workspaceName}
        projectName={projectName}
        componentName={componentName}
      />

      {/* Right Search, Actions & Profile */}
      <div className="flex items-center gap-5">
        {/* Search resources input */}
        <div className="relative flex items-center w-64">
          <FiSearch className="absolute left-3 text-[#8b949e] text-xs" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-[#ADC6FF]/70 transition-all font-mono"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative text-[#8b949e] hover:text-white text-base transition-colors p-1.5 rounded-md hover:bg-white/5 cursor-pointer"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
        </button>
      </div>
    </header>
  );
}
