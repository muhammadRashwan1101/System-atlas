import { useRef, useEffect, useCallback } from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import nodeHtmlLabel from "cytoscape-node-html-label";
import { cytoscapeStylesheet } from "./graphStyles";

// Register nodeHtmlLabel once
if (typeof cytoscape("core", "nodeHtmlLabel") !== "function") {
  try {
    nodeHtmlLabel(cytoscape);
  } catch (e) {
    console.warn("Could not register cytoscape-node-html-label:", e);
  }
}

export default function GraphCanvas({
  elements = [],
  layoutName = "breadthfirst",
  onSelectNode,
  onSelectEdge,
  onDeselect,
  searchQuery = "",
  selectedType = "All",
  selectedEnv = "All",
  onCyReady,
  isEditMode = false,
  sourceNodeForConnection = null,
  onSelectSourceForConnection,
  onCompleteConnection,
  onCancelConnection,
}) {
  const cyRef = useRef(null);
  const onSelectNodeRef = useRef(onSelectNode);
  const onSelectEdgeRef = useRef(onSelectEdge);
  const onDeselectRef = useRef(onDeselect);
  const isEditModeRef = useRef(isEditMode);
  const sourceNodeForConnectionRef = useRef(sourceNodeForConnection);
  const onSelectSourceForConnectionRef = useRef(onSelectSourceForConnection);
  const onCompleteConnectionRef = useRef(onCompleteConnection);
  const onCancelConnectionRef = useRef(onCancelConnection);

  // Keep callback refs updated without re-triggering cy listeners
  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
    onSelectEdgeRef.current = onSelectEdge;
    onDeselectRef.current = onDeselect;
    isEditModeRef.current = isEditMode;
    sourceNodeForConnectionRef.current = sourceNodeForConnection;
    onSelectSourceForConnectionRef.current = onSelectSourceForConnection;
    onCompleteConnectionRef.current = onCompleteConnection;
    onCancelConnectionRef.current = onCancelConnection;
  });

  // Handle ESC to cancel connection creation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sourceNodeForConnection && onCancelConnection) {
        onCancelConnection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sourceNodeForConnection, onCancelConnection]);

  // Layout configuration builder
  const getLayoutConfig = useCallback((name) => {
    switch (name) {
      case "breadthfirst":
      default:
        return {
          name: "breadthfirst",
          directed: true,
          padding: 80,
          spacingFactor: 1.6,
          animate: true,
          animationDuration: 400,
          avoidOverlap: true,
          nodeDimensionsIncludeLabels: true,
        };
      case "cose":
        return {
          name: "cose",
          animate: true,
          animationDuration: 500,
          nodeDimensionsIncludeLabels: true,
          padding: 80,
          componentSpacing: 140,
          nodeOverlap: 60,
          idealEdgeLength: 180,
        };
      case "concentric":
        return {
          name: "concentric",
          minNodeSpacing: 80,
          padding: 80,
          animate: true,
          animationDuration: 400,
        };
      case "circle":
        return {
          name: "circle",
          padding: 80,
          animate: true,
          animationDuration: 400,
        };
      case "grid":
        return {
          name: "grid",
          padding: 80,
          animate: true,
          animationDuration: 400,
        };
    }
  }, []);

  // Helper for badge style per component type matching Figma screen
  const getTypeBadgeStyle = (typeStr = "") => {
    const t = typeStr.toLowerCase();
    if (t.includes("front") || t.includes("ui")) {
      return {
        label: "FRONTEND",
        bg: "rgba(56, 189, 248, 0.14)",
        color: "#38BDF8",
        border: "rgba(56, 189, 248, 0.3)",
      };
    }
    if (t.includes("gate") || t.includes("router") || t.includes("proxy") || t.includes("hub")) {
      return {
        label: "GATEWAY",
        bg: "rgba(129, 140, 248, 0.14)",
        color: "#818CF8",
        border: "rgba(129, 140, 248, 0.3)",
      };
    }
    if (t.includes("db") || t.includes("database") || t.includes("store") || t.includes("sql")) {
      return {
        label: "DATABASE",
        bg: "rgba(52, 211, 153, 0.14)",
        color: "#34D399",
        border: "rgba(52, 211, 153, 0.3)",
      };
    }
    if (t.includes("queue") || t.includes("infra") || t.includes("cache")) {
      return {
        label: "INFRA",
        bg: "rgba(251, 191, 36, 0.14)",
        color: "#FBBF24",
        border: "rgba(251, 191, 36, 0.3)",
      };
    }
    return {
      label: "BACKEND",
      bg: "rgba(165, 180, 252, 0.14)",
      color: "#A5B4FC",
      border: "rgba(165, 180, 252, 0.3)",
    };
  };

  const formatTech = (techs) => {
    if (!techs || !Array.isArray(techs) || techs.length === 0) {
      return "Service";
    }
    return techs.slice(0, 2).join(" / ");
  };

  // Attach Cytoscape listeners and initialize HTML Card labels once
  const handleCy = useCallback(
    (cy) => {
      if (!cy || cyRef.current === cy) return;
      cyRef.current = cy;
      if (onCyReady) onCyReady(cy);

      // Register HTML Labels ONCE on this cy instance
      if (!cy._atlasHtmlLabelsConfigured && typeof cy.nodeHtmlLabel === "function") {
        cy._atlasHtmlLabelsConfigured = true;
        cy.nodeHtmlLabel([
          {
            query: "node",
            halign: "center",
            valign: "center",
            halignBox: "center",
            valignBox: "center",
            tpl: (data) => {
              const badge = getTypeBadgeStyle(data.type || data.componentType);
              const techSubtitle = formatTech(data.technologies);

              return `
                <div class="atlas-figma-card" style="
                  width: 200px;
                  height: 84px;
                  background-color: #12141A;
                  border: 1px solid #232738;
                  border-radius: 12px;
                  padding: 10px 12px;
                  box-sizing: border-box;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  cursor: pointer;
                  user-select: none;
                  font-family: Inter, sans-serif;
                  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
                  transition: border-color 0.15s ease, box-shadow 0.15s ease;
                ">
                  <!-- Top Row: Badge & Menu Icon -->
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <span style="
                      font-size: 8.5px;
                      font-family: 'JetBrains Mono', monospace;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      padding: 2px 7px;
                      border-radius: 5px;
                      background-color: ${badge.bg};
                      color: ${badge.color};
                      border: 1px solid ${badge.border};
                      text-transform: uppercase;
                      line-height: 1.2;
                    ">
                      ${badge.label}
                    </span>
                    <span style="color: #6B7280; font-size: 13px; letter-spacing: 2px; line-height: 1; opacity: 0.7;">···</span>
                  </div>

                  <!-- Middle Row: Component Name -->
                  <div style="
                    font-size: 13px;
                    font-weight: 600;
                    color: #FFFFFF;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 1px;
                  ">
                    ${data.name || data.label || "Component"}
                  </div>

                  <!-- Bottom Row: Tech Stack Subtitle -->
                  <div style="
                    font-size: 10px;
                    font-family: 'JetBrains Mono', monospace;
                    color: #6B7280;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
                    ${techSubtitle}
                  </div>
                </div>
              `;
            },
          },
        ]);
      }

      // Clean existing listeners before attaching
      cy.off("tap");
      cy.off("mouseover");
      cy.off("mouseout");

      // Tap on Node
      cy.on("tap", "node", (evt) => {
        const node = evt.target;
        const nodeData = node.data();

        if (isEditModeRef.current) {
          // Edit Mode: Node-to-Node relationship creation
          if (!sourceNodeForConnectionRef.current) {
            // First click: select source
            if (onSelectSourceForConnectionRef.current) {
              onSelectSourceForConnectionRef.current(nodeData);
            }
            cy.elements().removeClass("highlighted");
            node.addClass("highlighted");
          } else {
            // Second click: select target
            if (sourceNodeForConnectionRef.current.id === nodeData.id) {
              // Clicked same node: cancel selection
              if (onCancelConnectionRef.current) {
                onCancelConnectionRef.current();
              }
              cy.elements().removeClass("highlighted");
            } else {
              // Clicked distinct target node: trigger relationship modal
              if (onCompleteConnectionRef.current) {
                onCompleteConnectionRef.current(nodeData);
              }
            }
          }
        } else {
          // View Mode: Normal node inspection
          cy.elements().removeClass("highlighted");
          node.addClass("highlighted");
          node.connectedEdges().addClass("highlighted");

          if (onSelectNodeRef.current) {
            onSelectNodeRef.current({
              group: "nodes",
              data: nodeData,
              position: node.position(),
            });
          }
        }
      });

      // Tap on Edge
      cy.on("tap", "edge", (evt) => {
        const edge = evt.target;
        cy.elements().removeClass("highlighted");
        edge.addClass("highlighted");

        if (onSelectEdgeRef.current) {
          onSelectEdgeRef.current({
            group: "edges",
            data: edge.data(),
          });
        }
      });

      // Tap on canvas background
      cy.on("tap", (evt) => {
        if (evt.target === cy) {
          cy.elements().removeClass("highlighted");
          if (isEditModeRef.current && sourceNodeForConnectionRef.current) {
            if (onCancelConnectionRef.current) onCancelConnectionRef.current();
          }
          if (onDeselectRef.current) onDeselectRef.current();
        }
      });

      // Hover on node or edge -> set pointer cursor
      cy.on("mouseover", "node, edge", (evt) => {
        const target = evt.target;
        if (cy.container()) {
          cy.container().style.cursor = "pointer";
        }
        if (target.isNode && target.isNode()) {
          target.addClass("highlighted");
          target.connectedEdges().addClass("highlighted");
        }
      });

      // Hover out -> reset default cursor
      cy.on("mouseout", "node, edge", (evt) => {
        const target = evt.target;
        if (cy.container()) {
          cy.container().style.cursor = "default";
        }
        if (target.isNode && target.isNode() && !target.selected()) {
          // Don't remove highlight if it's the active source node in edit mode
          if (
            !isEditModeRef.current ||
            sourceNodeForConnectionRef.current?.id !== target.id()
          ) {
            target.removeClass("highlighted");
            target.connectedEdges().removeClass("highlighted");
          }
        }
      });

      // Initial layout execution
      const layout = cy.layout(getLayoutConfig(layoutName));
      layout.run();
      cy.fit(undefined, 80);
    },
    [onCyReady, layoutName, getLayoutConfig]
  );

  // Re-run layout when elements or layoutName changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || elements.length === 0) return;

    const layout = cy.layout(getLayoutConfig(layoutName));
    layout.run();
    cy.fit(undefined, 80);
  }, [layoutName, elements.length, getLayoutConfig]);

  // Handle Search and Filter Dimming & Highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass("dimmed");
      cy.elements().removeClass("highlighted");

      const hasQuery = searchQuery.trim().length > 0;
      const hasType = selectedType !== "All";
      const hasEnv = selectedEnv !== "All";

      if (hasQuery || hasType || hasEnv) {
        const q = searchQuery.toLowerCase().trim();

        cy.nodes().forEach((node) => {
          const d = node.data();
          let matchesQuery = true;
          let matchesType = true;
          let matchesEnv = true;

          if (hasQuery) {
            const nameMatch = d.name?.toLowerCase().includes(q);
            const idMatch = d.id?.toLowerCase().includes(q);
            const teamMatch = d.owner?.toLowerCase().includes(q);
            const techMatch = d.technologies?.some((t) =>
              t.toLowerCase().includes(q)
            );
            matchesQuery = nameMatch || idMatch || teamMatch || techMatch;
          }

          if (hasType) {
            matchesType = d.type === selectedType;
          }

          if (hasEnv) {
            matchesEnv =
              d.environment?.toLowerCase() === selectedEnv.toLowerCase();
          }

          if (matchesQuery && matchesType && matchesEnv) {
            // Only matching nodes get the glowing highlight
            node.addClass("highlighted");
            node.removeClass("dimmed");
          } else {
            // Non-matching nodes are dimmed with no glow
            node.addClass("dimmed");
            node.removeClass("highlighted");
            node.connectedEdges().addClass("dimmed");
          }
        });
      }
    });
  }, [searchQuery, selectedType, selectedEnv]);

  return (
    <div className="relative w-full h-full bg-[#08090C] overflow-hidden" style={{ minHeight: "400px" }}>
      {/* Scoped styles for HTML Cards in dimmed and highlighted states */}
      <style>{`
        .cy-node-html-label div[style*="opacity: 0.15"],
        .cy-node-html-label .dimmed .atlas-figma-card,
        .dimmed {
          opacity: 0.15 !important;
          filter: grayscale(0.85) !important;
          box-shadow: none !important;
        }
        .highlighted .atlas-figma-card,
        .atlas-figma-card.highlighted {
          border-color: #ADC6FF !important;
          box-shadow: 0 0 24px rgba(173, 198, 255, 0.55) !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Subtle backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/3 blur-[120px] rounded-full pointer-events-none -z-0" />

      <CytoscapeComponent
        elements={elements}
        stylesheet={cytoscapeStylesheet}
        layout={getLayoutConfig(layoutName)}
        cy={handleCy}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        boxSelectionEnabled={false}
        autounselectify={false}
        userZoomingEnabled={true}
        userPanningEnabled={true}
        minZoom={0.25}
        maxZoom={2.5}
      />
    </div>
  );
}
