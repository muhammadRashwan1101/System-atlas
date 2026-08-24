import { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiEdit2,
  FiEye,
  FiCrosshair,
  FiShare2,
  FiCpu,
  FiX,
  FiTerminal,
  FiLayers,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { toast } from "react-toastify";
import ComponentIcon from "../ComponentsManagement/ComponentIcon";

export default function GraphInspectorPanel({
  selectedNode,
  selectedEdge,
  onDeselect,
  onCenterNode,
  onFocusEdge,
  onNavigateToWizard,
  onNavigateToComponents,
  metrics = {},
  allElements = [],
  isEditMode = false,
  onOpenEditRelationshipModal,
  onOpenDeleteRelationshipModal,
}) {
  const [copied, setCopied] = useState(false);

  // Truncate ID for compact display
  const formatId = (id = "") => {
    const s = String(id);
    if (s.length <= 12) return s;
    return `${s.slice(0, 6)}...${s.slice(-2)}`;
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(String(id));
    setCopied(true);
    toast.success("Component ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Edge Selected View
  if (selectedEdge) {
    const edgeData = selectedEdge.data || {};
    return (
      <aside
        id="sidePanel"
        className="flex flex-col justify-between w-88 h-full bg-[#131519] border-l border-(--border)/20 shadow-[2px_0px_7px_rgba(0,0,0,0.5)] p-6 overflow-y-auto shrink-0 select-none animate-in slide-in-from-right-4 duration-200"
      >
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2B3240] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-(--primary) border border-sky-400/20">
                <FiShare2 className="text-base" />
              </div>
              <div>
                <h3 className="font-(family-name:--headers) font-semibold text-white text-sm">
                  Relationship Flow
                </h3>
                <p className="text-[11px] font-(family-name:--labels) text-(--text)/50">
                  {isEditMode ? "Manage Connection" : "Architectural Connection"}
                </p>
              </div>
            </div>

            {onDeselect && (
              <button
                type="button"
                onClick={onDeselect}
                className="p-1.5 rounded-lg text-(--text)/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Deselect"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Flow Topology Box */}
          <div className="p-4 shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(30,33,41,1)] rounded-2xl flex flex-col gap-3 font-light">
            <span className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider">
              Flow Topology
            </span>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-[#0B0E15] border border-(--border)/20 text-xs shadow-[inset_2px_2px_4px_rgba(5,6,8,0.8)]">
                <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 block">
                  SOURCE NODE
                </span>
                <span className="font-semibold text-white block mt-0.5">
                  {edgeData.sourceName || edgeData.source}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs py-1">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-(--primary) font-(family-name:--labels) text-[11px]">
                  {edgeData.type || "calls"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E15] border border-(--border)/20 text-xs shadow-[inset_2px_2px_4px_rgba(5,6,8,0.8)]">
                <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 block">
                  TARGET NODE
                </span>
                <span className="font-semibold text-white block mt-0.5">
                  {edgeData.targetName || edgeData.target}
                </span>
              </div>
            </div>
          </div>

          {/* Protocol & Metadata Inset Box */}
          <div className="p-4 bg-[#0B0E15] rounded-xl shadow-[inset_4px_4px_8px_rgba(5,6,8,1),inset_-2px_-2px_6px_rgba(21,24,31,1)] flex flex-col gap-2.5 text-xs">
            <span className="font-(family-name:--labels) text-(--text)/50 text-[11px] uppercase tracking-wider">
              Communication Protocol
            </span>
            <div className="flex items-center justify-between">
              <span className="text-(--text)/70">Protocol:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-(family-name:--labels) text-[11px]">
                {edgeData.protocol || "HTTPS"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-(--text)/70">Status:</span>
              <span className="text-emerald-400 font-(family-name:--labels) text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                Active Link
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2 pt-6 border-t border-(--border)/20">
          {isEditMode ? (
            <>
              <button
                type="button"
                onClick={() =>
                  onOpenEditRelationshipModal &&
                  onOpenEditRelationshipModal(selectedEdge)
                }
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#191B23] border border-[#2B3240] hover:bg-white/5 text-white font-medium text-xs shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(50,56,66,0.4)] transition-all cursor-pointer"
              >
                <FiEdit2 /> Edit Relationship
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenDeleteRelationshipModal &&
                  onOpenDeleteRelationshipModal(selectedEdge)
                }
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-(--danger) font-semibold text-xs transition-all cursor-pointer shadow-md"
              >
                <FiTrash2 /> Delete Relationship
              </button>
              <button
                type="button"
                onClick={() => onFocusEdge && onFocusEdge(selectedEdge)}
                className="flex items-center justify-center gap-1.5 w-full py-1 text-(--text)/50 hover:text-white text-xs transition-colors cursor-pointer"
              >
                <FiCrosshair /> Focus Connected Nodes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onFocusEdge && onFocusEdge(selectedEdge)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#191B23] border border-[#2B3240] hover:bg-white/5 text-white font-medium text-xs shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(50,56,66,0.4)] transition-all cursor-pointer"
            >
              <FiCrosshair /> Focus Connected Nodes
            </button>
          )}
        </div>
      </aside>
    );
  }

  // 2. Node Selected View
  if (selectedNode) {
    const nodeData = selectedNode.data || {};
    const rawComp = nodeData.rawComponent || {};
    const displayId = nodeData.id || nodeData.rawId || "64f8a1e8c9b208c";
    const technologies = Array.isArray(nodeData.technologies) && nodeData.technologies.length > 0
      ? nodeData.technologies
      : ["React", "TypeScript", "TailwindCSS"];

    const status = nodeData.status === "WARNING" ? "WARNING" : "HEALTHY";

    const configMetadata = {
      version: rawComp.version || "2.4.1",
      environment: (nodeData.environment || "production").toLowerCase(),
      autoscale: true,
      region: rawComp.region || "us-east-1",
    };

    const connectedEdges = allElements.filter(
      (el) =>
        (el.group === "edges" || (!el.group && el.data?.source)) &&
        (el.data?.source === nodeData.id || el.data?.target === nodeData.id)
    );

    return (
      <aside
        id="sidePanel"
        className="flex flex-col justify-between w-88 h-full bg-[#131519] border-l border-(--border)/20 shadow-[2px_0px_7px_rgba(0,0,0,0.5)] p-6 overflow-y-auto shrink-0 select-none animate-in slide-in-from-right-4 duration-200"
      >
        <div className="flex flex-col gap-5">
          {/* Top Header Row: Component Icon, Title, ID, Status, Close */}
          <div className="flex items-center justify-between border-b border-[#2B3240] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1E26] border border-[#2B3240] flex items-center justify-center shadow-[2px_2px_6px_rgba(0,0,0,0.4)]">
                <ComponentIcon iconType={nodeData.iconType} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-(family-name:--headers) font-semibold text-white text-sm leading-tight">
                  {nodeData.name || nodeData.label || "Component"}
                </h3>
                {/* ID with Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopyId(displayId)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-(family-name:--labels) text-(--text)/60 hover:text-(--primary) transition-colors cursor-pointer mt-0.5 group"
                  title="Click to copy full ID"
                >
                  <span>ID: {formatId(displayId)}</span>
                  {copied ? (
                    <FiCheck className="text-emerald-400 text-[10px]" />
                  ) : (
                    <FiCopy className="text-(--text)/40 group-hover:text-(--primary) text-[10px] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Status Indicator & Deselect */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-(family-name:--labels) font-medium border ${
                  status === "WARNING"
                    ? "bg-amber-500/10 text-(--danger) border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "WARNING" ? "bg-amber-400" : "bg-emerald-400 shadow-[0_0_6px_#34D399]"
                  }`}
                />
                {status}
              </span>

              {onDeselect && (
                <button
                  type="button"
                  onClick={onDeselect}
                  className="p-1 rounded-lg text-(--text)/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Deselect"
                >
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Architecture Specifications Card (Neumorphic Outset Box) */}
          <div className="p-4 shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(30,33,41,1)] rounded-2xl flex flex-col gap-3 font-light text-xs">
            <h3 className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider">
              Architecture Specs
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-(--text)/70">Component Type:</span>
              <span className="font-semibold text-white font-(family-name:--labels)">
                {nodeData.type || "Backend Service"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-(--text)/70">Environment:</span>
              <span className="px-2 py-0.5 rounded bg-[#191B23] border border-[#2B3240] text-[11px] text-white font-(family-name:--labels) uppercase">
                {nodeData.environment || "Production"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-(--text)/70">Owner Team:</span>
              <span className="font-medium text-white">
                {nodeData.owner || "Platform"}
              </span>
            </div>
          </div>

          {/* Technology Stack Pills */}
          <div className="flex flex-col gap-2.5">
            <span className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FiCpu className="text-(--primary)" /> Technology Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-[#191B23] border border-[#2B3240] text-white text-xs font-(family-name:--labels) shadow-[2px_2px_4px_rgba(0,0,0,0.3)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Connected Dependencies & Edges */}
          {connectedEdges.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FiLayers className="text-(--primary)" /> Dependencies ({connectedEdges.length})
              </span>
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                {connectedEdges.map((e) => {
                  const isOut = e.data.source === nodeData.id;
                  return (
                    <div
                      key={e.data.id}
                      className="p-2 rounded-lg bg-[#0B0E15] border border-(--border)/20 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`text-[9px] font-(family-name:--labels) px-1.5 py-0.2 rounded ${
                            isOut
                              ? "bg-sky-500/20 text-sky-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {isOut ? "OUT" : "IN"}
                        </span>
                        <span className="text-white truncate">
                          {isOut ? e.data.targetName : e.data.sourceName}
                        </span>
                      </div>
                      <span className="text-[10px] font-(family-name:--labels) text-(--text)/50">
                        {e.data.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Configuration Metadata Code Block */}
          <div className="flex flex-col gap-2">
            <span className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FiTerminal className="text-(--primary)" /> Configuration Metadata
            </span>
            <div className="p-3.5 bg-[#0B0E15] rounded-xl shadow-[inset_4px_4px_8px_rgba(5,6,8,1),inset_-2px_-2px_6px_rgba(21,24,31,1)] border border-(--border)/15 font-(family-name:--labels) text-xs text-[#9CA3AF] leading-relaxed">
              <pre className="text-xs overflow-x-auto whitespace-pre font-(family-name:--labels)">
                <span className="text-white">{"{"}</span>
                {"\n"}  <span className="text-sky-300">&quot;version&quot;</span>: <span className="text-emerald-300">&quot;{configMetadata.version}&quot;</span>,
                {"\n"}  <span className="text-sky-300">&quot;environment&quot;</span>: <span className="text-emerald-300">&quot;{configMetadata.environment}&quot;</span>,
                {"\n"}  <span className="text-sky-300">&quot;autoscale&quot;</span>: <span className="text-amber-300">{String(configMetadata.autoscale)}</span>,
                {"\n"}  <span className="text-sky-300">&quot;region&quot;</span>: <span className="text-emerald-300">&quot;{configMetadata.region}&quot;</span>
                {"\n"}<span className="text-white">{"}"}</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Action CTAs Bottom Bar */}
        <div className="flex flex-col gap-2 pt-5 border-t border-(--border)/20">
          {/* Primary CTA: Edit Component in Wizard */}
          <button
            type="button"
            onClick={() =>
              onNavigateToWizard && onNavigateToWizard(nodeData.id || rawComp._id)
            }
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-(--primary) hover:bg-[#ccdaff] text-(--text-primary) font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <FiEdit2 className="text-sm" /> Edit Component in Wizard
          </button>

          {/* Secondary CTAs Row */}
          <div className="flex items-center gap-2">
            {/* Focus in Viewport */}
            {onCenterNode && nodeData.id && (
              <button
                type="button"
                onClick={() => onCenterNode(nodeData.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#191B23] border border-[#2B3240] hover:bg-white/5 text-white font-medium text-xs shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(50,56,66,0.4)] transition-all cursor-pointer"
                title="Focus in Graph"
              >
                <FiCrosshair /> Focus Node
              </button>
            )}

            {/* View in Components Management */}
            <button
              type="button"
              onClick={() =>
                onNavigateToComponents &&
                onNavigateToComponents(nodeData.id || rawComp._id)
              }
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#191B23] border border-[#2B3240] hover:bg-white/5 text-white font-medium text-xs shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(50,56,66,0.4)] transition-all cursor-pointer"
              title="View in Component Details"
            >
              <FiEye /> View Details
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 3. Default Summary Mode (when NO node or edge is selected - prevents auto-selection)
  return (
    <aside
      id="sidePanel"
      className="flex flex-col justify-between w-88 h-full bg-[#131519] border-l border-(--border)/20 shadow-[2px_0px_7px_rgba(0,0,0,0.5)] p-6 overflow-y-auto shrink-0 select-none animate-in slide-in-from-right-4 duration-200"
    >
      <div className="flex flex-col gap-5">
        {/* Project Topology Summary Card */}
        <div className="flex flex-col gap-4 p-4 shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(30,33,41,1)] rounded-2xl font-light">
          <h3 className="font-(family-name:--labels) text-[#C4C6D0]/60 text-xs uppercase tracking-wider">
            Architecture Topology
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-(--text)/80">Components</span>
            <span className="font-semibold text-white font-(family-name:--labels)">
              {metrics.totalComponents || 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-(--text)/80">Relationships</span>
            <span className="font-semibold text-white font-(family-name:--labels)">
              {metrics.totalRelationships || 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-(--text)/80">Owner Teams</span>
            <span className="font-semibold text-white font-(family-name:--labels)">
              {metrics.totalTeams || 0}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#2B3240]/40">
            <div className="flex justify-between font-normal font-(family-name:--labels) uppercase text-xs">
              <span className="text-(--text)/60">Graph Density</span>
              <span className="text-emerald-400 font-(family-name:--labels)">Normal</span>
            </div>
            <progress
              value={Math.min(
                100,
                ((metrics.totalRelationships || 0) /
                  Math.max(1, metrics.totalComponents || 1)) *
                  25
              )}
              max={100}
              className="h-1.5 w-full rounded overflow-hidden"
            />
          </div>
        </div>

        {/* Telemetry Status Notice */}
        <div className="flex flex-col gap-3 items-center justify-center text-center p-6 bg-[#0B0E15] rounded-xl shadow-[inset_4px_4px_8px_rgba(5,6,8,1),inset_-2px_-2px_6px_rgba(21,24,31,1)]">
          <MdOutlineAnalytics className="text-[#44474F]/50 text-4xl" />
          <p className="text-xs max-w-[28ch] font-(family-name:--labels) text-(--text)/50 leading-relaxed">
            Click any node or connection to inspect specifications, tech stack, and flow metrics.
          </p>
        </div>
      </div>

      {/* Add Component CTA */}
      <div className="pt-6 border-t border-(--border)/20">
        <button
          type="button"
          onClick={() => onNavigateToWizard && onNavigateToWizard()}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-(--primary) hover:bg-[#ccdaff] text-(--text-primary) font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/10"
        >
          <FiPlus className="text-sm" /> Add Component to Graph
        </button>
      </div>
    </aside>
  );
}
