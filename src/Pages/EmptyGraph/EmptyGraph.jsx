import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { FiEdit3, FiEye, FiX, FiShare2 } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GraphSection from "../../components/EmptyGraph/GraphSection";
import SidePanel from "../../components/EmptyGraph/SidePanel";
import graphService from "../../services/graphService";
import {
  mapProjectToGraphElements,
  calculateGraphMetrics,
} from "../../utils/graphMapper";
import GraphCanvas from "../../components/GraphExplorer/GraphCanvas";
import GraphToolbar from "../../components/GraphExplorer/GraphToolbar";
import GraphInspectorPanel from "../../components/GraphExplorer/GraphInspectorPanel";
import RelationshipModal from "../../components/GraphExplorer/RelationshipModal";
import DeleteRelationshipModal from "../../components/GraphExplorer/DeleteRelationshipModal";

export default function EmptyGraph() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const cyInstanceRef = useRef(null);

  // Mode: "explore" | "edit"
  const [activeMode, setActiveMode] = useState("explore");
  const isEditMode = activeMode === "edit";

  // Graph data & UI state
  const [components, setComponents] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection state
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // 2-Node Connection State (Edit Mode)
  const [sourceNodeForConnection, setSourceNodeForConnection] = useState(null);
  const [targetNodeForConnection, setTargetNodeForConnection] = useState(null);

  // Modal States
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [relModalMode, setRelModalMode] = useState("create"); // "create" | "edit"
  const [editingEdgeData, setEditingEdgeData] = useState(null);
  const [isSubmittingRel, setIsSubmittingRel] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [edgeToDelete, setEdgeToDelete] = useState(null);
  const [isDeletingRel, setIsDeletingRel] = useState(false);

  // Toolbar & Filter & Layout states
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutName, setLayoutName] = useState("breadthfirst");

  // Fetch project graph data (components & relationships in parallel) from backend
  const loadGraphData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      const { components: comps, relationships: rels } =
        await graphService.getProjectGraph(projectId);
      setComponents(comps);
      setRelationships(rels);
      setError(null);
    } catch (err) {
      console.error("Failed to load project graph data:", err);
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to load architecture graph. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let isMounted = true;

    const fetchGraphData = async () => {
      if (!projectId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { components: comps, relationships: rels } =
          await graphService.getProjectGraph(projectId);
        if (isMounted) {
          setComponents(comps);
          setRelationships(rels);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.msg ||
              err.response?.data?.message ||
              "Failed to load architecture graph. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGraphData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Transform backend components & relationships into Cytoscape elements
  const elements = useMemo(() => {
    return mapProjectToGraphElements(components, relationships);
  }, [components, relationships]);

  // Calculate metrics for inspector summary
  const metrics = useMemo(() => {
    return calculateGraphMetrics(elements);
  }, [elements]);

  // Cytoscape Instance Handlers
  const handleCyReady = useCallback((cy) => {
    cyInstanceRef.current = cy;
  }, []);

  const handleZoomIn = () => {
    const cy = cyInstanceRef.current;
    if (cy) {
      cy.zoom({
        level: cy.zoom() * 1.25,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    }
  };

  const handleZoomOut = () => {
    const cy = cyInstanceRef.current;
    if (cy) {
      cy.zoom({
        level: cy.zoom() * 0.8,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    }
  };

  const handleFit = () => {
    const cy = cyInstanceRef.current;
    if (cy) {
      cy.fit(undefined, 80);
    }
  };

  const handleResetLayout = () => {
    const cy = cyInstanceRef.current;
    if (cy) {
      const layout = cy.layout({
        name: "breadthfirst",
        directed: true,
        padding: 80,
        spacingFactor: 1.6,
        animate: true,
        animationDuration: 500,
      });
      layout.run();
      cy.fit(undefined, 80);
    }
  };

  const handleCenterNode = (nodeId) => {
    const cy = cyInstanceRef.current;
    if (cy && nodeId) {
      const node = cy.getElementById(nodeId);
      if (node && node.length > 0) {
        cy.animate({
          center: { eles: node },
          zoom: 1.4,
          duration: 400,
        });
      }
    }
  };

  const handleFocusEdge = (edgeObj) => {
    const cy = cyInstanceRef.current;
    if (cy && edgeObj?.data) {
      const sourceNode = cy.getElementById(edgeObj.data.source);
      const targetNode = cy.getElementById(edgeObj.data.target);
      const edge = cy.getElementById(edgeObj.data.id);
      const collection = sourceNode.union(targetNode).union(edge);
      cy.animate({
        fit: { eles: collection, padding: 80 },
        duration: 400,
      });
    }
  };

  // Node & Edge selection handlers
  const handleSelectNode = (nodeObj) => {
    setSelectedEdge(null);
    setSelectedNode(nodeObj);
  };

  const handleSelectEdge = (edgeObj) => {
    setSelectedNode(null);
    setSelectedEdge(edgeObj);
  };

  const handleDeselect = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Toggle Mode Handler
  const handleToggleMode = (mode) => {
    setActiveMode(mode);
    // Clear temporary editing selections when switching modes
    setSourceNodeForConnection(null);
    setTargetNodeForConnection(null);
    setSelectedNode(null);
    setSelectedEdge(null);
    setIsRelModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // 2-Node Connection Handlers (Edit Mode)
  const handleSelectSourceForConnection = (sourceNodeData) => {
    setSourceNodeForConnection(sourceNodeData);
    toast.info(
      `Source selected: ${sourceNodeData.name || sourceNodeData.label}. Now select target component.`,
      { autoClose: 2500 }
    );
  };

  const handleCompleteConnection = (targetNodeData) => {
    if (!sourceNodeForConnection) return;

    if (sourceNodeForConnection.id === targetNodeData.id) {
      toast.warning("Cannot create a relationship from a component to itself.");
      return;
    }

    setTargetNodeForConnection(targetNodeData);
    setRelModalMode("create");
    setEditingEdgeData(null);
    setIsRelModalOpen(true);
  };

  const handleCancelConnection = () => {
    setSourceNodeForConnection(null);
    setTargetNodeForConnection(null);
  };

  // Relationship Mutations
  const handleSaveRelationship = async ({ type, protocol }) => {
    if (isSubmittingRel) return;
    setIsSubmittingRel(true);

    try {
      if (relModalMode === "create") {
        if (!sourceNodeForConnection || !targetNodeForConnection) return;

        const res = await graphService.addRelationship(projectId, {
          sourceId: sourceNodeForConnection.id,
          targetId: targetNodeForConnection.id,
          type,
          protocol,
        });

        toast.success(res.msg || "Relationship created successfully");
      } else {
        // Edit mode
        if (!editingEdgeData) return;
        const relId = editingEdgeData.relationshipId || editingEdgeData.id;

        const res = await graphService.updateRelationship(projectId, relId, {
          type,
          protocol,
        });

        toast.success(res.msg || "Relationship updated successfully");
      }

      setIsRelModalOpen(false);
      setSourceNodeForConnection(null);
      setTargetNodeForConnection(null);
      setEditingEdgeData(null);

      // Refresh graph elements from backend
      await loadGraphData();
    } catch (err) {
      console.error("Relationship save error:", err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Failed to save relationship. Please try again.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsSubmittingRel(false);
    }
  };

  // Open Edit Relationship Modal from Side Inspector
  const handleOpenEditRelationshipModal = (edgeObj) => {
    if (!edgeObj?.data) return;
    const edgeData = edgeObj.data;
    setEditingEdgeData(edgeData);
    setRelModalMode("edit");
    setIsRelModalOpen(true);
  };

  // Open Delete Relationship Modal from Side Inspector
  const handleOpenDeleteRelationshipModal = (edgeObj) => {
    if (!edgeObj?.data) return;
    setEdgeToDelete(edgeObj.data);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete Relationship
  const handleConfirmDeleteRelationship = async () => {
    if (!edgeToDelete || isDeletingRel) return;
    setIsDeletingRel(true);

    try {
      const relId = edgeToDelete.relationshipId || edgeToDelete.id;
      const res = await graphService.removeRelationship(projectId, relId);

      toast.success(res.msg || "Relationship removed successfully");
      setIsDeleteModalOpen(false);
      setEdgeToDelete(null);
      setSelectedEdge(null);

      // Refresh graph elements from backend
      await loadGraphData();
    } catch (err) {
      console.error("Delete relationship error:", err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Failed to remove relationship. Please try again.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsDeletingRel(false);
    }
  };

  // Navigation CTAs preserving workspaceId / projectId
  const handleNavigateToWizard = (componentId) => {
    if (workspaceId && projectId) {
      if (componentId) {
        navigate(
          `/workspaces/${workspaceId}/projects/${projectId}/wizard/${componentId}`
        );
      } else {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/wizard`);
      }
    } else {
      navigate("/dashboard");
    }
  };

  const handleNavigateToComponents = () => {
    if (workspaceId && projectId) {
      navigate(
        `/workspaces/${workspaceId}/projects/${projectId}/components`
      );
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#08090C] text-[#C4C6D0] overflow-hidden select-none font-sans">
      {/* Top Bar matching Figma screen */}
      <header className="relative z-30 flex items-center justify-between w-full px-6 py-3 border-b border-[#1E2025] bg-[#0A0B0E]/80 backdrop-blur-md pointer-events-none">
        {/* Left Area placeholder */}
        <div className="pointer-events-auto" />

        {/* Center Controls: [ Explore | Edit ] Switcher + Search Bar */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Explore / Edit Toggle Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#101217] border border-[#222634] shadow-inner">
            <button
              type="button"
              onClick={() => handleToggleMode("explore")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeMode === "explore"
                  ? "bg-[#1E2025] text-white font-semibold shadow-sm"
                  : "text-[#8E9099] hover:text-white"
              }`}
            >
              <FiEye className="text-xs" /> Explore
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode("edit")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeMode === "edit"
                  ? "bg-[#D8E2FF] text-[#0A0B0D] font-semibold shadow-sm"
                  : "text-[#8E9099] hover:text-white"
              }`}
            >
              <FiEdit3 className="text-xs" /> Edit Mode
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <RxMagnifyingGlass className="absolute left-3.5 text-[#6B7280] text-sm" />
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find service or resource..."
              className="bg-[#101217] border border-[#222634] ps-10 pe-10 py-2 rounded-xl text-xs focus:outline-none focus:border-sky-400 font-sans w-72 text-white placeholder:text-[#6B7280] shadow-lg transition-colors"
            />
            <span className="absolute right-3 px-1.5 py-0.5 rounded bg-[#1A1E29] border border-[#2B3240] text-[10px] font-mono text-[#6B7280]">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Area: Done Button when in Edit Mode */}
        <div className="pointer-events-auto">
          {isEditMode && (
            <button
              type="button"
              onClick={() => handleToggleMode("explore")}
              className="px-4 py-1.5 rounded-xl bg-(--primary) text-(--text-primary) font-semibold text-xs hover:bg-[#ccdaff] transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              Done Editing
            </button>
          )}
        </div>
      </header>

      {/* Edit Mode Active Context Banner */}
      {isEditMode && (
        <div className="relative z-20 flex items-center justify-between px-6 py-2 bg-sky-500/10 border-b border-sky-400/20 text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            <span className="font-(family-name:--labels) font-semibold">
              {sourceNodeForConnection ? (
                <>
                  Selected Source:{" "}
                  <span className="text-white underline">
                    {sourceNodeForConnection.name || sourceNodeForConnection.label}
                  </span>{" "}
                  &rarr; Click a target component to connect.
                </>
              ) : (
                "Edit Mode Active: Click a source component to connect, or click an edge to manage."
              )}
            </span>
          </div>

          {sourceNodeForConnection && (
            <button
              type="button"
              onClick={handleCancelConnection}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950/80 border border-sky-400/30 text-sky-300 hover:text-white text-[11px] font-(family-name:--labels) transition-colors cursor-pointer"
            >
              <FiX className="text-xs" /> Cancel Connection (ESC)
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex w-full flex-1 overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 bg-[#08090C]">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-[#8E9099]">
              Loading project architecture...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 bg-[#08090C] p-6 text-center">
            <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <FiShare2 className="text-2xl" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Unable to Load Architecture Graph
            </h3>
            <p className="text-xs text-[#8E9099] max-w-[40ch]">{error}</p>
            <button
              type="button"
              onClick={loadGraphData}
              className="px-4 py-2 rounded-xl bg-[#191B23] border border-[#2B3240] text-xs text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Retry Loading Graph
            </button>
          </div>
        )}

        {/* Empty Graph State (0 components exist in project) */}
        {!loading && !error && components.length === 0 && (
          <div className="flex w-full h-full">
            <GraphSection />
            <SidePanel />
          </div>
        )}

        {/* Interactive Graph State (components exist) */}
        {!loading && !error && components.length > 0 && (
          <>
            {/* Graph Canvas & Floating Toolbar */}
            <div className="relative flex-1 h-full overflow-hidden">
              <GraphCanvas
                elements={elements}
                layoutName={layoutName}
                onSelectNode={handleSelectNode}
                onSelectEdge={handleSelectEdge}
                onDeselect={handleDeselect}
                searchQuery={searchQuery}
                onCyReady={handleCyReady}
                isEditMode={isEditMode}
                sourceNodeForConnection={sourceNodeForConnection}
                onSelectSourceForConnection={handleSelectSourceForConnection}
                onCompleteConnection={handleCompleteConnection}
                onCancelConnection={handleCancelConnection}
              />

              {/* Floating Bottom-Left Toolbar matching Figma */}
              <GraphToolbar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFit={handleFit}
                onResetLayout={handleResetLayout}
                isInspectorOpen={isInspectorOpen}
                onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
                activeLayout={layoutName}
                onChangeLayout={setLayoutName}
              />
            </div>

            {/* Right Inspector Panel */}
            {isInspectorOpen && (
              <GraphInspectorPanel
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                onDeselect={handleDeselect}
                onCenterNode={handleCenterNode}
                onFocusEdge={handleFocusEdge}
                onNavigateToWizard={handleNavigateToWizard}
                onNavigateToComponents={handleNavigateToComponents}
                metrics={metrics}
                allElements={elements}
                isEditMode={isEditMode}
                onOpenEditRelationshipModal={handleOpenEditRelationshipModal}
                onOpenDeleteRelationshipModal={handleOpenDeleteRelationshipModal}
              />
            )}
          </>
        )}
      </div>

      {/* Relationship Create / Edit Modal */}
      {isRelModalOpen && (
        <RelationshipModal
          key={relModalMode === "edit" ? editingEdgeData?.id || "edit" : "create"}
          isOpen={isRelModalOpen}
          onClose={() => {
            setIsRelModalOpen(false);
            setSourceNodeForConnection(null);
            setTargetNodeForConnection(null);
            setEditingEdgeData(null);
          }}
          onSubmit={handleSaveRelationship}
          sourceName={
            relModalMode === "create"
              ? sourceNodeForConnection?.name || sourceNodeForConnection?.label
              : editingEdgeData?.sourceName || editingEdgeData?.source
          }
          targetName={
            relModalMode === "create"
              ? targetNodeForConnection?.name || targetNodeForConnection?.label
              : editingEdgeData?.targetName || editingEdgeData?.target
          }
          initialData={editingEdgeData}
          isSubmitting={isSubmittingRel}
          mode={relModalMode}
        />
      )}

      {/* Delete Relationship Confirmation Modal */}
      <DeleteRelationshipModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEdgeToDelete(null);
        }}
        onConfirm={handleConfirmDeleteRelationship}
        sourceName={edgeToDelete?.sourceName || edgeToDelete?.source}
        targetName={edgeToDelete?.targetName || edgeToDelete?.target}
        relType={edgeToDelete?.type}
        protocol={edgeToDelete?.protocol}
        isDeleting={isDeletingRel}
      />
    </div>
  );
}
