import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TeamsHeader from "../../components/TeamManagmentDashboard/TeamsHeader";
import TeamsFilters from "../../components/TeamManagmentDashboard/TeamsFilters";
import TeamGrid from "../../components/TeamManagmentDashboard/TeamGrid";

import api from "../../api/axios";

export default function TeamsManagement() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  // =====================================================
  // Workspace
  // =====================================================

  const workspaceBase = workspaceId
    ? `/workspaces/${workspaceId}`
    : "";

  // =====================================================
  // State
  // =====================================================

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // Filters
  // =====================================================

  const [filters, setFilters] = useState({
    workspace: "all",
    status: "all",
    lead: "all",
    size: "all",
  });

  // =====================================================
  // View
  // =====================================================

  const [view, setView] = useState("grid");

  // =====================================================
  // Filter Change
  // =====================================================

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // =====================================================
  // Create Team
  // =====================================================

  const handleCreateTeam = useCallback(() => {
    if (!workspaceId) {
      setError("No workspace selected.");
      return;
    }

    navigate(`${workspaceBase}/create-team`);
  }, [workspaceId, workspaceBase, navigate]);

  // =====================================================
  // Select Team
  // =====================================================

  const handleSelectTeam = useCallback(
    (team) => {
      if (!team?._id) {
        console.error("Invalid team:", team);
        return;
      }

      if (!workspaceId) {
        console.error("No workspace ID found.");
        return;
      }

      navigate(`${workspaceBase}/teams/${team._id}`);
    },
    [workspaceId, workspaceBase, navigate]
  );

  // =====================================================
  // Fetch Teams
  // =====================================================

  const fetchTeams = useCallback(async () => {
    if (!workspaceId) {
      setTeams([]);
      setError("No workspace selected.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * Backend should support:
       *
       * GET /teams/workspace/:workspaceId
       *
       * If your backend currently uses:
       * GET /teams?workspaceId=...
       *
       * change the URL accordingly.
       */

      const response = await api.get(
        `/teams/workspace/${workspaceId}`
      );

      const data =
        response.data?.data ||
        response.data?.teams ||
        [];

      setTeams(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Failed to fetch teams:", err);

      const status = err.response?.status;

      if (status === 404) {
        setError(
          "Teams endpoint for this workspace was not found. Check the backend route."
        );
      } else if (status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (status === 403) {
        setError(
          "You do not have permission to view teams in this workspace."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            "Failed to load teams."
        );
      }

      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  // =====================================================
  // Initial Fetch
  // =====================================================

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // =====================================================
  // Filter Teams
  // =====================================================

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // =================================================
      // Status
      // =================================================

      if (
        filters.status !== "all" &&
        team.status?.toLowerCase() !==
          filters.status.toLowerCase()
      ) {
        return false;
      }

      // =================================================
      // Category
      // =================================================

      if (
        filters.workspace !== "all" &&
        team.category?.toLowerCase() !==
          filters.workspace.toLowerCase()
      ) {
        return false;
      }

      // =================================================
      // Team Lead
      // =================================================

      if (filters.lead !== "all") {
        const leadId =
          team.teamLead?._id ||
          team.teamLead?.id ||
          team.teamLead;

        if (String(leadId) !== String(filters.lead)) {
          return false;
        }
      }

      // =================================================
      // Team Size
      // =================================================

      const memberCount = Array.isArray(team.members)
        ? team.members.length
        : 0;

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
        (memberCount <= 5 || memberCount > 15)
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

  // =====================================================
  // No Workspace
  // =====================================================

  if (!workspaceId) {
    return (
      <main className="w-full min-h-screen px-8 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">

          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            No Workspace Selected
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Please select a workspace before managing teams.
          </p>

          <button
            type="button"
            onClick={() => navigate("/app")}
            className="px-5 py-2.5 rounded-lg bg-(--primary) text-(--text-primary) hover:opacity-90 transition"
          >
            Go to Workspace
          </button>

        </div>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="w-full min-h-screen px-8 py-6">

      {/* =================================================
          Header
      ================================================= */}

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

      {/* =================================================
          Filters
      ================================================= */}

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

      {/* =================================================
          Teams
      ================================================= */}

      <section className="w-full mt-6 pb-8">

        {/* =================================================
            Loading
        ================================================= */}

        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400">

            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />

            <span className="text-sm">
              Loading engineering teams...
            </span>

          </div>
        )}

        {/* =================================================
            Error
        ================================================= */}

        {!loading && error && (
          <div className="text-center py-16 bg-[#10131A]/50 border border-rose-900/30 rounded-2xl">

            <div className="text-4xl mb-4">
              ⚠️
            </div>

            <p className="text-rose-400 font-medium mb-4">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchTeams}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg transition"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            Empty State
        ================================================= */}

        {!loading &&
          !error &&
          filteredTeams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-[#10131A]/50 border border-slate-800/80 rounded-2xl text-center">

              <div className="text-5xl mb-5">
                👥
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                No Teams Found
              </h3>

              <p className="text-sm text-slate-400 max-w-md mb-6">
                This workspace does not have any teams yet.
                Create your first engineering team to get started.
              </p>

              <button
                type="button"
                onClick={handleCreateTeam}
                className="px-5 py-2.5 rounded-lg bg-(--primary) text-(--text-primary) font-medium hover:opacity-90 transition"
              >
                Create Team
              </button>

            </div>
          )}

        {/* =================================================
            Teams Grid
        ================================================= */}

        {!loading &&
          !error &&
          filteredTeams.length > 0 && (
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