import { Link } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import profilePic from "../../assets/profile-pic/profliePic.png";

export default function ComponentsHeader({ searchQuery, onSearchChange }) {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Global Architecture Search */}
      <div className="relative flex items-center w-80">
        <FiSearch className="absolute left-3.5 text-[#8b949e] text-sm" />
        <input
          type="text"
          placeholder="Search architecture..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-sky-400/80 transition-all font-mono"
        />
      </div>

      {/* Quick Links & User Navigation */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5 text-xs text-[#8b949e] font-medium">
          <Link to="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link to="/api" className="hover:text-white transition-colors">
            API
          </Link>
          <Link to="/status" className="hover:text-white transition-colors">
            Status
          </Link>
        </div>

        <button
          type="button"
          className="text-[#8b949e] hover:text-white text-base transition-colors p-1.5 rounded-md hover:bg-white/5 cursor-pointer"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#232730]">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-white leading-tight">
              Alex Rivera
            </span>
            <span className="text-[9px] font-mono uppercase text-[#8b949e] tracking-wider">
              PRINCIPAL ARCH
            </span>
          </div>
          <img
            src={profilePic}
            alt="Alex Rivera"
            className="w-8 h-8 rounded-full border border-sky-400/40 object-cover"
          />
        </div>
      </div>
    </header>
  );
}
