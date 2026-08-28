import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import { useDebounce } from "../../hooks/useDebounce";
import useAuth from "../../context/AuthContext";
import Avatar from "../Utils/Avatar";

const ProjectDashboardNavbar = memo(({ onSearchChange, searchValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { user } = useAuth();

  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange]);

  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Global Search */}
      <div className="relative flex items-center w-80">
        <FiSearch className="absolute left-3.5 text-[#8b949e] text-sm" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
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

        <Link to="/profile" className="ml-1">
          <Avatar
            avatarUrl={user?.avatar || user?.user?.avatar}
            name={user?.name || user?.user?.name || "Admin"}
            size="w-7 h-7 text-xs"
            className="ring-1 ring-slate-700 hover:ring-[#ADC6FF] transition-all"
          />
        </Link>
      </div>
    </header>
  );
});

ProjectDashboardNavbar.displayName = "ProjectDashboardNavbar";

export default ProjectDashboardNavbar;