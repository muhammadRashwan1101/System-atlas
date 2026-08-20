import { createContext, useContext } from "react";

export const WorkspaceContext = createContext({
  workspaces: [],
  projects: [],
  loadingWorkspaces: false,
  loadingProjects: false,
  error: null,
  refreshWorkspaces: () => {},
  fetchProjects: () => {},
  refreshProjects: () => {},
});

export default function useWorkspace() {
  return useContext(WorkspaceContext);
}
