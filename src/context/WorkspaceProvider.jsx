import { useState, useEffect, useCallback, useMemo } from "react";
import { WorkspaceContext } from "./WorkspaceContext";
import useAuth from "./AuthContext";
import api from "../api/axios";

export default function WorkspaceProvider({ children }) {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [projectsByWorkspace, setProjectsByWorkspace] = useState({});
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all accessible workspaces for the current authenticated user
  const fetchWorkspaces = useCallback(async () => {
    if (!user) return [];
    setLoadingWorkspaces(true);
    setError(null);
    try {
      const res = await api.get("/workspaces");
      const list = res.data?.workspaces || res.data?.data || res.data || [];
      const normalized = Array.isArray(list) ? list : [];
      setWorkspaces(normalized);
      return normalized;
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
      setError("Failed to fetch accessible workspaces");
      setWorkspaces([]);
      return [];
    } finally {
      setLoadingWorkspaces(false);
    }
  }, [user]);

  // Fetch projects for a specific workspaceId
  const fetchProjects = useCallback(async (workspaceId) => {
    if (!workspaceId) return [];
    setLoadingProjects(true);
    try {
      const res = await api.get(`/workspaces/${workspaceId}/projects`);
      const list = res.data?.projects || res.data?.data || res.data || [];
      const normalized = Array.isArray(list) ? list : [];
      setProjectsByWorkspace((prev) => ({
        ...prev,
        [workspaceId]: normalized,
      }));
      return normalized;
    } catch (err) {
      console.error(`Failed to fetch projects for workspace ${workspaceId}:`, err);
      setProjectsByWorkspace((prev) => ({
        ...prev,
        [workspaceId]: [],
      }));
      return [];
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    api
      .get("/workspaces")
      .then((res) => {
        const list = res.data?.workspaces || res.data?.data || res.data || [];
        if (isMounted && Array.isArray(list)) {
          setWorkspaces(list);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load initial workspaces:", err);
          setWorkspaces([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const value = useMemo(
    () => ({
      workspaces: user ? workspaces : [],
      projectsByWorkspace: user ? projectsByWorkspace : {},
      loadingWorkspaces,
      loadingProjects,
      error,
      refreshWorkspaces: fetchWorkspaces,
      fetchProjects,
      refreshProjects: fetchProjects,
    }),
    [
      user,
      workspaces,
      projectsByWorkspace,
      loadingWorkspaces,
      loadingProjects,
      error,
      fetchWorkspaces,
      fetchProjects,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
