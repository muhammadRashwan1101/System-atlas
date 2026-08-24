import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiSettings, FiGrid } from "react-icons/fi";
import profilePic from "../../assets/profile-pic/profliePic.png";

export default function ManagerDashboardHeader({
  activeTab = "Dashboard",
  onTabChange = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  userRole = "manager",
  onToggleRole,
}) {
  const navigate = useNavigate();

  const tabs = ["Dashboard", "Architecture", "Teams", "Reports"];

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Navigation Tabs (Dashboard, Architecture, Teams, Reports) */}
      <nav className="flex items-center gap-7 text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#8b949e] hover:text-[#C4C6D0]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B8CFF] rounded-full shadow-[0_0_8px_#5B8CFF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Search, Actions & User */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex items-center w-64">
          <FiSearch className="absolute left-3 text-[#8b949e] text-xs" />
          <input
            type="text"
            placeholder="Search systems..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-[#5B8CFF]/70 transition-all font-mono"
          />
        </div>

        {/* View / Grid */}
        <button
          type="button"
          className="p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-sm"
          title="Grid View"
        >
          <FiGrid />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-sm"
          title="Notifications"
        >
          <FiBell />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => navigate("/profile-settings")}
          className="p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-sm"
          title="Settings"
        >
          <FiSettings />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#232730]">
          {onToggleRole && (
            <button
              type="button"
              onClick={onToggleRole}
              className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1f242e] hover:bg-[#2b3240] text-[#ADC6FF] border border-[#2B3240] rounded transition-colors cursor-pointer"
              title="Switch Dashboard View"
            >
              Role: {userRole}
            </button>
          )}
          <img
            src={profilePic}
            alt="User profile"
            className="w-7 h-7 rounded-full border border-sky-400/40 object-cover"
          />
        </div>
      </div>
    </header>
  );
}
