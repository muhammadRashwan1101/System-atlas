import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";

import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import DashboardTitleSection from "../../components/Dashboard/DashboardTitleSection";
import ExecutiveKpiGrid from "../../components/Dashboard/ExecutiveKpiGrid";
import OrganizationHealthCard from "../../components/Dashboard/OrganizationHealthCard";
import GovernanceFindingsCard from "../../components/Dashboard/GovernanceFindingsCard";
import TopWorkspacesSection from "../../components/Dashboard/TopWorkspacesSection";
import RecentActivityCard from "../../components/Dashboard/RecentActivityCard";
import TeamSnapshotsTable from "../../components/Dashboard/TeamSnapshotsTable";
import GenerateReportModal from "../../components/Dashboard/GenerateReportModal";
import ManagerDashboard from "../ManagerDashboard/ManagerDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces } = useWorkspace();

  // Role resolution: checks user role, defaults to manager if manager role assigned
  const [viewRole, setViewRole] = useState(null);
  const effectiveRole = viewRole || user?.role || user?.user?.role || "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);

  const handleToggleRole = () => {
    setViewRole((prev) => {
      const current = prev || user?.role || user?.user?.role || "admin";
      return current === "manager" ? "admin" : "manager";
    });
  };

  // If role is manager, render Manager Dashboard
  if (effectiveRole === "manager") {
    return <ManagerDashboard onToggleRole={handleToggleRole} />;
  }

  // Fetch true backend aggregated metrics
  useEffect(() => {
    let isMounted = true;
    const fetchLiveData = async () => {
      setLoading(true);
      try {
        const metrics = await dashboardService.getDashboardMetrics();
        if (isMounted && metrics) {
          setLiveData(metrics);
        }
      } catch (err) {
        console.error("Failed to load live dashboard metrics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, [workspaces]);

  const kpiData = useMemo(() => {
    if (liveData?.kpiData) {
      return liveData.kpiData;
    }
    const wsCount = workspaces && workspaces.length > 0 ? workspaces.length : 24;
    return {
      workspaces: wsCount,
      workspacesDelta: "+2",
      projects: 148,
      teams: 42,
      users: "1,204",
      usersDelta: "+14%",
      components: "3,890",
      relationships: "12K+",
      docCoverage: "84%",
      govScore: 92,
    };
  }, [liveData, workspaces]);

  const handleExploreArchitecture = () => {
    if (workspaces && workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}`);
    } else {
      navigate("/new-workspace");
    }
  };

  const handleSelectWorkspace = (ws) => {
    const matched = workspaces.find(
      (w) => w.name?.toLowerCase() === ws.name?.toLowerCase() || w._id === ws.id
    );

    if (matched) {
      navigate(`/workspaces/${matched._id}`);
    } else if (workspaces.length > 0) {
      navigate(`/workspaces/${workspaces[0]._id}`);
    } else {
      navigate("/new-workspace");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Navigation Header */}
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWorkspace={() => navigate("/new-workspace")}
        onExploreArchitecture={handleExploreArchitecture}
        onGenerateReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex flex-col p-8 gap-7 w-full max-w-[1600px] mx-auto">
        {/* Title & Status Badges */}
        <DashboardTitleSection />

        {/* 8 Executive KPI Cards */}
        <ExecutiveKpiGrid kpiData={kpiData} />

        {/* Middle Row: Organization Health & Governance Findings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <OrganizationHealthCard healthData={liveData?.healthData} />
          </div>
          <div className="lg:col-span-5">
            <GovernanceFindingsCard findings={liveData?.governanceFindings} />
          </div>
        </div>

        {/* Top Workspaces Section */}
        <TopWorkspacesSection
          workspaces={liveData?.topWorkspaces}
          onSelectWorkspace={handleSelectWorkspace}
          onAddWorkspace={() => navigate("/new-workspace")}
        />

        {/* Bottom Row: Recent Activity & Team Snapshots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5">
            <RecentActivityCard activities={liveData?.recentActivity} />
          </div>
          <div className="lg:col-span-7">
            <TeamSnapshotsTable teams={liveData?.teamSnapshots} />
          </div>
        </div>
      </main>

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
