import {
  FiChevronDown,
  FiRotateCcw,
  FiGrid,
  FiList,
  FiCheck,
} from "react-icons/fi";

export default function ComponentsFilterBar({
  selectedType,
  setSelectedType,
  availableTypes,
  isTypeDropdownOpen,
  setIsTypeDropdownOpen,
  selectedTech,
  setSelectedTech,
  availableTechs,
  isTechDropdownOpen,
  setIsTechDropdownOpen,
  selectedEnv,
  setSelectedEnv,
  isEnvDropdownOpen,
  setIsEnvDropdownOpen,
  onResetFilters,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121418] border border-[#232730] text-xs">
      {/* Left Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Type:</span>
            <span className="font-medium">{selectedType}</span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {isTypeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {availableTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedType(t);
                    setIsTypeDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{t}</span>
                  {selectedType === t && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tech Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Tech:</span>
            <span className="font-medium">{selectedTech}</span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {isTechDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 max-h-56 overflow-y-auto flex flex-col">
              {availableTechs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTech(t);
                    setIsTechDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{t}</span>
                  {selectedTech === t && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Environment Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsEnvDropdownOpen(!isEnvDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-white transition-colors cursor-pointer"
          >
            <span className="text-[#8b949e]">Env:</span>
            <span className="font-medium">
              {selectedEnv === "All" ? "Production" : selectedEnv}
            </span>
            <FiChevronDown className="text-[#8b949e] text-xs" />
          </button>

          {isEnvDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {["All", "Production", "Staging", "Development"].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setSelectedEnv(e);
                    setIsEnvDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{e}</span>
                  {selectedEnv === e && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8b949e] hover:text-white transition-colors cursor-pointer ml-1"
        >
          <FiRotateCcw className="text-xs" /> Reset
        </button>
      </div>

      {/* Right Controls: View Switch & Sort */}
      <div className="flex items-center gap-4">
        {/* View Switch */}
        <div className="flex items-center bg-[#1a1e26] border border-[#2b3240] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            aria-label="Grid view"
          >
            <FiGrid />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded text-sm transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-[#2b3240] text-white shadow-sm"
                : "text-[#8b949e] hover:text-white"
            }`}
            aria-label="List view"
          >
            <FiList />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 text-xs text-[#8b949e] hover:text-white transition-colors cursor-pointer"
          >
            <span>
              {sortBy === "recent"
                ? "Recently Updated"
                : sortBy === "name"
                ? "Name"
                : "Relationships"}
            </span>
            <FiChevronDown className="text-xs" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-lg shadow-xl z-30 py-1 flex flex-col">
              {[
                { key: "recent", label: "Recently Updated" },
                { key: "name", label: "Name (A-Z)" },
                { key: "relationships", label: "Most Relationships" },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setSortBy(s.key);
                    setIsSortDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-left text-xs text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <span>{s.label}</span>
                  {sortBy === s.key && <FiCheck className="text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
