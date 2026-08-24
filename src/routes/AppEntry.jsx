import { useEffect } from "react";
import useAuth from "../context/AuthContext";
import useWorkspace from "../context/WorkspaceContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function AppEntry() {
  const { user, loading: authLoading } = useAuth();
  const { refreshWorkspaces, fetchProjects } = useWorkspace();
  const navigate = useNavigate();

  const mustChangePassword = Boolean(
    user?.mustChangePassword || user?.user?.mustChangePassword
  );

  // Extract onboarding status prioritizing nested user object then top-level
  const onboardingVal =
    user?.user?.onboarding !== undefined
      ? user.user.onboarding
      : user?.user?.onboardingStatus !== undefined
      ? user.user.onboardingStatus
      : user?.onboarding !== undefined
      ? user.onboarding
      : user?.onboardingStatus || "pending";

  const isOnboarded = onboardingVal === "completed";
  const rawRole = user?.role || user?.user?.role || "user";
  const userRole = String(rawRole).toLowerCase();

  useEffect(() => {
    let isMounted = true;

    // Only resolve workspace context for Tech Lead and Regular User roles once onboarded and password activated
    if (
      !authLoading &&
      user &&
      !mustChangePassword &&
      isOnboarded &&
      (userRole === "techlead" || userRole === "user")
    ) {
      const resolve = async () => {
        try {
          const wsList = (await refreshWorkspaces()) || [];
          if (!isMounted) return;

          if (wsList.length === 0) {
            navigate("/new-workspace", { replace: true });
            return;
          }

          if (wsList.length === 1) {
            const singleWsId = wsList[0]._id || wsList[0].id;
            try {
              const projects = (await fetchProjects(singleWsId)) || [];
              if (!isMounted) return;

              if (projects && projects.length === 1) {
                const singlePrjId = projects[0]._id || projects[0].id;
                // Directly enter Graph Explorer when exactly 1 workspace + 1 project
                navigate(
                  `/workspaces/${singleWsId}/projects/${singlePrjId}/graph`,
                  { replace: true }
                );
                return;
              }
              // Multiple or 0 projects -> navigate to project selector / gateway
              navigate(`/workspaces/${singleWsId}`, { replace: true });
            } catch {
              if (isMounted) {
                navigate(`/workspaces/${singleWsId}`, { replace: true });
              }
            }
          } else {
            // Multiple workspaces -> route to Workspace Gateway / selection
            navigate(`/workspaces/${wsList[0]._id || wsList[0].id}`, {
              replace: true,
            });
          }
        } catch {
          if (isMounted) {
            navigate("/new-workspace", { replace: true });
          }
        }
      };

      resolve();
    }

    return () => {
      isMounted = false;
    };
  }, [
    authLoading,
    user,
    mustChangePassword,
    isOnboarded,
    userRole,
    refreshWorkspaces,
    fetchProjects,
    navigate,
  ]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F17] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400 tracking-wider">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 1. Mandatory Password Setup for Temporary/Invited Credentials
  if (mustChangePassword) {
    return <Navigate to="/set-new-password" replace />;
  }

  // 2. Check Onboarding State
  if (!isOnboarded) {
    return <Navigate to="/new-workspace" replace />;
  }

  // 3. Role-Based Destinations
  if (userRole === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (userRole === "manager") {
    return <Navigate to="/manager-dashboard" replace />;
  }

  // 4. For Tech Lead & User, display loading while asynchronous context resolution completes
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F17] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono text-slate-400 tracking-wider">
          Loading architecture context...
        </span>
      </div>
    </div>
  );
}