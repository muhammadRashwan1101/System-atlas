import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiUpload,
  FiDownload,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import useDebounce from "../../hooks/useDebounce";

import Breadcrumbs from "../../components/Navigation/Breadcrumbs";
import Avatar from "../../components/Utils/Avatar";
import TeamsFilterBar from "../../components/TeamsManagement/TeamsFilterBar";
import TeamCard from "../../components/TeamsManagement/TeamCard";
import AddTeamCard from "../../components/TeamsManagement/AddTeamCard";
import TeamsTableView from "../../components/TeamsManagement/TeamsTableView";

export default function TeamsManagement() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { workspaces, currentWorkspace } = useWorkspace();
  const { user } = useAuth();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [filters, setFilters] = useState({
    status: "",
    workspaceId: workspaceId || "",
    workspaceName: "",
    lead: "",
    leadName: "",
    size: "",
    sizeLabel: "",
  });

  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [teams, setTeams] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync workspaceId from URL
  useEffect(() => {
    if (workspaceId) {
      const match = workspaces.find((w) => w._id === workspaceId);
      setFilters((prev) => ({
        ...prev,
        workspaceId,
        workspaceName: match?.name || "Current Workspace",
      }));
    }
  }, [workspaceId, workspaces]);

  // Fetch Team Leads for the Lead filter
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/team-leads/search");
        const list = res.data?.data || res.data || [];
        setLeads(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load team leads:", err);
      }
    };
    fetchLeads();
  }, []);

  // Fetch Teams from DB
  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (filters.status && filters.status !== "All Statuses") {
        params.append("status", filters.status);
      }
      if (filters.workspaceId) params.append("workspaceId", filters.workspaceId);
      if (filters.lead) params.append("lead", filters.lead);
      if (filters.size) params.append("size", filters.size);

      const res = await api.get(`/teams?${params.toString()}`);
      const data = res.data?.data || res.data?.teams || res.data || [];

      if (Array.isArray(data) && data.length > 0) {
        setTeams(data);
      } else {
        // Fallback sample teams if DB is empty
        setTeams([
          {
            _id: "team-1",
            id: "team-1",
            teamCode: "CORE-01",
            teamName: "Core Platform",
            description: "Foundational cloud infrastructure and internal developer platform services.",
            status: "ACTIVE",
            teamLead: { firstName: "Alex", lastName: "Rivera", email: "alex.r@systematlas.io" },
            developersCount: 8,
            componentsCount: 14,
            projectsCount: 4,
            docCoverage: 92,
            updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          },
          {
            _id: "team-2",
            id: "team-2",
            teamCode: "DATA-04",
            teamName: "Data Pipelines",
            description: "Real-time streaming, ETL pipelines, and analytical data warehouses.",
            status: "REVIEW",
            teamLead: { firstName: "Jamie", lastName: "Volts", email: "jamie.v@systematlas.io" },
            developersCount: 5,
            componentsCount: 9,
            projectsCount: 2,
            docCoverage: 74,
            updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          },
          {
            _id: "team-3",
            id: "team-3",
            teamCode: "SEC-09",
            teamName: "Identity & SecOps",
            description: "Zero-trust architecture, auth protocols, and vulnerability monitoring.",
            status: "SUSPENDED",
            teamLead: { firstName: "Samir", lastName: "Gupta", email: "samir.g@systematlas.io" },
            developersCount: 4,
            componentsCount: 6,
            projectsCount: 1,
            docCoverage: 48,
            updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load teams:", err);
      setError("Failed to load teams from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [debouncedSearch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      status: "",
      workspaceId: workspaceId || "",
      workspaceName: workspaceId ? filters.workspaceName : "",
      lead: "",
      leadName: "",
      size: "",
      sizeLabel: "",
    });
  };

  const handleStatusChange = async (teamId, newStatus) => {
    try {
      await api.put(`/teams/${teamId}`, { status: newStatus });
      toast.success(`Team status updated to ${newStatus}`);
      setTeams((prev) =>
        prev.map((t) => (t._id === teamId || t.id === teamId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update team status:", err);
      toast.error(err.response?.data?.msg || "Failed to update team status");
    }
  };

  const activeWsId = workspaceId || currentWorkspace?._id || workspaces[0]?._id;
  const newTeamPath = activeWsId ? `/workspaces/${activeWsId}/create-team` : "/create-team";

  const handleTeamClick = (team) => {
    const tId = team._id || team.id;
    if (activeWsId) {
      navigate(`/workspaces/${activeWsId}/teams/${tId}`);
    } else {
      navigate(`/teams/${tId}`);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Header Bar (Matching ComponentsHeader) */}
      <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
        {/* Global Search */}
        <div className="relative flex items-center w-80">
          <FiSearch className="absolute left-3.5 text-[#8b949e] text-sm" />
          <input
            type="text"
            placeholder="Search teams... (⌘K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Main Content Area */}
      <main className="flex flex-col p-8 gap-6 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumb & Section Title (Matching ComponentsTitleSection) */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Breadcrumbs />
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white font-(family-name:--labels) text-xs">
                Teams
              </span>
            </div>
            <h1 className="font-(family-name:--headers) text-3xl font-bold text-white tracking-tight">
              Teams Management
            </h1>
            <p className="text-xs text-[#8b949e] max-w-2xl font-light leading-relaxed">
              Manage and audit sovereign engineering units across the workspace. Track ownership, active leads, and documentation telemetry in real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Importing teams configuration...")}
              className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FiUpload className="text-sm text-[#8b949e]" /> Import
            </button>
            <button
              type="button"
              onClick={() => alert("Exporting teams architecture...")}
              className="flex items-center gap-2 px-4 py-2 bg-[#121418] hover:bg-[#1a1e26] text-white border border-[#232730] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FiDownload className="text-sm text-[#8b949e]" /> Export
            </button>
          </div>
        </div>

        {/* Filter and Control Bar (Matching ComponentsFilterBar) */}
        <TeamsFilterBar
          filters={filters}
          workspaces={workspaces}
          leads={leads}
          viewMode={viewMode}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onViewModeChange={setViewMode}
        />

        {/* Content View: Grid vs Table */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-400 font-mono text-sm gap-4">
            <FiUsers className="text-4xl text-slate-600" />
            <p>No engineering teams found matching your criteria.</p>
            <div className="flex gap-3 font-(family-name:--labels)">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => navigate(newTeamPath)}
                className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-bold uppercase tracking-wider rounded-lg text-xs transition-colors cursor-pointer"
              >
                + New Team
              </button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <TeamsTableView
            teams={teams}
            onSelectTeam={handleTeamClick}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {teams.map((team) => (
              <TeamCard
                key={team._id || team.id}
                team={team}
                onStatusChange={handleStatusChange}
                onClick={() => handleTeamClick(team)}
              />
            ))}
            <AddTeamCard onAddTeam={() => navigate(newTeamPath)} />
          </div>
        )}
      </main>
    </div>
  );
}
