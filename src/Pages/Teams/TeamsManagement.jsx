import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import TeamsHeader from "../../components/TeamManagmentDashboard/TeamsHeader";
import TeamsFilters from "../../components/TeamManagmentDashboard/TeamsFilters";
import TeamGrid from "../../components/TeamManagmentDashboard/TeamGrid";

import api from "../../api/axios";

export default function TeamsManagement() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    workspace: "all",
    status: "all",
    lead: "all",
    size: "all",
  });

  const [view, setView] = useState("grid");

  // ===============================
  // Filter Change
  // ===============================

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ===============================
  // Navigation
  // ===============================

  const handleCreateTeam = () => {
    navigate("/create-team");
  };

  const handleSelectTeam = (team) => {
    if (!team?._id) return;

    navigate(`/teams/${team._id}`);
  };

  // ===============================
  // Fetch Teams
  // ===============================

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teams");

      const data = response.data?.data || [];

      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Failed to load teams"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ===============================
  // Filter Teams
  // ===============================

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // ---------------------------
      // Status
      // ---------------------------

      if (
        filters.status !== "all" &&
        team.status?.toLowerCase() !==
          filters.status.toLowerCase()
      ) {
        return false;
      }

      // ---------------------------
      // Workspace / Category
      // ---------------------------

      if (
        filters.workspace !== "all" &&
        team.category?.toLowerCase() !==
          filters.workspace.toLowerCase()
      ) {
        return false;
      }

      // ---------------------------
      // Lead
      // ---------------------------

      if (filters.lead !== "all") {
        const leadId =
          team.teamLead?._id ||
          team.teamLead?.id;

        if (leadId !== filters.lead) {
          return false;
        }
      }

      // ---------------------------
      // Team Size
      // ---------------------------

      const memberCount =
        team.members?.length || 0;

      // Small: 0 - 5
      if (
        filters.size === "small" &&
        memberCount > 5
      ) {
        return false;
      }

      // Medium: 6 - 15
      if (
        filters.size === "medium" &&
        (memberCount <= 5 ||
          memberCount > 15)
      ) {
        return false;
      }

      // Large: 16+
      if (
        filters.size === "large" &&
        memberCount <= 15
      ) {
        return false;
      }

      return true;
    });
  }, [teams, filters]);

  // ===============================
  // UI
  // ===============================

  return (
    <main className="w-full min-h-screen px-8 py-6">

      {/* ================= Header ================= */}

      <TeamsHeader
        title="Teams Management"
        subtitle="Manage and audit cross-functional engineering units across the workspace."
        onImport={() =>
          console.log("Import clicked")
        }
        onExport={() =>
          console.log("Export clicked")
        }
        onCreateTeam={handleCreateTeam}
        buttonText="New Team"
      />

      {/* ================= Filters ================= */}

      <div className="w-full mt-6">
        <div className="w-full bg-[#10131A]/80 border border-slate-800/80 rounded-2xl px-6 py-4">

          <TeamsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            view={view}
            onViewChange={setView}
          />

        </div>
      </div>

      {/* ================= Teams ================= */}

      <section className="w-full mt-6 pb-8">

        {/* ================= Loading ================= */}

        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400">

            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />

            <span className="text-sm">
              Loading engineering teams...
            </span>

          </div>
        )}

        {/* ================= Error ================= */}

        {!loading && error && (
          <div className="text-center py-16 bg-[#10131A]/50 border border-rose-900/30 rounded-2xl">

            <p className="text-rose-400 font-medium mb-4">
              {error}
            </p>

            <button
              onClick={fetchTeams}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg transition"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ================= Teams ================= */}

        {!loading && !error && (
          <TeamGrid
            teams={filteredTeams}
            view={view}
            onSelectTeam={handleSelectTeam}
            onAddTeam={handleCreateTeam}
          />
        )}

      </section>

    </main>
  );
}