
import { RxGear } from "react-icons/rx";
import logo from "../../assets/system_atlas_logo.png";
import { FaUser } from "react-icons/fa";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { MdOutlineDashboard } from "react-icons/md";
import { PiGraph } from "react-icons/pi";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { IoAnalyticsOutline } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import { FaFolderOpen } from "react-icons/fa6";
import { MdOutlineDomain } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";

import useContextNavigator from "../../hooks/useContextNavigator";
import WorkspaceSelectionModal from "../Navigation/WorkspaceSelectionModal";


export default function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    currentWorkspaceId,
    currentProjectId,
    navigateToWorkspace,
    navigateToProject,
    modalState,
    closeModal,
  } = useContextNavigator();


  // =====================================================
  // Workspace Base Path
  // =====================================================

  const workspaceBase = currentWorkspaceId
    ? `/workspaces/${currentWorkspaceId}`
    : null;


  // =====================================================
  // Active States
  // =====================================================

  const isDashboardActive =
    currentWorkspaceId &&
    (
      location.pathname === `${workspaceBase}` ||
      location.pathname === `${workspaceBase}/dashboard`
    );


  const isGraphActive =
    currentProjectId &&
    location.pathname ===
      `${workspaceBase}/projects/${currentProjectId}/graph`;


  const isComponentsActive =
    currentProjectId &&
    (
      location.pathname ===
        `${workspaceBase}/projects/${currentProjectId}` ||

      location.pathname ===
        `${workspaceBase}/projects/${currentProjectId}/components` ||

      location.pathname.includes(
        `${workspaceBase}/projects/${currentProjectId}/wizard`
      )
    );


  const isNewProjectActive =
    currentWorkspaceId &&
    location.pathname ===
      `${workspaceBase}/new-project`;


  const isWorkspaceActive =
    currentWorkspaceId &&
    location.pathname === workspaceBase;


  // =====================================================
  // TEAMS ACTIVE
  //
  // IMPORTANT:
  // Teams are now independent from Workspace.
  //
  // Active routes:
  //
  // /teams
  // /teams/create
  // /teams/:id
  // =====================================================

  const isTeamsActive =
    location.pathname === "/teams" ||
    location.pathname === "/teams/create" ||
    location.pathname.startsWith("/teams/");


  // =====================================================
  // Navigation Helpers
  // =====================================================

  const goToDashboard = () => {

    if (!currentWorkspaceId) {
      return;
    }

    navigateToWorkspace("dashboard");
  };


  // =====================================================
  // GO TO TEAMS
  //
  // IMPORTANT:
  // Do NOT use navigateToWorkspace here.
  //
  // Teams are independent.
  // =====================================================

  const goToTeams = () => {
    navigate("/teams");
  };


  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          items-center
          justify-between
          bg-(--main-bg)
          border-r
          border-(--border)/30
          w-20
          min-h-screen
          p-4
          shrink-0
        "
      >

        {/* ===================================================
            MAIN NAVIGATION
        =================================================== */}

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            w-full
            mb-5
            space-y-4
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              w-30
              p-5
            "
          >

            {currentWorkspaceId ? (

              <Link to={workspaceBase}>

                <img
                  src={logo}
                  alt="System Atlas Logo"
                  className="w-13 h-auto rounded-lg"
                />

              </Link>

            ) : (

              <Link to="/app">

                <img
                  src={logo}
                  alt="System Atlas Logo"
                  className="w-13 h-auto rounded-lg"
                />

              </Link>

            )}

          </div>


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <button
            type="button"
            onClick={goToDashboard}
            disabled={!currentWorkspaceId}
            title={
              currentWorkspaceId
                ? "Dashboard"
                : "Select a workspace first"
            }
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250

              ${
                isDashboardActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }

              ${
                !currentWorkspaceId
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <MdOutlineDashboard className="w-5 h-5" />

          </button>


          {/* =================================================
              ARCHITECTURE GRAPH
          ================================================= */}

          <button
            type="button"
            onClick={() => {

              if (currentProjectId) {
                navigateToProject("graph");
              }

            }}
            disabled={!currentProjectId}
            title={
              currentProjectId
                ? "Architecture Graph"
                : "Select a project first"
            }
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250

              ${
                isGraphActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }

              ${
                !currentProjectId
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <PiGraph className="w-5 h-5" />

          </button>


          {/* =================================================
              COMPONENTS MANAGEMENT
          ================================================= */}

          <button
            type="button"
            onClick={() => {

              if (currentProjectId) {
                navigateToProject("components");
              }

            }}
            disabled={!currentProjectId}
            title={
              currentProjectId
                ? "Components Management"
                : "Select a project first"
            }
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250

              ${
                isComponentsActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }

              ${
                !currentProjectId
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <IoExtensionPuzzleSharp className="w-5 h-5" />

          </button>


          {/* =================================================
              ANALYTICS / TELEMETRY
          ================================================= */}

          <button
            type="button"
            onClick={goToDashboard}
            disabled={!currentWorkspaceId}
            title="Telemetry & Impact Analysis"
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250
              hover:bg-(--primary)
              hover:text-(--text-primary)
              text-(--text)

              ${
                !currentWorkspaceId
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <div className="w-5 h-5">

              <PiStarFourFill
                className="
                  relative
                  top-[13px]
                  -right-[9.5px]
                  scale-x-[-1]
                  w-[7px]
                  h-2
                  text-(--text)
                  translate-y-[-13px]
                  translate-x-[2px]
                "
              />

              <PiStarFourFill
                className="
                  relative
                  top-[8px]
                  right-[1px]
                  scale-x-[-1]
                  w-[5px]
                  h-2
                  text-(--text)
                  translate-y-[-13px]
                  translate-x-[2px]
                "
              />

              <IoAnalyticsOutline
                className="
                  w-5
                  h-5
                  text-(--text)
                  translate-y-[-13px]
                  translate-x-[1px]
                "
              />

            </div>

          </button>


          {/* =================================================
              NEW PROJECT
          ================================================= */}

          <button
            type="button"
            onClick={() => {

              if (currentWorkspaceId) {
                navigateToWorkspace("new-project");
              }

            }}
            disabled={!currentWorkspaceId}
            title={
              currentWorkspaceId
                ? "New Project"
                : "Select a workspace first"
            }
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250

              ${
                isNewProjectActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }

              ${
                !currentWorkspaceId
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <FaFolderOpen className="w-5 h-5" />

          </button>


          {/* =================================================
              WORKSPACE HUB
          ================================================= */}

          <button
            type="button"
            onClick={() => navigateToWorkspace("")}
            title="Workspace Directory"
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250
              cursor-pointer

              ${
                isWorkspaceActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }
            `}
          >

            <MdOutlineDomain className="w-5 h-5" />

          </button>


          {/* =================================================
              TEAMS & GOVERNANCE
              
              INDEPENDENT FROM WORKSPACE
          ================================================= */}

          <button
            type="button"
            onClick={goToTeams}
            title="Teams & Governance"
            className={`
              p-3
              rounded
              transition-all
              ease-in-out
              duration-250
              cursor-pointer

              ${
                isTeamsActive
                  ? "bg-(--primary) text-(--text-primary)"
                  : "hover:bg-(--primary) hover:text-(--text-primary) text-(--text)"
              }
            `}
          >

            <HiUserGroup className="w-5 h-5" />

          </button>

        </div>


        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-8
            items-center
          "
        >

          {/* =================================================
              SETTINGS
          ================================================= */}

          <Link
            to="/profile-settings"
            title="Settings"
          >

            <RxGear
              className="
                text-2xl
                text-(--text)
                hover:text-white
                transition-all
                duration-150
                ease-in-out
              "
            />

          </Link>


          {/* =================================================
              PROFILE
          ================================================= */}

          <Link
            to="/profile"
            title="Profile"
          >

            <div
              className="
                bg-(--primary)
                p-2.5
                rounded-full
              "
            >

              <FaUser className="text-(--text-primary)" />

            </div>

          </Link>

        </div>

      </div>


      {/* =====================================================
          WORKSPACE / PROJECT MODAL
      ===================================================== */}

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

