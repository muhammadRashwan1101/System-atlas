import { useState } from "react";
import { FiArrowRight, FiChevronDown, FiPlus } from "react-icons/fi";
import { PiGraph } from "react-icons/pi";
import { MdOutlineDomain } from "react-icons/md";
import { IoExtensionPuzzleSharp } from "react-icons/io5";

export default function TopWorkspacesSection({
  workspaces = [],
  onSelectWorkspace = () => {},
  onAddWorkspace = () => {},
}) {
  const [filterHealth, setFilterHealth] = useState("All");
  const [sortBy, setSortBy] = useState("projects");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const defaultWorkspaces = [
    {
      id: "9920-X",
      name: "FinTech Core",
      wsid: "9920-X",
      status: "STABLE",
      owner: "Sarah Jenkins",
      projectsCount: "32 Active",
      teamsCount: "8 Cross-func",
      docHealth: "94% Compliant",
      docStatus: "stable",
      icon: <PiGraph className="text-sm text-white" />,
    },
    {
      id: "1042-L",
      name: "Legacy Migration",
      wsid: "1042-L",
      status: "REVIEW",
      owner: "Michael Chen",
      projectsCount: "14 Active",
      teamsCount: "4 Distributed",
      docHealth: "42% Critical",
      docStatus: "critical",
      icon: <MdOutlineDomain className="text-sm text-white" />,
    },
    {
      id: "8831-C",
      name: "Customer Experience",
      wsid: "8831-C",
      status: "STABLE",
      owner: "Elena Rodriguez",
      projectsCount: "58 Active",
      teamsCount: "12 Teams",
      docHealth: "88% Compliant",
      docStatus: "stable",
      icon: <IoExtensionPuzzleSharp className="text-sm text-white" />,
    },
  ];

  const list = workspaces.length > 0 ? workspaces : defaultWorkspaces;

  const filteredList = list.filter((ws) => {
    if (filterHealth === "Stable") return ws.status === "STABLE";
    if (filterHealth === "Review") return ws.status === "REVIEW";
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white font-['Geist',sans-serif]">
            Top Workspaces
          </h2>
          {onAddWorkspace && (
            <button
              type="button"
              onClick={onAddWorkspace}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#161920] hover:bg-[#1f242e] text-[#ADC6FF] border border-[#2B3240] text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <FiPlus className="text-xs" />
              <span>New Workspace</span>
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Filter by Health */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121418] border border-[#232730] text-xs font-mono text-[#8b949e] hover:text-white transition-colors cursor-pointer"
            >
              <span>
                {filterHealth === "All"
                  ? "Filter by Health"
                  : `Health: ${filterHealth}`}
              </span>
              <FiChevronDown className="text-xs" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-[#161920] border border-[#2B3240] rounded-xl shadow-2xl py-1 z-30 font-mono text-xs">
                {["All", "Stable", "Review"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFilterHealth(option);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer ${
                      filterHealth === option ? "text-[#ADC6FF]" : "text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by Projects */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121418] border border-[#232730] text-xs font-mono text-[#8b949e] hover:text-white transition-colors cursor-pointer"
            >
              <span>Sort by Projects</span>
              <FiChevronDown className="text-xs" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-[#161920] border border-[#2B3240] rounded-xl shadow-2xl py-1 z-30 font-mono text-xs">
                {["projects", "health", "name"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-white/5 transition-colors capitalize cursor-pointer ${
                      sortBy === option ? "text-[#ADC6FF]" : "text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredList.map((ws) => {
          const isStable = ws.status === "STABLE";

          return (
            <div
              key={ws.id}
              onClick={() => onSelectWorkspace(ws)}
              className="flex flex-col justify-between bg-[#121418] border border-[#232730] hover:border-[#384152] rounded-xl p-5 transition-all duration-200 cursor-pointer group"
            >
              {/* Card Header: Icon + Title + Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center shrink-0">
                    {ws.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#ADC6FF] transition-colors">
                      {ws.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#8b949e]">
                      WSID: {ws.wsid}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                    isStable
                      ? "bg-emerald-500/10 text-[#10B981] border-emerald-500/20"
                      : "bg-[#FF8A7A]/10 text-[#FF8A7A] border-[#FF8A7A]/20"
                  }`}
                >
                  {ws.status}
                </span>
              </div>

              {/* Specs 2x2 Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 my-5 pt-3 border-t border-[#232730]/60 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    OWNER
                  </span>
                  <span className="text-white font-medium mt-0.5">
                    {ws.owner}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    PROJECTS
                  </span>
                  <span className="text-white font-medium mt-0.5">
                    {ws.projectsCount}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    TEAMS
                  </span>
                  <span className="text-white font-medium mt-0.5">
                    {ws.teamsCount}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase text-[#8b949e]">
                    DOC HEALTH
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold mt-0.5 ${
                      ws.docStatus === "critical"
                        ? "text-[#FF8A7A]"
                        : "text-[#10B981]"
                    }`}
                  >
                    {ws.docHealth}
                  </span>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#8b949e] group-hover:text-[#ADC6FF] transition-colors pt-2 border-t border-[#232730]/60 uppercase tracking-wider">
                <span>VIEW WORKSPACE MAP</span>
                <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
