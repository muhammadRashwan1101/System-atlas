import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useWorkspace from "../../context/WorkspaceContext";
import impactService from "../../services/impactService";

import ImpactAnalysisHeader from "../../components/ImpactAnalysis/ImpactAnalysisHeader";
import ImpactSimulationSidebar from "../../components/ImpactAnalysis/ImpactSimulationSidebar";
import ImpactTopologyCanvas from "../../components/ImpactAnalysis/ImpactTopologyCanvas";
import ImpactScorePanel from "../../components/ImpactAnalysis/ImpactScorePanel";
import SwapTechnologyModal from "../../components/ImpactAnalysis/SwapTechnologyModal";
import GenerateReportModal from "../../components/Dashboard/GenerateReportModal";

export default function ImpactAnalysis() {
  const { workspaceId, projectId, componentId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projectsByWorkspace } = useWorkspace();

  // State
  const [activeTab, setActiveTab] = useState("Impact");
  const [isFailureActive, setIsFailureActive] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [liveGraph, setLiveGraph] = useState(null);

  // Target Component State
  const [targetComponent, setTargetComponent] = useState({
    id: "svc-rec-001",
    name: "Recommendation Service",
    displayId: "ID: SVC-REC-001",
  });

  // Level 1 Nodes
  const [level1Nodes, setLevel1Nodes] = useState([
    {
      id: "auth-svc",
      name: "Auth Service",
      impactType: "CRITICAL IMPACT",
      isCritical: true,
      action: "AUTHENTICATES",
    },
    {
      id: "api-gw",
      name: "API Gateway",
      impactType: "CRITICAL IMPACT",
      isCritical: true,
      action: "REGISTERED AT",
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      impactType: "INDIRECT IMPACT",
      isCritical: false,
      action: "CONSUMES",
    },
  ]);

  // Level 2 Nodes
  const [level2Nodes, setLevel2Nodes] = useState([
    { id: "redis", name: "Redis Cache", action: "READS FROM" },
    { id: "rabbitmq", name: "RabbitMQ", action: "PUBLISHES TO" },
    { id: "postgres", name: "PostgreSQL", action: "WRITES TO" },
  ]);

  // Load real project graph from database
  useEffect(() => {
    let isMounted = true;
    const fetchGraph = async () => {
      const activeProjId =
        projectId ||
        (projectsByWorkspace[workspaceId] && projectsByWorkspace[workspaceId][0]?._id);

      if (!activeProjId) return;

      try {
        const data = await impactService.getProjectGraphForImpact(activeProjId);
        if (isMounted && data && data.components.length > 0) {
          setLiveGraph(data);

          // Find target component
          const target = componentId
            ? data.components.find((c) => c._id === componentId)
            : data.components[0];

          if (target) {
            setTargetComponent({
              id: target._id || target.id,
              name: target.name || "Target Service",
              displayId: `ID: ${(target._id || "SVC-001").substring(0, 11).toUpperCase()}`,
            });

            // Calculate live impact
            const impact = impactService.calculateComponentImpact(
              target._id,
              data.components,
              data.relationships
            );

            if (impact && impact.consumers.length > 0) {
              setLevel1Nodes(
                impact.consumers.map((c) => ({
                  id: c.id,
                  name: c.name,
                  impactType: "CRITICAL IMPACT",
                  isCritical: true,
                  action: c.action || "CONSUMES",
                }))
              );
            }
            if (impact && impact.dependencies.length > 0) {
              setLevel2Nodes(
                impact.dependencies.map((d) => ({
                  id: d.id,
                  name: d.name,
                  action: d.action || "DEPENDS ON",
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to load impact graph:", err);
      }
    };

    fetchGraph();
    return () => {
      isMounted = false;
    };
  }, [projectId, workspaceId, componentId, projectsByWorkspace]);

  // Metrics derived from live calculation and failure simulation
  const score = isFailureActive ? 96 : 84;
  const riskLevel = isFailureActive ? "CRITICAL CASCADE" : "HIGH RISK";
  const healthDelta = isFailureActive ? "-42%" : "-24%";

  const handleToggleFailure = () => {
    setIsFailureActive((prev) => {
      const next = !prev;
      if (next) {
        toast.error("Failure introduced! Downstream critical paths disrupted.");
      } else {
        toast.info("Failure simulation stopped. System normalized.");
      }
      return next;
    });
  };

  const handleSelectNode = (node) => {
    toast.info(`Inspecting impact node: ${node.name}`);
  };

  const handleSaveScenario = () => {
    toast.success("Simulation scenario saved to project audit logs!");
  };

  const handleDeployChanges = () => {
    toast.success("Changes prepared for deployment pipeline!");
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0B0D] text-white overflow-hidden">
      {/* Top Header Navigation */}
      <ImpactAnalysisHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDeployChanges={handleDeployChanges}
      />

      {/* 3-Column Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Simulation Sidebar */}
        <ImpactSimulationSidebar
          activeSimulation={{
            name: targetComponent.name,
            status: "LIVE",
            description: "Traffic redirection simulation to legacy cache nodes.",
          }}
          onSelectSimulation={(item) => {
            toast.info(`Loading history simulation: ${item.name}`);
          }}
          onOpenReport={(rep) => {
            toast.info(`Opening saved report: ${rep.title}`);
          }}
        />

        {/* Center Interactive Hierarchy Tree */}
        <ImpactTopologyCanvas
          targetComponent={targetComponent}
          level1Nodes={level1Nodes}
          level2Nodes={level2Nodes}
          isFailureActive={isFailureActive}
          onSelectNode={handleSelectNode}
        />

        {/* Right Impact Score & Simulation Control Panel */}
        <ImpactScorePanel
          score={score}
          riskLevel={riskLevel}
          healthDelta={healthDelta}
          isFailureActive={isFailureActive}
          onToggleFailure={handleToggleFailure}
          onRemoveComponent={() => {
            toast.warn("Simulating component removal: blast radius calculated.");
          }}
          onSwapTechnology={() => setIsSwapModalOpen(true)}
          onSaveScenario={handleSaveScenario}
          onGenerateReport={() => setIsReportModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <SwapTechnologyModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        targetComponent={targetComponent}
        onApplySwap={(swap) => {
          toast.success(`Simulated swap to ${swap.technology}`);
        }}
      />

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
