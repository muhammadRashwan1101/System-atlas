import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";

import ComponentDetailsHeader from "../../components/ComponentDetails/ComponentDetailsHeader";
import ComponentHeroSection from "../../components/ComponentDetails/ComponentHeroSection";
import MetricCardsGrid from "../../components/ComponentDetails/MetricCardsGrid";
import IdentityMetadataCard from "../../components/ComponentDetails/IdentityMetadataCard";
import TechnologyStackCard from "../../components/ComponentDetails/TechnologyStackCard";
import DeploymentInfrastructureCard from "../../components/ComponentDetails/DeploymentInfrastructureCard";
import DependenciesConsumersCard from "../../components/ComponentDetails/DependenciesConsumersCard";
import ArchitectureCompletenessCard from "../../components/ComponentDetails/ArchitectureCompletenessCard";
import OwnershipCard from "../../components/ComponentDetails/OwnershipCard";
import ArchitectureActionsCard from "../../components/ComponentDetails/ArchitectureActionsCard";
import DocumentationGalleryCard from "../../components/ComponentDetails/DocumentationGalleryCard";
import SystemMetadataCard from "../../components/ComponentDetails/SystemMetadataCard";
import ActivityTimelineCard from "../../components/ComponentDetails/ActivityTimelineCard";

import ImpactAnalysisModal from "../../components/ComponentDetails/ImpactAnalysisModal";
import ExportReportModal from "../../components/ComponentDetails/ExportReportModal";
import DeleteComponentModal from "../../components/ComponentDetails/DeleteComponentModal";

// Default comprehensive sample matching the design screenshot
const DEFAULT_COMPONENT_DATA = {
  _id: "svc-rec-001",
  name: "Recommendation Service",
  type: "Backend Service",
  status: "Active",
  environment: "Production",
  version: "v2.4.0",
  createdDate: "Jan 12, 2023",
  lastUpdated: "Oct 12, 2023",
  description:
    "The Recommendation Service provides personalized content suggestions for users based on historical interaction patterns and real-time behavioral vectors.",
  tags: ["#personalization", "#ml-inference", "#tier-0"],
  metrics: {
    docCoverage: "85%",
    totalRelationships: 8,
    dependenciesCount: 3,
    consumersCount: 5,
    ownerAssigned: true,
    isCritical: true,
  },
  techStack: {
    backend: "Python 3.11 / FastAPI",
    database: "PostgreSQL 15",
    cache: "Redis 7.0",
    messaging: "Kafka / RabbitMQ",
    infrastructure: "AWS / EKS v1.28",
  },
  deployment: {
    cloudProvider: "AWS (us-east-1)",
    clusterNamespace: "prod-blue / recs",
    repository: "atlas/svc-rec",
    cicdPipeline: "GitHub Actions",
  },
  dependencies: [
    {
      name: "User Profile Svc",
      protocol: "gRPC",
      action: "Calls",
      team: "Identity Team",
    },
    {
      name: "Content Catalog API",
      protocol: "REST",
      action: "Calls",
      team: "Catalog Team",
    },
    {
      name: "Interaction DB (RDS)",
      protocol: "SQL",
      action: "Query",
      team: "DBA Team",
    },
  ],
  consumers: [
    {
      name: "Mobile Home API",
      protocol: "gRPC",
      action: "Pulls",
      team: "Mobile Team",
    },
    {
      name: "Web Frontend BFF",
      protocol: "REST",
      action: "Pulls",
      team: "Web Team",
    },
    {
      name: "Email Blast Svc",
      protocol: "Webhooks",
      action: "Pushes",
      team: "Marketing Team",
    },
  ],
  completeness: {
    ownerAssigned: true,
    documentation: true,
    apiSpec: true,
    relationships: true,
    technologies: true,
    tagged: true,
    adrAvailable: false,
    runbookAvailable: false,
  },
  ownership: {
    teamName: "Growth Team",
    vertical: "Data & Platform Vertical",
    slackChannel: "#growth-eng",
    leads: [
      {
        name: "Sarah Chen",
        role: "TECH LEAD",
        email: "sarah.chen@atlas.internal",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      {
        name: "Alex Rivera",
        role: "SRE ARCHITECT",
        email: "alex.rivera@atlas.internal",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
    ],
    assignedDevelopersCount: 4,
  },
  docs: [
    {
      id: "readme",
      title: "README.md",
      status: "VERIFIED",
      statusType: "success",
    },
    {
      id: "swagger",
      title: "Swagger Specs",
      status: "LIVE v2.4.0",
      statusType: "success",
    },
    {
      id: "adr",
      title: "ADR-042: Vector Store",
      status: "APPROVED",
      statusType: "success",
    },
    {
      id: "er-diagram",
      title: "ER Diagram: Rec Engine",
      status: "DRAFT",
      statusType: "warning",
    },
  ],
  systemMetadata: {
    componentId: "svc-rec-001",
    project: "Atlas Core",
    workspace: "Growth-Prod",
    createdBy: "System Admin",
    labels: ["critical", "pii", "internal"],
  },
  activities: [
    {
      time: "Today, 14:15",
      action: "Documentation Updated: API Spec v2.4.1",
      dotColor: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
    },
    {
      time: "Yesterday, 18:03",
      action: "Relationship Added: Notification Svc",
      dotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
    },
    {
      time: "Oct 10, 16:20",
      action: "Ownership Assigned to Growth Team",
      dotColor: "bg-[#FEB685] shadow-[0_0_6px_#FEB685]",
    },
  ],
};

export default function ComponentDetails() {
  const { workspaceId, projectId, componentId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projectsByWorkspace } = useWorkspace();

  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w._id === workspaceId) || null;
  }, [workspaces, workspaceId]);

  const activeProject = useMemo(() => {
    const prjs = projectsByWorkspace[workspaceId] || [];
    return prjs.find((p) => p._id === projectId) || null;
  }, [projectsByWorkspace, workspaceId, projectId]);

  // Page state
  const [component, setComponent] = useState(DEFAULT_COMPONENT_DATA);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch real component data if projectId and componentId are available
  useEffect(() => {
    let isMounted = true;
    const fetchComponentDetails = async () => {
      if (!projectId || !componentId) return;

      setLoading(true);
      try {
        const [compRes, singleCompRes, altSingleRes, relRes] = await Promise.allSettled([
          api.get(`/projects/${projectId}/components`),
          api.get(`/projects/${projectId}/components/${componentId}`),
          api.get(`/components/${componentId}`),
          api.get(`/projects/${projectId}/relationships`),
        ]);

        const componentsList =
          compRes.status === "fulfilled"
            ? compRes.value.data?.components ||
              compRes.value.data?.data ||
              compRes.value.data ||
              []
            : [];

        const singleData =
          singleCompRes.status === "fulfilled"
            ? singleCompRes.value.data?.component ||
              singleCompRes.value.data?.data ||
              singleCompRes.value.data
            : altSingleRes.status === "fulfilled"
            ? altSingleRes.value.data?.component ||
              altSingleRes.value.data?.data ||
              altSingleRes.value.data
            : null;

        const relationshipsList =
          relRes.status === "fulfilled"
            ? relRes.value.data?.relationships ||
              relRes.value.data?.data ||
              relRes.value.data ||
              []
            : [];

        if (isMounted) {
          const extractId = (val) => {
            if (!val) return "";
            if (typeof val === "object") return String(val._id || val.id || "");
            return String(val);
          };

          const formatRelAction = (typeStr) => {
            if (!typeStr) return "Calls";
            const map = {
              calls: "Calls",
              "reads-from": "Reads From",
              "writes-to": "Writes To",
              "publishes-to": "Publishes To",
              "subscribes-to": "Subscribes To",
              "consumes-from": "Consumes From",
              "depends-on": "Depends On",
            };
            return (
              map[typeStr.toLowerCase()] ||
              typeStr.charAt(0).toUpperCase() + typeStr.slice(1).replace(/-/g, " ")
            );
          };

          const getTeamLabel = (compObj) => {
            if (!compObj) return "Platform Team";
            if (typeof compObj.ownerTeam === "object") {
              return compObj.ownerTeam?.teamName || "Platform Team";
            }
            return compObj.ownerTeam || compObj.ownerRefCode || "Platform Team";
          };

          const targetCompId = extractId(componentId);

          const foundInList = Array.isArray(componentsList)
            ? componentsList.find(
                (c) =>
                  extractId(c._id) === targetCompId ||
                  extractId(c.id) === targetCompId
              )
            : null;

          // Merge single component detailed payload with list item if available
          const found =
            singleData && typeof singleData === "object"
              ? { ...foundInList, ...singleData }
              : foundInList;

          if (found) {
            const realConsumers = [];
            const realDependencies = [];
            const seenDeps = new Set();
            const seenCons = new Set();

            // 1. Traverse standalone relationships collection
            relationshipsList.forEach((rel) => {
              if (!rel) return;
              const srcId = extractId(rel.sourceId || rel.source || rel.from || rel.sourceComponent);
              const tgtId = extractId(rel.targetId || rel.target || rel.to || rel.targetComponent);

              if (srcId === targetCompId && !seenDeps.has(tgtId)) {
                // Outgoing: This component calls / depends on tgtId
                seenDeps.add(tgtId);
                const targetMatch = Array.isArray(componentsList)
                  ? componentsList.find(
                      (c) => extractId(c._id) === tgtId || extractId(c.id) === tgtId
                    )
                  : null;
                const targetName =
                  (typeof rel.targetId === "object" ? rel.targetId.name : null) ||
                  targetMatch?.name ||
                  "Downstream Service";

                realDependencies.push({
                  id: tgtId,
                  name: targetName,
                  protocol: rel.protocol || "REST",
                  action: formatRelAction(rel.type || "calls"),
                  team: getTeamLabel(targetMatch || rel.targetId),
                });
              } else if (tgtId === targetCompId && !seenCons.has(srcId)) {
                // Incoming: srcId calls / consumes this component
                seenCons.add(srcId);
                const sourceMatch = Array.isArray(componentsList)
                  ? componentsList.find(
                      (c) => extractId(c._id) === srcId || extractId(c.id) === srcId
                    )
                  : null;
                const sourceName =
                  (typeof rel.sourceId === "object" ? rel.sourceId.name : null) ||
                  sourceMatch?.name ||
                  "Upstream Caller";

                realConsumers.push({
                  id: srcId,
                  name: sourceName,
                  protocol: rel.protocol || "gRPC",
                  action: formatRelAction(rel.type || "calls"),
                  team: getTeamLabel(sourceMatch || rel.sourceId),
                });
              }
            });

            // 2. Traverse embedded relationships in the component itself
            if (Array.isArray(found.relationships)) {
              found.relationships.forEach((rel) => {
                if (!rel) return;
                const tgtId = extractId(rel.targetId || rel.target || rel.targetComponent);
                if (tgtId && !seenDeps.has(tgtId)) {
                  seenDeps.add(tgtId);
                  const targetMatch = Array.isArray(componentsList)
                    ? componentsList.find(
                        (c) => extractId(c._id) === tgtId || extractId(c.id) === tgtId
                      )
                    : null;
                  realDependencies.push({
                    id: tgtId,
                    name: targetMatch?.name || "Downstream Service",
                    protocol: rel.protocol || "REST",
                    action: formatRelAction(rel.type || "calls"),
                    team: getTeamLabel(targetMatch),
                  });
                }
              });
            }

            // 3. Traverse embedded relationships in other components pointing to this component
            if (Array.isArray(componentsList)) {
              componentsList.forEach((otherComp) => {
                if (!otherComp || extractId(otherComp._id) === targetCompId) return;
                const otherId = extractId(otherComp._id);

                if (Array.isArray(otherComp.relationships)) {
                  otherComp.relationships.forEach((rel) => {
                    if (!rel) return;
                    const tgtId = extractId(rel.targetId || rel.target || rel.targetComponent);
                    if (tgtId === targetCompId && !seenCons.has(otherId)) {
                      seenCons.add(otherId);
                      realConsumers.push({
                        id: otherId,
                        name: otherComp.name || "Upstream Service",
                        protocol: rel.protocol || "gRPC",
                        action: formatRelAction(rel.type || "calls"),
                        team: getTeamLabel(otherComp),
                      });
                    }
                  });
                }
              });
            }

            // Categorize technologies
            const techArr = Array.isArray(found.technologies)
              ? found.technologies
              : typeof found.technologies === "string"
              ? found.technologies.split(",").map((s) => s.trim())
              : [];

            const backendTech =
              techArr.find((t) =>
                /python|fastapi|node|express|nest|spring|django|flask|asp\.net|go|ruby/i.test(
                  t
                )
              ) || (techArr[0] ? techArr[0] : "Python 3.11 / FastAPI");

            const dbTech =
              techArr.find((t) =>
                /postgres|mongo|mysql|oracle|sql|sqlite/i.test(t)
              ) || "PostgreSQL 15";

            const cacheTech =
              techArr.find((t) => /redis|memcached/i.test(t)) || "Redis 7.0";

            const messagingTech =
              techArr.find((t) => /kafka|rabbitmq|sqs|queue|event/i.test(t)) ||
              "Kafka / RabbitMQ";

            const infraTech =
              techArr.find((t) =>
                /aws|eks|docker|kubernetes|gcp|azure|terraform/i.test(t)
              ) || "AWS / EKS v1.28";

            // Extract live URLs from all potential backend field formats
            const repoLink =
              found.repoURL ||
              found.repoUrl ||
              found.repository ||
              found.repositoryURL ||
              found.repositoryUrl ||
              found.repo ||
              found.github ||
              found.git ||
              found.documentation?.repoURL ||
              found.documentation?.repoUrl ||
              found.documentation?.repository ||
              found.documentation?.repo ||
              found.documentation?.github ||
              "";

            const docsLink =
              found.docsURL ||
              found.docsUrl ||
              found.documentationURL ||
              found.documentationUrl ||
              found.swaggerURL ||
              found.swaggerUrl ||
              found.apiDocs ||
              found.apiSpec ||
              (typeof found.documentation === "string" ? found.documentation : null) ||
              (typeof found.docs === "string" ? found.docs : null) ||
              found.documentation?.docsURL ||
              found.documentation?.docsUrl ||
              found.documentation?.documentationURL ||
              found.documentation?.documentationUrl ||
              found.documentation?.docs ||
              found.documentation?.url ||
              "";

            const monitorLink =
              found.monitorURL ||
              found.monitorUrl ||
              found.monitoringURL ||
              found.monitoringUrl ||
              found.monitor ||
              found.monitoring ||
              found.metricsURL ||
              found.metricsUrl ||
              found.grafana ||
              found.documentation?.monitorURL ||
              found.documentation?.monitorUrl ||
              found.documentation?.monitoringURL ||
              found.documentation?.monitoringUrl ||
              found.documentation?.monitor ||
              "";

            const deploymentLink =
              found.deploymentURL ||
              found.deploymentUrl ||
              found.ciCdURL ||
              found.ciCdUrl ||
              found.pipelineURL ||
              found.pipelineUrl ||
              found.cicd ||
              found.deployment ||
              found.documentation?.deploymentURL ||
              found.documentation?.deploymentUrl ||
              found.documentation?.ciCdURL ||
              found.documentation?.pipelineURL ||
              found.documentation?.deployment ||
              "";

            const rawTagsList = Array.isArray(found.tags)
              ? found.tags
              : Array.isArray(found.documentation?.tags)
              ? found.documentation.tags
              : [];

            // Build dynamic documentation gallery cards
            const docsGallery = [
              {
                id: "repo",
                title: "Source Repository",
                subtitle: repoLink
                  ? repoLink.replace(/^https?:\/\//, "")
                  : "Not provided in database",
                status: repoLink ? "VERIFIED" : "UNLINKED",
                statusType: repoLink ? "success" : "warning",
                url: repoLink || null,
              },
              {
                id: "swagger",
                title: "API Specification",
                subtitle: docsLink
                  ? docsLink.replace(/^https?:\/\//, "")
                  : "OpenAPI / Swagger Specs",
                status: docsLink ? "LIVE SPEC" : "UNLINKED",
                statusType: docsLink ? "success" : "warning",
                url: docsLink || null,
              },
              {
                id: "monitor",
                title: "Telemetry & Monitor",
                subtitle: monitorLink
                  ? monitorLink.replace(/^https?:\/\//, "")
                  : "Grafana / Metrics Endpoint",
                status: monitorLink ? "CONNECTED" : "UNLINKED",
                statusType: monitorLink ? "success" : "warning",
                url: monitorLink || null,
              },
              {
                id: "deploy",
                title: "Deployment Pipeline",
                subtitle: deploymentLink
                  ? deploymentLink.replace(/^https?:\/\//, "")
                  : "CI / CD Deployment Pipeline",
                status: deploymentLink ? "ACTIVE" : "UNLINKED",
                statusType: deploymentLink ? "success" : "warning",
                url: deploymentLink || null,
              },
            ];

            // Add extra custom links if available in documentation/links array
            const rawLinksArr =
              (Array.isArray(found.links) && found.links) ||
              (Array.isArray(found.documentationLinks) && found.documentationLinks) ||
              (Array.isArray(found.resources) && found.resources) ||
              (Array.isArray(found.documentation) && found.documentation) ||
              (Array.isArray(found.docs) && found.docs) ||
              [];

            rawLinksArr.forEach((item, idx) => {
              if (typeof item === "string" && item.trim()) {
                docsGallery.push({
                  id: `custom-link-${idx}`,
                  title: `Resource #${idx + 1}`,
                  subtitle: item.replace(/^https?:\/\//, ""),
                  status: "ATTACHED",
                  statusType: "success",
                  url: item,
                });
              } else if (item && typeof item === "object") {
                const itemUrl = item.url || item.link || item.href || "";
                if (itemUrl) {
                  docsGallery.push({
                    id: `custom-link-${idx}`,
                    title: item.title || item.name || item.label || `Resource #${idx + 1}`,
                    subtitle: itemUrl.replace(/^https?:\/\//, ""),
                    status: "ATTACHED",
                    statusType: "success",
                    url: itemUrl,
                  });
                }
              }
            });

            // Format dates
            const formatDate = (dStr) => {
              if (!dStr) return "Jan 12, 2023";
              try {
                const d = new Date(dStr);
                return isNaN(d.getTime())
                  ? dStr
                  : d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
              } catch {
                return dStr;
              }
            };

            const createdDateStr = formatDate(found.createdAt);
            const updatedDateStr = formatDate(found.updatedAt);

            // Calculate doc coverage
            let coveredCount = 0;
            if (repoLink) coveredCount += 1;
            if (docsLink) coveredCount += 1;
            if (monitorLink) coveredCount += 1;
            if (deploymentLink) coveredCount += 1;
            if (found.description) coveredCount += 1;
            const calculatedDocCoverage = `${Math.min(100, Math.round((coveredCount / 5) * 100))}%`;

            const totalRels = realConsumers.length + realDependencies.length;
            const hasOwner = Boolean(found.ownerTeam || found.ownerRefCode);

            // Map Team details
            const teamName =
              (typeof found.ownerTeam === "object"
                ? found.ownerTeam?.teamName
                : null) ||
              found.ownerRefCode ||
              "Growth Team";

            setComponent({
              _id: found._id,
              name: found.name || "Untitled Component",
              type: found.type
                ? found.type.charAt(0).toUpperCase() + found.type.slice(1)
                : "Backend Service",
              status: found.status === "inactive" ? "Inactive" : "Active",
              environment:
                found.deploymentEnvironment ||
                found.environment ||
                "Production",
              version: found.version || "v2.4.0",
              createdDate: createdDateStr,
              lastUpdated: updatedDateStr,
              description:
                found.description ||
                "Provides specialized backend functionality for user traffic and core platform APIs.",
              tags:
                rawTagsList.length > 0
                  ? rawTagsList
                  : ["#backend", "#microservice", "#production"],
              metrics: {
                docCoverage: calculatedDocCoverage,
                totalRelationships: totalRels,
                dependenciesCount: realDependencies.length,
                consumersCount: realConsumers.length,
                ownerAssigned: hasOwner,
                isCritical:
                  found.status === "critical" ||
                  found.type === "api-gateway" ||
                  totalRels > 4,
              },
              techStack: {
                backend: backendTech,
                database: dbTech,
                cache: cacheTech,
                messaging: messagingTech,
                infrastructure: infraTech,
              },
              rawTechnologies: techArr,
              deployment: {
                cloudProvider: "AWS (us-east-1)",
                clusterNamespace: `${(found.deploymentEnvironment || "prod").toLowerCase()}-blue / recs`,
                repository: repoLink || "atlas/svc-rec",
                cicdPipeline: deploymentLink || "GitHub Actions",
              },
              dependencies: realDependencies,
              consumers: realConsumers,
              completeness: {
                ownerAssigned: hasOwner,
                documentation: Boolean(docsLink || found.description),
                apiSpec: Boolean(docsLink || found.type === "backend"),
                relationships: totalRels > 0,
                technologies: techArr.length > 0,
                tagged: rawTagsList.length > 0,
                adrAvailable: Boolean(docsLink?.includes("adr")),
                runbookAvailable: Boolean(monitorLink),
              },
              ownership: {
                teamName: teamName,
                vertical: "Data & Platform Vertical",
                slackChannel: `#${teamName.toLowerCase().replace(/\s+/g, "-")}`,
                leads: DEFAULT_COMPONENT_DATA.ownership.leads,
                assignedDevelopersCount: 4,
              },
              docs: docsGallery,
              systemMetadata: {
                componentId: found._id,
                project: activeProject?.name || "Atlas Core",
                workspace: activeWorkspace?.name || "Growth-Prod",
                createdBy: found.createdBy?.name || "System Admin",
                labels: rawTagsList.length > 0 ? rawTagsList : ["critical", "internal"],
              },
              activities: [
                {
                  time: `Created: ${createdDateStr}`,
                  action: `Component registered by System Admin`,
                  dotColor: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
                },
                {
                  time: `Updated: ${updatedDateStr}`,
                  action: `Metadata synced with active cluster`,
                  dotColor: "bg-[#10B981] shadow-[0_0_6px_#10B981]",
                },
                {
                  time: "Architecture Audit",
                  action: `Assigned to ${teamName}`,
                  dotColor: "bg-[#FEB685] shadow-[0_0_6px_#FEB685]",
                },
              ],
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch specific component details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchComponentDetails();
    return () => {
      isMounted = false;
    };
  }, [projectId, componentId, activeProject, activeWorkspace]);

  // Actions
  const handleRunImpactAnalysis = () => {
    if (workspaceId && projectId && componentId) {
      navigate(
        `/workspaces/${workspaceId}/projects/${projectId}/components/${componentId}/impact`
      );
    } else {
      navigate("/impact");
    }
  };

  const handleOpenInGraph = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/graph`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleEdit = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/wizard`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleOpenTopology = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/graph`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (projectId && componentId) {
        await api.delete(`/projects/${projectId}/components/${componentId}`);
      }
      toast.success("Component deleted successfully");
      setIsDeleteModalOpen(false);
      if (workspaceId && projectId) {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/components`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error deleting component:", err);
      toast.error("Failed to delete component");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectComponent = (comp) => {
    if (comp?.id && workspaceId && projectId) {
      navigate(
        `/workspaces/${workspaceId}/projects/${projectId}/components/${comp.id}`
      );
    } else {
      toast.info(`Viewing relationship: ${comp.name}`);
    }
  };

  const handleOpenDoc = (doc) => {
    if (doc?.url && doc.url !== "#" && doc.url.startsWith("http")) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
    } else if (doc?.url) {
      window.open(`https://${doc.url}`, "_blank", "noopener,noreferrer");
    } else {
      toast.info(
        `No link configured for ${doc.title}. You can attach one in the Setup Wizard.`
      );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Header */}
      <ComponentDetailsHeader
        workspaceName={activeWorkspace?.name}
        projectName={activeProject?.name}
        componentName={component.name}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex flex-col p-8 gap-6 w-full max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <ComponentHeroSection
          component={component}
          onRunImpactAnalysis={handleRunImpactAnalysis}
          onOpenInGraph={handleOpenInGraph}
          onEdit={handleEdit}
          onOpenTopology={handleOpenTopology}
          onDelete={handleDelete}
        />

        {/* 6 Metric KPI Cards */}
        <MetricCardsGrid metrics={component.metrics} />

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Identity & Metadata */}
            <IdentityMetadataCard
              description={component.description}
              tags={component.tags}
              metadata={{
                type: component.type,
                status: component.status,
                environment: component.environment,
                version: component.version,
                createdDate: component.createdDate,
                lastUpdated: component.lastUpdated,
              }}
            />

            {/* Technology Stack */}
            <TechnologyStackCard
              techStack={component.techStack}
              rawTechnologies={component.rawTechnologies}
            />

            {/* Deployment & Infrastructure */}
            <DeploymentInfrastructureCard
              deployment={component.deployment}
            />

            {/* Dependencies & Consumers */}
            <DependenciesConsumersCard
              dependencies={component.dependencies}
              consumers={component.consumers}
              onSelectComponent={handleSelectComponent}
            />
          </div>

          {/* Right Column (~35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Architecture Completeness */}
            <ArchitectureCompletenessCard
              completeness={component.completeness}
            />

            {/* Ownership */}
            <OwnershipCard ownership={component.ownership} />

            {/* Architecture Actions */}
            <ArchitectureActionsCard
              onHighlightInGraph={handleOpenInGraph}
              onTraceDependencies={handleRunImpactAnalysis}
              onGenerateReport={() => setIsExportModalOpen(true)}
              onExportProfile={() => setIsExportModalOpen(true)}
            />
          </div>
        </div>

        {/* Documentation Gallery */}
        <DocumentationGalleryCard
          docs={component.docs}
          onOpenDoc={handleOpenDoc}
        />

        {/* Bottom Split Row: System Metadata & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <SystemMetadataCard
              systemMetadata={{
                ...component.systemMetadata,
                project: activeProject?.name || component.systemMetadata.project,
                workspace:
                  activeWorkspace?.name || component.systemMetadata.workspace,
              }}
            />
          </div>
          <div className="lg:col-span-4">
            <ActivityTimelineCard activities={component.activities} />
          </div>
        </div>
      </main>

      {/* Action Modals */}
      <ImpactAnalysisModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        componentName={component.name}
        dependenciesCount={component.dependencies?.length || 3}
        consumersCount={component.consumers?.length || 5}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        componentData={component}
      />

      <DeleteComponentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        componentName={component.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
