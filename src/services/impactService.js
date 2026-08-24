import api from "../api/axios";

/**
 * Robust helper to extract string ID from either string or populated object
 */
const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "object") {
    return String(val._id || val.id || "");
  }
  return String(val);
};

const formatAction = (typeStr) => {
  if (!typeStr) return "CALLS";
  const map = {
    calls: "CALLS",
    "reads-from": "READS FROM",
    "writes-to": "WRITES TO",
    "publishes-to": "PUBLISHES TO",
    "subscribes-to": "SUBSCRIBES TO",
    "consumes-from": "CONSUMES",
    "depends-on": "DEPENDS ON",
  };
  return (
    map[typeStr.toLowerCase()] ||
    typeStr.toUpperCase().replace(/-/g, " ")
  );
};

/**
 * Service for Impact Analysis calculations, blast radius discovery,
 * and dependency graph traversal from real backend endpoints.
 */
export const impactService = {
  /**
   * Fetches real component graph for impact analysis
   */
  async getProjectGraphForImpact(projectId) {
    if (!projectId) return null;

    try {
      const [compRes, relRes] = await Promise.allSettled([
        api.get(`/projects/${projectId}/components`),
        api.get(`/projects/${projectId}/relationships`),
      ]);

      const components =
        compRes.status === "fulfilled"
          ? compRes.value.data?.components ||
            compRes.value.data?.data ||
            compRes.value.data ||
            []
          : [];

      const relationships =
        relRes.status === "fulfilled"
          ? relRes.value.data?.relationships ||
            relRes.value.data?.data ||
            relRes.value.data ||
            []
          : [];

      return {
        components: Array.isArray(components) ? components : [],
        relationships: Array.isArray(relationships) ? relationships : [],
      };
    } catch (err) {
      console.error("Failed to load project graph for impact:", err);
      return null;
    }
  },

  /**
   * Computes downstream and upstream impact tree starting from a target component ID
   */
  calculateComponentImpact(targetId, components = [], relationships = []) {
    const cleanTargetId = extractId(targetId);
    if (!cleanTargetId || components.length === 0) {
      return null;
    }

    const targetComp = components.find(
      (c) => extractId(c._id) === cleanTargetId || extractId(c.id) === cleanTargetId
    );

    if (!targetComp) return null;

    // Upstream (Consumers who call this component)
    const consumers = [];
    const dependencies = [];
    const seenConsumers = new Set();
    const seenDependencies = new Set();

    // 1. Process Standalone relationships collection
    if (Array.isArray(relationships)) {
      relationships.forEach((rel) => {
        if (!rel) return;
        const srcId = extractId(rel.sourceId || rel.source || rel.from || rel.sourceComponent);
        const tgtId = extractId(rel.targetId || rel.target || rel.to || rel.targetComponent);

        if (!srcId || !tgtId) return;

        if (srcId === cleanTargetId && !seenDependencies.has(tgtId)) {
          // Target calls this dependency
          seenDependencies.add(tgtId);
          const depComp = components.find(
            (c) => extractId(c._id) === tgtId || extractId(c.id) === tgtId
          );
          const depName =
            (typeof rel.targetId === "object" ? rel.targetId.name : null) ||
            depComp?.name ||
            "Downstream Service";

          dependencies.push({
            id: tgtId,
            name: depName,
            type: depComp?.type || "Service",
            protocol: rel.protocol || "REST",
            action: formatAction(rel.type || "reads-from"),
            isCritical: true,
          });
        } else if (tgtId === cleanTargetId && !seenConsumers.has(srcId)) {
          // This consumer calls the target
          seenConsumers.add(srcId);
          const consComp = components.find(
            (c) => extractId(c._id) === srcId || extractId(c.id) === srcId
          );
          const consName =
            (typeof rel.sourceId === "object" ? rel.sourceId.name : null) ||
            consComp?.name ||
            "Upstream Caller";

          consumers.push({
            id: srcId,
            name: consName,
            type: consComp?.type || "API",
            protocol: rel.protocol || "gRPC",
            action: formatAction(rel.type || "consumes"),
            isCritical: true,
          });
        }
      });
    }

    // 2. Process Embedded relationships within components
    // A. Check target component's embedded outgoing dependencies
    if (Array.isArray(targetComp.relationships)) {
      targetComp.relationships.forEach((rel) => {
        if (!rel) return;
        const tgtId = extractId(rel.targetId || rel.target || rel.targetComponent);
        if (tgtId && !seenDependencies.has(tgtId)) {
          seenDependencies.add(tgtId);
          const depComp = components.find(
            (c) => extractId(c._id) === tgtId || extractId(c.id) === tgtId
          );
          dependencies.push({
            id: tgtId,
            name: depComp?.name || "Downstream Service",
            type: depComp?.type || "Service",
            protocol: rel.protocol || "REST",
            action: formatAction(rel.type || "calls"),
            isCritical: true,
          });
        }
      });
    }

    // B. Check all other components for embedded calls to target
    components.forEach((otherComp) => {
      if (!otherComp || extractId(otherComp._id) === cleanTargetId) return;
      const otherId = extractId(otherComp._id);

      if (Array.isArray(otherComp.relationships)) {
        otherComp.relationships.forEach((rel) => {
          if (!rel) return;
          const tgtId = extractId(rel.targetId || rel.target || rel.targetComponent);
          if (tgtId === cleanTargetId && !seenConsumers.has(otherId)) {
            seenConsumers.add(otherId);
            consumers.push({
              id: otherId,
              name: otherComp.name || "Upstream Service",
              type: otherComp.type || "API",
              protocol: rel.protocol || "gRPC",
              action: formatAction(rel.type || "calls"),
              isCritical: true,
            });
          }
        });
      }
    });

    const affectedCompCount = Math.max(1, consumers.length + dependencies.length + 1);
    const affectedTeamSet = new Set();

    const targetTeam =
      typeof targetComp.ownerTeam === "object"
        ? targetComp.ownerTeam?.teamName
        : targetComp.ownerTeam || targetComp.ownerRefCode;
    if (targetTeam) affectedTeamSet.add(targetTeam);

    consumers.forEach((c) => {
      if (c.team) affectedTeamSet.add(c.team);
    });

    const impactScore = Math.min(
      95,
      Math.max(45, 50 + consumers.length * 10 + dependencies.length * 5)
    );

    return {
      targetComponent: {
        id: targetComp._id || targetComp.id,
        name: targetComp.name || "Target Component",
        displayId: `ID: ${(extractId(targetComp._id) || "SVC-001").substring(0, 11).toUpperCase()}`,
        type: targetComp.type || "Backend Service",
      },
      consumers,
      dependencies,
      stats: {
        impactScore,
        riskLevel:
          impactScore >= 75
            ? "HIGH RISK"
            : impactScore >= 50
            ? "MEDIUM RISK"
            : "LOW RISK",
        archHealthDelta: `-${Math.round(impactScore * 0.28)}%`,
        componentsCount: affectedCompCount,
        teamsCount: Math.max(1, affectedTeamSet.size || 2),
        projectsCount: Math.max(1, Math.ceil(affectedCompCount / 2)),
        criticalPaths: Math.max(1, Math.min(4, consumers.length)),
      },
    };
  },
};

export default impactService;
