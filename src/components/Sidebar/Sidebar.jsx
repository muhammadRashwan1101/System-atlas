import { RxGear } from "react-icons/rx";
import logo from "../../assets/system_atlas_logo.png";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineLogout, MdOutlineDomain } from "react-icons/md";
import { PiGraph } from "react-icons/pi";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { IoAnalyticsOutline } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import { FaFolderOpen } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import useContextNavigator from "../../hooks/useContextNavigator";
import useAuth from "../../context/AuthContext";
import WorkspaceSelectionModal from "../Navigation/WorkspaceSelectionModal";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    currentWorkspaceId,
    currentProjectId,
    navigateToWorkspace,
    navigateToProject,
    modalState,
    closeModal,
  } = useContextNavigator();

  const userRole = String(user?.role || user?.user?.role || "user").toLowerCase();
  const isDashboardRole = userRole === "admin" || userRole === "manager";
  const dashboardPath = userRole === "manager" ? "/manager-dashboard" : "/dashboard";

  // Active state checkers based strictly on the authoritative URL
  const isGraphActive = location.pathname.endsWith("/graph");
  const isComponentsActive =
    location.pathname.endsWith("/components") ||
    location.pathname.includes("/wizard") ||
    (currentWorkspaceId &&
      currentProjectId &&
      location.pathname ===
        `/workspaces/${currentWorkspaceId}/projects/${currentProjectId}`);
  const isNewProjectActive = location.pathname.endsWith("/new-project");
  const isWorkspaceActive =
    currentWorkspaceId &&
    !currentProjectId &&
    location.pathname === `/workspaces/${currentWorkspaceId}` &&
    !isNewProjectActive;
  const isDashboardActive = location.pathname === "/dashboard" || location.pathname === "/manager-dashboard";
  const isTeamsActive =
    location.pathname.startsWith("/teams/") ||
    location.pathname.endsWith("/create-team");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between bg-(--main-bg) border-r border-(--border)/30 w-20 min-h-screen p-4 shrink-0">
        <div className="flex flex-col items-center justify-center w-full mb-5 space-y-4">
          <div className="flex flex-col items-center justify-center w-30 p-5">
            <Link to="/app">
              <img src={logo} alt="Logo" className="w-13 h-auto rounded-lg" />
            </Link>
          </div>

          {/* Dashboard (Admin & Manager only) */}
          {isDashboardRole && (
            <Link
              to={dashboardPath}
              title={userRole === "manager" ? "Manager Dashboard" : "Admin Dashboard"}
              className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
                isDashboardActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }`}
            >
              <MdOutlineDashboard className="w-5 h-5" />
            </Link>
          )}

          {/* Architecture Graph (Project-scoped) */}
          <button
            type="button"
            onClick={() => navigateToProject("graph")}
            title="Architecture Graph"
            className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
              isGraphActive
                ? "bg-(--primary) text-(--text-primary)"
                : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
            }`}
          >
            <PiGraph className="w-5 h-5" />
          </button>

          {/* Components Management (Project-scoped) */}
          <button
            type="button"
            onClick={() => navigateToProject("components")}
            title="Components Management"
            className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
              isComponentsActive
                ? "bg-(--primary) text-(--text-primary)"
                : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
            }`}
          >
            <IoExtensionPuzzleSharp className="w-5 h-5" />
          </button>

          {/* Analytics / Telemetry */}
          <Link
            to="/dashboard"
            title="Telemetry & Impact Analysis"
            className="p-3 rounded transition-all ease-in-out duration-250 hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
          >
            <div className="w-5 h-5">
              <PiStarFourFill className="relative top-[13px] -right-[9.5px] scale-x-[-1] w-[7px] h-2 text-(--text) translate-y-[-13px] translate-x-[2px]" />
              <PiStarFourFill className="relative top-[8px] right-[1px] scale-x-[-1] w-[5px] h-2 text-(--text) translate-y-[-13px] translate-x-[2px]" />
              <IoAnalyticsOutline className="w-5 h-5 text-(--text) translate-y-[-13px] translate-x-[1px]" />
            </div>
          </Link>

          {/* New Project (Workspace-scoped) */}
          <button
            type="button"
            onClick={() => navigateToWorkspace("new-project")}
            title="New Project"
            className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
              isNewProjectActive
                ? "bg-(--primary) text-(--text-primary)"
                : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
            }`}
          >
            <FaFolderOpen className="w-5 h-5" />
          </button>

          {/* Workspace Hub */}
          <button
            type="button"
            onClick={() => navigateToWorkspace("")}
            title="Workspace Directory"
            className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
              isWorkspaceActive
                ? "bg-(--primary) text-(--text-primary)"
                : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
            }`}
          >
            <MdOutlineDomain className="w-5 h-5" />
          </button>

          {/* Teams Governance */}
          <Link
            to={`/workspaces/${currentWorkspaceId}/create-team`}
            title="Teams & Governance"
            className={`p-3 rounded transition-all ease-in-out duration-250 cursor-pointer ${
              isTeamsActive
                ? "bg-(--primary) text-(--text-primary)"
                : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
            }`}
          >
            <HiUserGroup className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex flex-col gap-6 items-center">
          {/* Logout Button right above Settings */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded text-(--text) hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 ease-in-out cursor-pointer"
          >
            <MdOutlineLogout className="text-2xl" />
          </button>
          <Link to="/profile-settings" title="Settings">
            <RxGear className="text-2xl text-(--text) hover:text-white transition-all duration-150 ease-in-out" />
          </Link>
          <Link to="/profile" title="Profile">
            <div className="bg-(--primary) p-2.5 rounded-full">
              <FaUser className="text-(--text-primary)" />
            </div>
          </Link>
        </div>
      </div>

      {/* Centralized Workspace/Project Picker & Empty Projects Modal */}
      <WorkspaceSelectionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        subtitle={modalState.subtitle}
        items={modalState.items}
        type={modalState.type}
        workspaceName={modalState.workspaceName}
        onSelect={modalState.onSelect}
        onCreateProject={modalState.onCreateProject}
        onSwitchWorkspace={modalState.onSwitchWorkspace}
        onGoDashboard={modalState.onGoDashboard}
      />
    </>
  );
}

