import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";

import ProjectDashboardNavbar from "../../components/ProjectDashboard/ProjectDashboardNavbar";
import PageHeader from "../../components/ProjectDashboard/PageHeader";
import SearchBar from "../../components/ProjectDashboard/SearchBar";
import ProjectsGrid from "../../components/ProjectDashboard/ProjectsGrid";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

export default function ProjectDashboard() {
  const navigate = useNavigate();

  const { workspaceId } = useParams(); 

  const [search, setSearch] = useState("");
 
  const [filters, setFilters] = useState({
    status: "All",
    targetEnvironment: "All",
    manager: "Any",
    techLead: "Any",
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (signal) => {
  
    if (!workspaceId) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

    
      params.append("workspaceId", workspaceId);

      if (search.trim()) params.append("search", search.trim());
      if (filters.status && filters.status !== "All") params.append("status", filters.status);
      if (filters.targetEnvironment && filters.targetEnvironment !== "All") params.append("targetEnvironment", filters.targetEnvironment);
      if (filters.manager && filters.manager !== "Any") params.append("manager", filters.manager);
      if (filters.techLead && filters.techLead !== "Any") params.append("techLead", filters.techLead);

      const res = await axios.get(`${API_BASE_URL}/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      setProjects(res.data.projects || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please check connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [workspaceId, search, filters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);

    return () => controller.abort();
  }, [fetchProjects]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({ status: "All", targetEnvironment: "All", manager: "Any", techLead: "Any" });
  };

  return (
    <div className="w-full min-h-screen bg-[#07080c] flex flex-col">
      <ProjectDashboardNavbar onSearchChange={setSearch} searchValue={search} />

      <PageHeader
        title="Workspace Projects"
        subtitle={`WORKSPACE ID: ${workspaceId || "N/A"}`}
        onImport={() => alert("Importing...")}
        onExport={() => alert("Exporting...")}
        onGetReport={() => alert("Reporting...")}
      />

      <div className="p-6 text-slate-300 space-y-6 flex-1">
     
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <ProjectsGrid
          projects={projects}
          loading={loading}
          error={error}
          onResetFilters={handleResetFilters}
          onAddProject={() => navigate(`/workspaces/${workspaceId}/new-project`)} 
        />
      </div>
    </div>
  );
}