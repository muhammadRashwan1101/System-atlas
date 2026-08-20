import { useState, useCallback } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import useWorkspace from "../context/WorkspaceContext";

export default function useContextNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaces, fetchProjects, refreshWorkspaces } = useWorkspace();

  // Extract current URL context
  const wsMatch = matchPath("/workspaces/:workspaceId/*", location.pathname);
  const prjMatch = matchPath(
    "/workspaces/:workspaceId/projects/:projectId/*",
    location.pathname
  );

  const currentWorkspaceId = wsMatch?.params?.workspaceId || null;
  const currentProjectId = prjMatch?.params?.projectId || null;

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    items: [],
    type: "workspace", // "workspace" | "project" | "empty_projects"
    workspaceName: "",
    onSelect: () => {},
    onCreateProject: () => {},
    onSwitchWorkspace: () => {},
    onGoDashboard: () => {},
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Helper to open the workspace selection list modal
  const openWorkspaceSelector = useCallback(
    (onWorkspaceSelected) => {
      setModalState({
        isOpen: true,
        type: "workspace",
        title: "Select Workspace",
        subtitle: "Choose a workspace to proceed:",
        items: workspaces,
        workspaceName: "",
        onSelect: onWorkspaceSelected,
      });
    },
    [workspaces]
  );

  // Helper to open the "No Projects Found in Workspace" modal with 3 CTAs
  const openNoProjectsModal = useCallback(
    (targetWsId, targetWsName) => {
      setModalState({
        isOpen: true,
        type: "empty_projects",
        title: "No Projects in this Workspace",
        subtitle:
          "Architecture components and graph explorers require an active project.",
        items: [],
        workspaceName: targetWsName || "Selected Workspace",
        onCreateProject: () => {
          navigate(`/workspaces/${targetWsId}/new-project`);
        },
        onSwitchWorkspace: () => {
          openWorkspaceSelector((selectedWs) => {
            navigate(`/workspaces/${selectedWs._id}`);
          });
        },
        onGoDashboard: () => {
          navigate("/dashboard");
        },
      });
    },
    [navigate, openWorkspaceSelector]
  );

  // Centralized Workspace-dependent Navigation
  const navigateToWorkspace = useCallback(
    async (subpath = "") => {
      // 1. If workspaceId exists in URL, preserve it
      if (currentWorkspaceId) {
        navigate(
          `/workspaces/${currentWorkspaceId}${subpath ? `/${subpath}` : ""}`
        );
        return;
      }

      // 2. Fetch/resolve accessible workspaces
      let list = workspaces;
      if (!list || list.length === 0) {
        list = await refreshWorkspaces();
      }

      // 0 workspaces -> empty/access state
      if (!list || list.length === 0) {
        navigate("/new-workspace");
        return;
      }

      // 1 workspace -> automatic navigation
      if (list.length === 1) {
        navigate(`/workspaces/${list[0]._id}${subpath ? `/${subpath}` : ""}`);
        return;
      }

      // > 1 workspaces -> explicit user selection modal
      setModalState({
        isOpen: true,
        type: "workspace",
        title: "Select Workspace",
        subtitle: "Multiple workspaces available. Choose one to proceed:",
        items: list,
        workspaceName: "",
        onSelect: (selectedWs) => {
          navigate(
            `/workspaces/${selectedWs._id}${subpath ? `/${subpath}` : ""}`
          );
        },
      });
    },
    [currentWorkspaceId, workspaces, refreshWorkspaces, navigate]
  );

  // Centralized Project-dependent Navigation
  const navigateToProject = useCallback(
    async (subpath = "components") => {
      // 1. If both workspaceId and projectId exist in URL, preserve them
      if (currentWorkspaceId && currentProjectId) {
        navigate(
          `/workspaces/${currentWorkspaceId}/projects/${currentProjectId}/${subpath}`
        );
        return;
      }

      // 2. If workspaceId is missing, resolve workspace first
      let targetWsId = currentWorkspaceId;

      if (!targetWsId) {
        let wsList = workspaces;
        if (!wsList || wsList.length === 0) {
          wsList = await refreshWorkspaces();
        }

        if (!wsList || wsList.length === 0) {
          navigate("/new-workspace");
          return;
        }

        if (wsList.length === 1) {
          targetWsId = wsList[0]._id;
        } else {
          // Open workspace selection modal, then proceed to project selection
          setModalState({
            isOpen: true,
            type: "workspace",
            title: "Select Workspace",
            subtitle: "Choose a workspace to view its architecture projects:",
            items: wsList,
            workspaceName: "",
            onSelect: async (selectedWs) => {
              const prjList = await fetchProjects(selectedWs._id);
              if (!prjList || prjList.length === 0) {
                openNoProjectsModal(selectedWs._id, selectedWs.name);
              } else if (prjList.length === 1) {
                navigate(
                  `/workspaces/${selectedWs._id}/projects/${prjList[0]._id}/${subpath}`
                );
              } else {
                // Open project modal for that workspace
                setModalState({
                  isOpen: true,
                  type: "project",
                  title: "Select Project",
                  subtitle: `Available projects in ${selectedWs.name}:`,
                  items: prjList,
                  workspaceName: selectedWs.name,
                  onSelect: (selectedPrj) => {
                    navigate(
                      `/workspaces/${selectedWs._id}/projects/${selectedPrj._id}/${subpath}`
                    );
                  },
                });
              }
            },
          });
          return;
        }
      }

      const targetWsName =
        (workspaces || []).find((w) => w._id === targetWsId)?.name || "";

      // 3. Resolve projects for targetWsId
      const prjList = await fetchProjects(targetWsId);

      // If 0 projects found in this workspace, display the clear 3-CTA modal instead of vague redirect!
      if (!prjList || prjList.length === 0) {
        openNoProjectsModal(targetWsId, targetWsName);
        return;
      }

      if (prjList.length === 1) {
        navigate(
          `/workspaces/${targetWsId}/projects/${prjList[0]._id}/${subpath}`
        );
        return;
      }

      // > 1 projects -> prompt user with project selector modal
      setModalState({
        isOpen: true,
        type: "project",
        title: "Select Project",
        subtitle: `Choose an active project in ${targetWsName || "workspace"} to open:`,
        items: prjList,
        workspaceName: targetWsName,
        onSelect: (selectedPrj) => {
          navigate(
            `/workspaces/${targetWsId}/projects/${selectedPrj._id}/${subpath}`
          );
        },
      });
    },
    [
      currentWorkspaceId,
      currentProjectId,
      workspaces,
      refreshWorkspaces,
      fetchProjects,
      navigate,
      openNoProjectsModal,
    ]
  );

  return {
    currentWorkspaceId,
    currentProjectId,
    navigateToWorkspace,
    navigateToProject,
    openNoProjectsModal,
    openWorkspaceSelector,
    modalState,
    closeModal,
  };
}
