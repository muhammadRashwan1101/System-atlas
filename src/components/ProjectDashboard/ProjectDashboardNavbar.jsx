import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { RxMagnifyingGlass } from "react-icons/rx";
import { AiOutlineBell, AiOutlineQuestionCircle } from "react-icons/ai";
import { useDebounce } from "../../hooks/useDebounce";

const ProjectDashboardNavbar = memo(({ onSearchChange, searchValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange]);

  return (
    <nav className="flex items-center justify-between w-full h-16 bg-[#0A0B0D] border-b border-slate-800/80 shadow-lg shrink-0 text-white overflow-hidden">
      <div className="flex items-center gap-6 pl-6">
        <h3 className="font-bold text-sm tracking-wide text-white uppercase cursor-pointer">
          System Atlas
        </h3>

        <div className="relative flex items-center">
          <RxMagnifyingGlass className="absolute left-3 text-slate-500 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Project..."
            className="bg-[#0d0f14] border border-slate-800/80 pl-9 pr-4 py-1.5 rounded-md text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono w-64 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center h-full pr-4">
        <div className="flex items-center gap-4 pr-4">
          <AiOutlineBell className="text-lg text-slate-400 hover:text-white cursor-pointer transition-colors" />
          <AiOutlineQuestionCircle className="text-lg text-slate-400 hover:text-white cursor-pointer transition-colors" />
        </div>
        <div className="h-6 w-[1px] bg-slate-800/80" />
      </div>
    </nav>
  );
});

export default ProjectDashboardNavbar;