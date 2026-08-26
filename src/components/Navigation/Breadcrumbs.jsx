import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FiChevronRight, FiFolder, FiBox, FiLayers, FiShare2, FiHome, FiGrid } from "react-icons/fi";
import useWorkspace from "../../context/WorkspaceContext";

/**
 * Universal Breadcrumbs Component
 * Automatically determines and renders breadcrumb path based on current route parameters
 * (workspaceId, projectId, componentId) and active workspace/project names.
 * Also supports optional manual overrides via props.
 */
export default function Breadcrumbs({
  workspaceName: propWorkspaceName,
  projectName: propProjectName,
  componentName: propComponentName,
  extraItems = [],
  className = "",
}) {
  const { workspaceId, projectId, componentId } = useParams();
  const location = useLocation();
  const { workspaces = [], projectsByWorkspace = {} } = useWorkspace() || {};

  // Resolve current workspace name
  const currentWorkspace = useMemo(() => {
    if (!workspaceId) return null;
    return workspaces.find((w) => w._id === workspaceId || w.id === workspaceId) || null;
  }, [workspaces, workspaceId]);

  const resolvedWorkspaceName =
    propWorkspaceName ||
    currentWorkspace?.name ||
    currentWorkspace?.workspaceName ||
    (workspaceId ? "Workspace" : null);

  // Resolve current project name
  const currentProject = useMemo(() => {
    if (!workspaceId || !projectId) return null;
    const projectList = projectsByWorkspace[workspaceId] || [];
    return projectList.find((p) => p._id === projectId || p.id === projectId) || null;
  }, [projectsByWorkspace, workspaceId, projectId]);

  const resolvedProjectName =
    propProjectName ||
    currentProject?.name ||
    currentProject?.projectName ||
    (projectId ? "Project" : null);

  // Build breadcrumb items based on route and context
  const breadcrumbItems = useMemo(() => {
    if (extraItems && extraItems.length > 0) {
      return extraItems;
    }

    const items = [];
    const path = location.pathname;

    // 1. Workspace Level
    if (workspaceId && resolvedWorkspaceName) {
      items.push({
        id: "workspace",
        label: resolvedWorkspaceName,
        icon: FiFolder,
        link: `/workspaces/${workspaceId}`,
        isCurrent: !projectId && !path.includes("/new-project") && !path.includes("/teams/new"),
      });
    }

    // Workspace sub-pages without a project
    if (workspaceId && !projectId) {
      if (path.includes("/new-project")) {
        items.push({
          id: "new-project",
          label: "New Project",
          icon: FiBox,
          link: null,
          isCurrent: true,
        });
      } else if (path.includes("/teams/new")) {
        items.push({
          id: "new-team",
          label: "Create Team",
          icon: FiLayers,
          link: null,
          isCurrent: true,
        });
      }
    }

    // 2. Project Level
    if (workspaceId && projectId && resolvedProjectName) {
      items.push({
        id: "project",
        label: resolvedProjectName,
        icon: FiBox,
        link: `/workspaces/${workspaceId}/projects/${projectId}/graph`,
        isCurrent: path.endsWith(`/projects/${projectId}`) || path.endsWith(`/projects/${projectId}/`),
      });

      // Project Sub-views
      if (path.includes("/graph")) {
        items.push({
          id: "graph",
          label: "Graph Explorer",
          icon: FiShare2,
          link: null,
          isCurrent: true,
        });
      } else if (path.includes("/components")) {
        items.push({
          id: "components",
          label: "Components",
          icon: FiGrid,
          link: `/workspaces/${workspaceId}/projects/${projectId}/components`,
          isCurrent: !componentId,
        });

        // Component Detail Sub-view
        if (componentId) {
          const compLabel = propComponentName || "Component Details";
          items.push({
            id: "component-detail",
            label: compLabel,
            icon: FiLayers,
            link: path.includes("/impact")
              ? `/workspaces/${workspaceId}/projects/${projectId}/components/${componentId}`
              : null,
            isCurrent: !path.includes("/impact"),
          });

          if (path.includes("/impact")) {
            items.push({
              id: "impact",
              label: "Impact Analysis",
              icon: FiShare2,
              link: null,
              isCurrent: true,
            });
          }
        }
      } else if (path.includes("/wizard")) {
        items.push({
          id: "wizard",
          label: "Node Setup Wizard",
          icon: FiLayers,
          link: null,
          isCurrent: true,
        });
      }
    }

    // 3. Fallback for non-workspace pages
    if (items.length === 0) {
      if (path.includes("/dashboard")) {
        items.push({
          id: "dashboard",
          label: "Dashboard",
          icon: FiHome,
          link: "/dashboard",
          isCurrent: true,
        });
      } else if (path.includes("/teams")) {
        items.push({
          id: "teams",
          label: "Teams",
          icon: FiLayers,
          link: "/teams",
          isCurrent: true,
        });
      } else if (path.includes("/profile-settings")) {
        items.push({
          id: "profile-settings",
          label: "Account Settings",
          icon: FiHome,
          link: "/profile-settings",
          isCurrent: true,
        });
      } else if (path.includes("/profile")) {
        items.push({
          id: "profile",
          label: "User Profile",
          icon: FiHome,
          link: "/profile",
          isCurrent: true,
        });
      }
    }

    return items;
  }, [
    location.pathname,
    workspaceId,
    resolvedWorkspaceName,
    projectId,
    resolvedProjectName,
    componentId,
    propComponentName,
    extraItems,
  ]);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs font-mono select-none overflow-x-auto py-1 ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <div key={item.id || index} className="flex items-center gap-1.5 shrink-0">
            {index > 0 && (
              <FiChevronRight className="text-slate-600 text-xs shrink-0" aria-hidden="true" />
            )}

            {item.link && !isLast ? (
              <Link
                to={item.link}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-400 hover:text-[#ADC6FF] hover:bg-white/5 transition-all duration-150 group"
              >
                {Icon && (
                  <Icon className="text-xs text-slate-500 group-hover:text-[#ADC6FF] transition-colors" />
                )}
                <span className="truncate max-w-[160px]">{item.label}</span>
              </Link>
            ) : (
              <span
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-semibold tracking-wide ${
                  isLast
                    ? "text-white bg-[#161922] border border-[#2B3240] shadow-sm"
                    : "text-slate-300"
                }`}
                aria-current={isLast ? "page" : undefined}
              >
                {Icon && (
                  <Icon
                    className={`text-xs ${
                      isLast ? "text-[#ADC6FF]" : "text-slate-400"
                    }`}
                  />
                )}
                <span className="truncate max-w-[200px]">{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
