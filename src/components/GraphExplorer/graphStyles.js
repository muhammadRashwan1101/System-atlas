/**
 * System Atlas Cytoscape.js Stylesheet
 * High-contrast dark cyber theme matching the Figma design specifications.
 */
export const cytoscapeStylesheet = [
  // Base Node Container
  {
    selector: "node",
    style: {
      width: "200px",
      height: "84px",
      shape: "round-rectangle",
      "background-opacity": 0,
      "border-width": 0,
      "overlay-opacity": 0,
      label: "",
      opacity: 1,
      "transition-property": "opacity, border-color, shadow-opacity",
      "transition-duration": "0.2s",
    },
  },

  // Base Edge with Directional Arrow matching Figma
  {
    selector: "edge",
    style: {
      "curve-style": "bezier",
      width: 1.8,
      "line-color": "#2F3547",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#3E465B",
      "arrow-scale": 0.85,
      "target-distance-from-node": "6px",
      "source-distance-from-node": "6px",
      opacity: 0.85,
      "overlay-opacity": 0,
      "transition-property": "line-color, target-arrow-color, width, opacity, arrow-scale",
      "transition-duration": "0.2s",
    },
  },

  // Hover Edge
  {
    selector: "edge:hover",
    style: {
      width: 2.2,
      "line-color": "#ADC6FF",
      "target-arrow-color": "#ADC6FF",
      "arrow-scale": 1.0,
      opacity: 1,
      cursor: "pointer",
    },
  },

  // Highlighted Matching Node (Only searched/selected node glows)
  {
    selector: "node.highlighted, node:selected",
    style: {
      opacity: 1,
      "border-color": "#ADC6FF",
      "border-width": "2px",
      "shadow-blur": "24px",
      "shadow-color": "rgba(173, 198, 255, 0.6)",
      "shadow-opacity": 0.95,
      "z-index": 999,
    },
  },

  // Selected Edge / Highlighted Connected Flow
  {
    selector: "edge:selected, edge.highlighted",
    style: {
      width: 2.2,
      "line-color": "#ADC6FF",
      "target-arrow-color": "#ADC6FF",
      "arrow-scale": 1.0,
      opacity: 1,
      "z-index": 998,
    },
  },

  // Dimmed Non-matching Nodes (Completely dimmed without glow)
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.15,
      "shadow-opacity": 0,
      "border-width": 0,
      "z-index": 1,
    },
  },

  // Dimmed Non-matching Edges
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.08,
      "line-color": "#1C202C",
      "target-arrow-color": "transparent",
    },
  },
];
