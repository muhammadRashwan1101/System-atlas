import { Link, useNavigate } from "react-router-dom";
import { FiTv, FiBell } from "react-icons/fi";
import logo from "../../assets/system_atlas_logo.png";

export default function ImpactAnalysisHeader({
  activeTab = "Impact",
  onTabChange = () => {},
  onDeployChanges = () => {},
}) {
  const navigate = useNavigate();
  const tabs = ["Telemetry", "Nodes", "Topology", "Impact"];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src={logo} alt="System Atlas" className="w-7 h-7 rounded-lg" />
          <span className="font-bold text-white text-sm font-['Geist',sans-serif]">
            System Atlas
          </span>
        </Link>
      </div>

      {/* Center Tabs: Telemetry | Nodes | Topology | Impact */}
      <nav className="flex items-center gap-6 text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                onTabChange(tab);
                if (tab === "Topology") navigate("/app");
                if (tab === "Telemetry") navigate("/dashboard");
              }}
              className={`relative py-1 transition-colors cursor-pointer ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[#8b949e] hover:text-[#C4C6D0]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ADC6FF] rounded-full shadow-[0_0_8px_#ADC6FF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions: View, Bell & Deploy Changes */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-sm"
          aria-label="View Mode"
        >
          <FiTv />
        </button>

        <button
          type="button"
          className="relative p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-sm"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
        </button>

        <button
          type="button"
          onClick={onDeployChanges}
          className="px-3.5 py-1.5 rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-semibold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer font-sans"
        >
          Deploy Changes
        </button>
      </div>
    </header>
  );
}
