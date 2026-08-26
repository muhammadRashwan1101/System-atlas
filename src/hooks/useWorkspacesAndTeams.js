import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useWorkspacesAndTeams() {
  const [workspaces, setWorkspaces] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [workspacesRes, teamsRes] = await Promise.all([
          api.get("/workspaces", { signal: controller.signal }),
          api.get("/teams", { signal: controller.signal }),
        ]);

        setWorkspaces(workspacesRes.data.workspaces || []);
        setTeams(teamsRes.data.data || []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to load workspace/team options", err);
        }
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
    return () => controller.abort();
  }, []);

  return { workspaces, teams, loadingOptions };
}
