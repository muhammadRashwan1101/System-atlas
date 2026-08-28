import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import api from "../../api/axios";
import useAuth from "../../context/AuthContext";
import useWorkspace from "../../context/WorkspaceContext";

import ProjectDashboardNavbar from "../../components/ProjectDashboard/ProjectDashboardNavbar";
import ProjectsFilterBar from "../../components/ProjectDashboard/ProjectsFilterBar";
import ProjectsGrid from "../../components/ProjectDashboard/ProjectsGrid";
import ProjectsTableView from "../../components/ProjectDashboard/ProjectsTableView";
import Breadcrumbs from "../../components/Navigation/Breadcrumbs";

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const { workspaces } = useWorkspace();

  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w._id === workspaceId) || null;
  }, [workspaces, workspaceId]);

  const userRole = String(user?.role || user?.user?.role || "user").toLowerCase();
  const canCreateProject = ["admin", "manager", "techlead"].includes(userRole);

  const [search, setSearch] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const [filters, setFilters] = useState({
    status: "All",
    targetEnvironment: "All",
    manager: "Any",
    techLead: "Any",
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (filters.status && filters.status !== "All") params.append("status", filters.status);
      if (filters.targetEnvironment && filters.targetEnvironment !== "All") {
        params.append("targetEnvironment", filters.targetEnvironment);
      }
      if (filters.manager && filters.manager !== "Any") params.append("manager", filters.manager);
      if (filters.techLead && filters.techLead !== "Any") params.append("techLead", filters.techLead);

      const url = `/workspaces/${workspaceId}/projects?${params.toString()}`;

      const res = await api
        .get(url)
        .catch(() => api.get(`/projects?workspaceId=${workspaceId}&${params.toString()}`));

      const rawProjects = res.data?.data?.projects || res.data?.projects || res.data || [];

      const formattedProjects = rawProjects.map((p, idx) => ({
        ...p,
        id: p._id || p.id || `proj-${idx}`,
        code: p.code || `PROD-0${idx + 1}`,
        status: (p.status || "ACTIVE").toUpperCase(),
        healthScore:
          p.healthScore ??
          (p.status === "CRITICAL" ? 84.2 : p.status === "SUSPENDED" ? 94.1 : 99.8),
        documentationProgress: p.documentationProgress ?? (idx % 2 === 0 ? 92 : 88),
        ownershipProgress: p.ownershipProgress ?? (p.status === "CRITICAL" ? 86 : 100),
        nodesCount: p.nodesCount ?? (idx % 2 === 0 ? 124 : 56),
        managerName:
          p.manager?.name || p.managerName || (typeof p.manager === "string" ? p.manager : "Sarah K."),
        techLead:
          p.techLead?.name || p.techLead || (typeof p.techLead === "string" ? p.techLead : "Alex M."),
        targetEnvironment: p.targetEnvironment || p.env || "Production",
      }));

      setProjects(formattedProjects);

      if (res.data?.data?.workspace?.name || res.data?.workspace?.name) {
        setWorkspaceName(res.data.data?.workspace?.name || res.data.workspace.name);
      }
    } catch (err) {
      console.error("Error fetching workspace projects:", err);
      setError("Failed to fetch projects. Please check connection.");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, search, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({ status: "All", targetEnvironment: "All", manager: "Any", techLead: "Any" });
  };

  const handleProjectClick = (project) => {
    const targetId = project?._id || project?.id;
    if (!targetId) {
      console.error("Project ID is missing", project);
      return;
    }
    navigate(`/workspaces/${workspaceId}/projects/${targetId}`, {
      state: { project },
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Header Bar (Matching ComponentsHeader) */}
      <ProjectDashboardNavbar onSearchChange={setSearch} searchValue={search} />

      {/* Main Content Area */}
      <main className="flex flex-col p-8 gap-6 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumb & Section Title (Matching ComponentsTitleSection) */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Breadcrumbs workspaceName={workspaceName || activeWorkspace?.name} />
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white font-(family-name:--labels) text-xs">
                Projects
              </span>
            </div>
            <h1 className="font-(family-name:--headers) text-3xl font-bold text-white tracking-tight">
              {workspaceName ? `${workspaceName} Projects` : "Projects Management"}
            </h1>
            <p className="text-xs text-[#8b949e] max-w-2xl font-light leading-relaxed">
              Browse and manage all engineering projects within this workspace. Track health metrics, target environments, and architecture topology in real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Importing projects configuration...")}
              className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FiUpload className="text-sm text-[#8b949e]" /> Import
            </button>
            <button
              type="button"
              onClick={() => alert("Exporting projects architecture...")}
              className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FiDownload className="text-sm text-[#8b949e]" /> Export
            </button>
          </div>
        </div>

        {/* Filter and Control Bar (Matching ComponentsFilterBar) */}
        <ProjectsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* View Content: Grid vs List */}
        {viewMode === "list" ? (
          <ProjectsTableView
            projects={projects}
            onSelectProject={handleProjectClick}
          />
        ) : (
          <ProjectsGrid
            projects={projects}
            loading={loading}
            error={error}
            onResetFilters={handleResetFilters}
            onAddProject={canCreateProject ? () => navigate(`/workspaces/${workspaceId}/new-project`) : undefined}
            onProjectClick={handleProjectClick}
          />
        )}
      </main>
    </div>
  );
}