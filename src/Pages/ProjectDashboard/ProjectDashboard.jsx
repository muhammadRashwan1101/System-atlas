import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

import ProjectDashboardNavbar from "../../components/ProjectDashboard/ProjectDashboardNavbar";
import PageHeader from "../../components/ProjectDashboard/PageHeader";
import SearchBar from "../../components/ProjectDashboard/SearchBar";
import ProjectsGrid from "../../components/ProjectDashboard/ProjectsGrid";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

export default function ProjectDashboard() {
  const navigate = useNavigate(); 

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    workspaceId: "All",
    status: "All",
    targetEnvironment: "All",
    manager: "Any",
    techLead: "Any",
  });

  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data.workspaces || []);
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, []);

  const fetchProjects = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (filters.workspaceId && filters.workspaceId !== "All") params.append("workspaceId", filters.workspaceId);
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
  }, [search, filters]);

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
    setFilters({ workspaceId: "All", status: "All", targetEnvironment: "All", manager: "Any", techLead: "Any" });
  };

  return (
    <div className="w-full min-h-screen bg-[#07080c] flex flex-col">
      <ProjectDashboardNavbar onSearchChange={setSearch} searchValue={search} />

      <PageHeader
        title="Projects"
        subtitle="GLOBAL INSTANCE INDEX"
        onImport={() => alert("Importing...")}
        onExport={() => alert("Exporting...")}
        onGetReport={() => alert("Reporting...")}
      />

      <div className="p-6 text-slate-300 space-y-6 flex-1">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          workspaces={workspaces}
        />

        <ProjectsGrid
          projects={projects}
          loading={loading}
          error={error}
          onResetFilters={handleResetFilters}
          onAddProject={() => navigate("/new-project")} 
        />
      </div>
    </div>
  );
}