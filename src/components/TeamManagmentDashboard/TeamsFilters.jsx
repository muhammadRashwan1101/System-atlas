import FilterDropdown from "./FilterDropdown";
import { FiGrid, FiList } from "react-icons/fi";

const workspaceOptions = [
  { value: "all", label: "All Workspaces" },
  { value: "workspace1", label: "Workspace 1" },
  { value: "workspace2", label: "Workspace 2" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const leadOptions = [
  { value: "all", label: "All Leads" },
];

const sizeOptions = [
  { value: "all", label: "All Sizes" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function TeamsFilters({
  filters,
  onFilterChange,
  view,
  onViewChange,
}) {
  return (
    <div className="w-full flex items-center justify-between gap-4">

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">

        <FilterDropdown
          label="Workspace"
          value={filters.workspace}
          options={workspaceOptions}
          onChange={(value) =>
            onFilterChange("workspace", value)
          }
        />

        <FilterDropdown
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(value) =>
            onFilterChange("status", value)
          }
        />

        <FilterDropdown
          label="Lead"
          value={filters.lead}
          options={leadOptions}
          onChange={(value) =>
            onFilterChange("lead", value)
          }
        />

        <FilterDropdown
          label="Size"
          value={filters.size}
          options={sizeOptions}
          onChange={(value) =>
            onFilterChange("size", value)
          }
        />

      </div>

      {/* View Switcher */}
      <div className="flex items-center p-1 rounded-lg border border-slate-800 bg-[#10131A]">

        <button
          type="button"
          onClick={() => onViewChange("grid")}
          className={`p-2 rounded-md transition ${
            view === "grid"
              ? "bg-slate-700 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FiGrid size={16} />
        </button>

        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`p-2 rounded-md transition ${
            view === "list"
              ? "bg-slate-700 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FiList size={16} />
        </button>

      </div>

    </div>
  );
}