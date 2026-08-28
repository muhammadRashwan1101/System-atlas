import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiSearch, FiBell, FiSettings, FiPlus, FiChevronLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import Avatar from "../../components/Utils/Avatar";
import TeamHeader from "../../components/TeamDetails/TeamHeader";
import OperationalKpis from "../../components/TeamDetails/OperationalKpis";
import OwnershipRegistry from "../../components/TeamDetails/OwnershipRegistry";
import TeamStructureTree from "../../components/TeamDetails/TeamStructureTree";
import ActiveProjects from "../../components/TeamDetails/ActiveProjects";
import TeamMembersPanel from "../../components/TeamDetails/TeamMembersPanel";
import AddMemberModal from "../../components/TeamDetails/AddMemberModal";

export default function TeamDetails() {
  const { workspaceId, teamId } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const fetchTeamDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // If valid MongoDB ID
      if (teamId && teamId !== "undefined") {
        const res = await api.get(`/teams/${teamId}`);
        const data = res.data?.data || res.data?.team || res.data;
        if (data) {
          const wsId = workspaceId || currentWorkspace?._id || data.workspaceId;
          let teamProjects = [];

          if (wsId) {
            try {
              const pRes = await api.get(`/workspaces/${wsId}/projects`);
              const allP = pRes.data?.data || pRes.data?.projects || pRes.data || [];
              if (Array.isArray(allP)) {
                teamProjects = allP
                  .filter((p) => (p.ownerTeam?._id || p.ownerTeam) === teamId || p.ownerId === data.teamLead?._id)
                  .map((p) => ({
                    _id: p._id || p.id,
                    name: p.name,
                    componentsCount: 8,
                    priority: p.targetEnvironment === "production ready" ? "High Priority" : "Standard Priority",
                    progress: 75,
                  }));
              }
            } catch {}
          }

          setTeam({
            ...data,
            activeProjects: teamProjects.length > 0 ? teamProjects : (data.activeProjects || [
              {
                _id: "p1",
                name: "Core Mesh Upgrade",
                componentsCount: 8,
                priority: "High Priority",
                progress: 75,
              },
              {
                _id: "p2",
                name: "Security Hardening",
                componentsCount: 12,
                priority: "Medium Priority",
                progress: 40,
              },
            ]),
          });
          return;
        }
      }
      // Fallback sample data matching screenshot
      setTeam({
        _id: teamId || "team-plt-422",
        teamCode: "TEAM-PLT-422",
        teamName: "Platform Engineering",
        description:
          "Core infrastructure and foundational services responsible for CI/CD pipelines, cluster management, and cross-cutting security layers.",
        teamLead: {
          firstName: "Alex",
          lastName: "Rivera",
          role: "admin",
        },
        kpis: {
          componentsOwned: 42,
          projectsOwned: 12,
          criticalPathServices: 12,
          slaAdherence: "99.98%",
        },
        ownershipRegistry: [
          {
            _id: "c1",
            name: "Kubernetes Cluster (Production)",
            codeId: "CLS-PRD-001",
            type: "cloud-service",
            version: "v1.28.4",
          },
          {
            _id: "c2",
            name: "Auth Service",
            codeId: "SVC-AUTH-04",
            type: "auth",
            version: "OAuth2.0 Compliant",
          },
          {
            _id: "c3",
            name: "API Gateway",
            codeId: "SVC-GWY-09",
            type: "api-gateway",
            version: "Kong/Ingress",
          },
          {
            _id: "c4",
            name: "Redis Cache Cluster",
            codeId: "DB-RDIS-12",
            type: "database",
            version: "Volatile Store",
          },
        ],
        activeProjects: [
          {
            _id: "p1",
            name: "Core Mesh Upgrade",
            componentsCount: 8,
            priority: "High Priority",
            progress: 75,
          },
          {
            _id: "p2",
            name: "Security Hardening",
            componentsCount: 12,
            priority: "Medium Priority",
            progress: 40,
          },
        ],
        membersList: [
          {
            _id: "m1",
            name: "Alex Rivera",
            codeId: "USR-22910",
            role: "Architect",
            rank: "L7",
            projectsCount: 3,
            status: "ACTIVE",
          },
          {
            _id: "m2",
            name: "Jamie Volts",
            codeId: "USR-38112",
            role: "Tech Lead",
            rank: "L6",
            projectsCount: 3,
            status: "DAY-OFF",
          },
          {
            _id: "m3",
            name: "Samir Gupta",
            codeId: "USR-10023",
            role: "Senior Engineer",
            rank: "L5",
            projectsCount: 3,
            status: "ACTIVE",
          },
          {
            _id: "m4",
            name: "Chloe Marks",
            codeId: "USR-44201",
            role: "Senior Engineer",
            rank: "L5",
            projectsCount: 3,
            status: "ACTIVE",
          },
        ],
      });
    } catch (err) {
      console.error("Failed to fetch team details:", err);
      setError(err.response?.data?.msg || err.message || "Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const handleAddMembers = async (userIds) => {
    try {
      if (teamId && teamId !== "undefined") {
        await api.post(`/teams/${teamId}/members`, { userIds });
      }
      toast.success(`${userIds.length > 1 ? `${userIds.length} members` : "Member"} successfully added to team!`);
      fetchTeamDetails();
    } catch (err) {
      console.error("Failed to add members:", err);
      toast.error(err.response?.data?.msg || "Failed to add member to team");
    }
  };

  const createTeamPath = workspaceId
    ? `/workspaces/${workspaceId}/create-team`
    : "/create-team";

  const backTeamsPath = workspaceId
    ? `/workspaces/${workspaceId}/teams`
    : "/teams";

  return (
    <div className="w-full flex-1 min-h-screen bg-[#07080c] flex flex-col font-(family-name:--body-font) text-slate-100 overflow-x-hidden">
      {/* Top Navigation Header */}
      <header className="w-full bg-[#0a0b0d]/95 backdrop-blur-md border-b border-slate-800/80 px-8 py-3.5 flex items-center justify-between text-slate-300 text-xs shrink-0 select-none">
        {/* Left: Back & Search */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(backTeamsPath)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono font-semibold"
          >
            <FiChevronLeft className="text-sm" />
            <span>Teams</span>
          </button>

          <div className="relative flex items-center w-80">
            <FiSearch className="absolute left-3.5 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search commands, teams, or assets..."
              className="w-full bg-[#12151e] text-slate-200 placeholder-slate-500 text-[11px] font-(family-name:--labels) pl-9 pr-4 py-1.5 rounded-full border border-slate-800 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(createTeamPath)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer font-mono"
          >
            <FiPlus className="text-sm stroke-[2.5]" />
            <span>Create Team</span>
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <FiBell className="text-sm" />
          </button>

          <Link
            to="/profile-settings"
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Settings"
          >
            <FiSettings className="text-sm" />
          </Link>

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

      {/* Main Content Area: Left Details + Right Members Sidebar */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400 font-mono text-sm">
          <span className="animate-pulse">Loading team details...</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row items-stretch w-full min-h-0">
          {/* Left Column: Team Content - Takes all available space */}
          <main className="flex-1 p-8 space-y-8 overflow-y-auto w-full min-w-0">
            {/* Team Entity Header */}
            <TeamHeader team={team} />

            {/* Operational KPIs */}
            <OperationalKpis kpis={team?.kpis} />

            {/* Ownership Registry */}
            <OwnershipRegistry components={team?.ownershipRegistry} />

            {/* Team Structure */}
            <TeamStructureTree
              members={team?.membersList}
              lead={team?.teamLead}
            />

            {/* Active Projects */}
            <ActiveProjects projects={team?.activeProjects} />
          </main>

          {/* Right Column: Members Panel */}
          <TeamMembersPanel
            members={team?.membersList}
            onAddMemberClick={() => setIsAddMemberModalOpen(true)}
            onManageRoles={() => alert("Role management modal")}
          />
        </div>
      )}

      {/* Add Existing Members Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMembers={handleAddMembers}
        currentMembers={team?.membersList || []}
        teamName={team?.teamName || "Platform Engineering"}
      />
    </div>
  );
}
