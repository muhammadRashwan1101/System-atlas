import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";

import ManagerDashboardHeader from "../../components/ManagerDashboard/ManagerDashboardHeader";
import ManagerKpiGrid from "../../components/ManagerDashboard/ManagerKpiGrid";
import ArchitectureHealthOverviewCard from "../../components/ManagerDashboard/ArchitectureHealthOverviewCard";
import ProjectCardGrid from "../../components/ManagerDashboard/ProjectCardGrid";
import QuickActionsCard from "../../components/ManagerDashboard/QuickActionsCard";
import TeamUtilizationCard from "../../components/ManagerDashboard/TeamUtilizationCard";
import DeterministicRisksCard from "../../components/ManagerDashboard/DeterministicRisksCard";
import OperationalActivityCard from "../../components/ManagerDashboard/OperationalActivityCard";
import GenerateReportModal from "../../components/Dashboard/GenerateReportModal";
import ImpactAnalysisModal from "../../components/ComponentDetails/ImpactAnalysisModal";

export default function ManagerDashboard({ onToggleRole }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces } = useWorkspace();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveData, setLiveData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [selectedProjectForImpact, setSelectedProjectForImpact] = useState(null);

  // Fetch real database aggregated metrics
  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const data = await dashboardService.getDashboardMetrics();
        if (isMounted && data) {
          setLiveData(data);
        }
      } catch (err) {
        console.error("Failed to load manager metrics:", err);
      }
    };

    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, [workspaces]);

  // Derive manager metrics
  const managerMetrics = useMemo(() => {
    const totalProjects = liveData?.kpiData?.projects || 12;
    const totalTeams = liveData?.kpiData?.teams || "08";
    const totalComps = liveData?.kpiData?.components || 412;
    const totalRels = liveData?.kpiData?.relationships || "1,842";

    return {
      activeProjects: totalProjects,
      teams: totalTeams,
      components: totalComps,
      relationships: totalRels,
      criticalComps: "07",
      openRisks: 24,
    };
  }, [liveData]);

  // Handlers
  const handleOpenProject = (proj) => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}`);
    } else {
      navigate("/new-workspace");
    }
  };

  const handleOpenExplorer = (proj) => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleRunImpact = (proj) => {
    setSelectedProjectForImpact(proj);
    setIsImpactModalOpen(true);
  };

  const handleCreateProject = () => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}/new-project`);
    } else {
      navigate("/new-workspace");
    }
  };

  const handleCreateTeam = () => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}/create-team`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleCreateComponent = () => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}`);
    } else {
      navigate("/new-workspace");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Navbar */}
      <ManagerDashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userRole={user?.role || "manager"}
        onToggleRole={onToggleRole}
      />

      {/* Main Content Area */}
      <main className="flex flex-col p-8 gap-6 w-full max-w-[1600px] mx-auto">
        {/* Top 6 KPI Metric Cards */}
        <ManagerKpiGrid metrics={managerMetrics} />

        {/* 2-Column Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Architecture Health Overview */}
            <ArchitectureHealthOverviewCard
              healthOverview={{
                ownershipCoverage: liveData?.healthData?.ownershipCoverage || 98.2,
              }}
            />

            {/* 2x2 Project Cards Grid */}
            <ProjectCardGrid
              onOpenProject={handleOpenProject}
              onOpenExplorer={handleOpenExplorer}
              onRunImpact={handleRunImpact}
            />
          </div>

          {/* Right Column (~35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Actions */}
            <QuickActionsCard
              onCreateProject={handleCreateProject}
              onCreateTeam={handleCreateTeam}
              onCreateComponent={handleCreateComponent}
              onOpenExplorer={handleOpenExplorer}
              onGenerateReport={() => setIsReportModalOpen(true)}
            />

            {/* Team Utilization */}
            <TeamUtilizationCard />

            {/* Deterministic Risks */}
            <DeterministicRisksCard />

            {/* Operational Activity */}
            <OperationalActivityCard />
          </div>
        </div>
      </main>

      {/* Modals */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <ImpactAnalysisModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        componentName={selectedProjectForImpact?.name || "Cloud Native Architecture"}
        dependenciesCount={4}
        consumersCount={12}
      />
    </div>
  );
}
