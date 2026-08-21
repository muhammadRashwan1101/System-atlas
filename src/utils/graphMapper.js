import { getIconType } from "../components/ComponentsManagement/componentUtils";

/**
 * Maps raw backend component records and relationship documents into Cytoscape.js nodes and edges.
 *
 * @param {Array} components - Array of component objects from backend
 * @param {Array} relationships - Array of standalone relationship objects from backend
 * @returns {Array} Array of Cytoscape elements (nodes and edges)
 */
export function mapProjectToGraphElements(components = [], relationships = []) {
  if (!Array.isArray(components) || components.length === 0) {
    return [];
  }

  const validNodeIds = new Set();
  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  // 1. Build Nodes
  components.forEach((comp) => {
    if (!comp || !comp._id) return;

    const id = String(comp._id);
    validNodeIds.add(id);

    const typeStr = comp.type || comp.componentType || "Service";
    const formattedType =
      typeStr.charAt(0).toUpperCase() + typeStr.slice(1);

    const env =
      comp.deploymentEnvironment || comp.environment || "Production";

    const owner =
      (typeof comp.ownerTeam === "object"
        ? comp.ownerTeam?.teamName
        : comp.ownerTeam) ||
      comp.ownerRefCode ||
      "Unassigned";

    const technologies = Array.isArray(comp.technologies)
      ? comp.technologies
      : [];

    const status = comp.status === "inactive" ? "WARNING" : "HEALTHY";
    const icon = getIconType(typeStr);

    const nodeElement = {
      group: "nodes",
      data: {
        id,
        rawId: comp._id,
        label: comp.name || "Untitled Component",
        name: comp.name || "Untitled Component",
        type: formattedType,
        componentType: typeStr.toLowerCase(),
        environment: env,
        owner,
        technologies,
        status,
        iconType: icon,
        description: comp.description || "",
        rawComponent: comp,
        relationshipsCount: 0,
      },
    };

    nodes.push(nodeElement);
    nodeMap.set(id, nodeElement);
  });

  // 2. Build Edges from standalone relationships collection
  const edgeKeys = new Set();

  if (Array.isArray(relationships) && relationships.length > 0) {
    relationships.forEach((rel) => {
      if (!rel) return;

      const sourceId = String(rel.sourceId?._id || rel.sourceId || "");
      const targetId = String(rel.targetId?._id || rel.targetId || "");

      if (!sourceId || !targetId || !validNodeIds.has(sourceId) || !validNodeIds.has(targetId)) {
        return;
      }

      const type = rel.type || "depends-on";
      const protocol = rel.protocol || "HTTPS";
      const relId = String(rel._id || `${sourceId}->${targetId}:${type}`);
      const dedupeKey = `${sourceId}->${targetId}:${type}`;

      if (edgeKeys.has(dedupeKey)) return;
      edgeKeys.add(dedupeKey);

      const sourceNode = nodeMap.get(sourceId);
      const targetNode = nodeMap.get(targetId);

      if (sourceNode) sourceNode.data.relationshipsCount += 1;
      if (targetNode) targetNode.data.relationshipsCount += 1;

      edges.push({
        group: "edges",
        data: {
          id: relId,
          relationshipId: rel._id ? String(rel._id) : relId,
          source: sourceId,
          target: targetId,
          sourceName: sourceNode?.data?.label || rel.sourceId?.name || "Source",
          targetName: targetNode?.data?.label || rel.targetId?.name || "Target",
          type,
          protocol,
          rawRelationship: rel,
        },
      });
    });
  }

  // 3. Fallback: Build Edges from embedded component relationships (if any)
  components.forEach((comp) => {
    if (!comp || !comp._id) return;
    const sourceId = String(comp._id);

    if (Array.isArray(comp.relationships)) {
      comp.relationships.forEach((rel, idx) => {
        if (!rel) return;
        const targetId = String(
          rel.targetId || rel.target || (rel.targetComponent && rel.targetComponent._id) || ""
        );

        if (!targetId || !validNodeIds.has(targetId)) {
          return;
        }

        const type = rel.type || "depends-on";
        const protocol = rel.protocol || "HTTPS";
        const dedupeKey = `${sourceId}->${targetId}:${type}`;

        if (edgeKeys.has(dedupeKey)) return;
        edgeKeys.add(dedupeKey);

        const edgeId = rel._id ? String(rel._id) : `${sourceId}->${targetId}:${type}:${idx}`;
        const sourceNode = nodeMap.get(sourceId);
        const targetNode = nodeMap.get(targetId);

        if (sourceNode) sourceNode.data.relationshipsCount += 1;
        if (targetNode) targetNode.data.relationshipsCount += 1;

        edges.push({
          group: "edges",
          data: {
            id: edgeId,
            relationshipId: rel._id ? String(rel._id) : edgeId,
            source: sourceId,
            target: targetId,
            sourceName: comp.name || "Source",
            targetName: targetNode?.data?.label || "Target",
            type,
            protocol,
            rawRelationship: rel,
          },
        });
      });
    }
  });

  return [...nodes, ...edges];
}

/**
 * Calculates summary metrics for the graph.
 * @param {Array} elements - Mapped Cytoscape elements
 */
export function calculateGraphMetrics(elements = []) {
  const nodes = elements.filter((el) => el.group === "nodes" || (!el.group && !el.data.source));
  const edges = elements.filter((el) => el.group === "edges" || (!el.group && el.data.source));

  const uniqueTeams = new Set();
  const typeCounts = {};
  const envCounts = {};

  nodes.forEach((n) => {
    if (n.data.owner && n.data.owner !== "Unassigned") {
      uniqueTeams.add(n.data.owner);
    }
    const t = n.data.type || "Service";
    typeCounts[t] = (typeCounts[t] || 0) + 1;

    const env = n.data.environment || "Production";
    envCounts[env] = (envCounts[env] || 0) + 1;
  });

  return {
    totalComponents: nodes.length,
    totalRelationships: edges.length,
    totalTeams: uniqueTeams.size,
    typeCounts,
    envCounts,
  };
}
