
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import MainLayout from "./layout/MainLayout";
import InnerLayout from "./layout/InnerLayout";

import LandingPage from "./Pages/LandingPage/LandingPage";
import WorkspaceCreation from "./Pages/CreateWorkspace/CreateWorkspace";
import ProjectCreation from "./Pages/CreatProject/CreatProject";
import Login from "./Pages/Auth/Login/Login";

import CreateTeam from "./Pages/Create Team/CreateTeam";

import EmptyGraph from "./Pages/EmptyGraph/EmptyGraph";

import AuthProvider from "./context/AuthProvider";
import WorkspaceProvider from "./context/WorkspaceProvider";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppEntry from "./routes/AppEntry";

import Profile from "./Pages/profile/Profile";
import ProfileSettings from "./Pages/profile/ProfileSettings";

import SetupWizard from "./Pages/SetupWizard/SetupWizard";

import ComponentsManagement from "./Pages/ComponentsManagement/ComponentsManagement";

import WorkspaceGateway from "./Pages/WorkspaceGateway/WorkspaceGateway";

import TeamsManagement from "./Pages/Teams/TeamsManagement";

import TeamDetails from "./components/TeamManagmentDashboard/TeamDetails";


createRoot(document.getElementById("root")).render(

  <StrictMode>

    <AuthProvider>

      <BrowserRouter>

        <WorkspaceProvider>

          <Routes>

            {/* =====================================================
                PUBLIC ROUTES
            ===================================================== */}

            <Route
              path="/"
              element={<MainLayout />}
            >
              <Route
                index
                element={<LandingPage />}
              />
            </Route>


            {/* =====================================================
                LOGIN
            ===================================================== */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* =====================================================
                PROTECTED ROUTES
            ===================================================== */}

            <Route
              element={
                <ProtectedRoute>
                  <InnerLayout />
                </ProtectedRoute>
              }
            >

              {/* =================================================
                  APP
              ================================================= */}

              <Route
                path="/app"
                element={<AppEntry />}
              />


              {/* =================================================
                  CREATE WORKSPACE
              ================================================= */}

              <Route
                path="/new-workspace"
                element={<WorkspaceCreation />}
              />


              {/* =================================================
                  PROFILE
              ================================================= */}

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/profile-settings"
                element={<ProfileSettings />}
              />

              <Route
                path="/profile-settings/edit"
                element={<ProfileSettings />}
              />


              {/* =====================================================
                  =====================================================
                  TEAM MANAGEMENT - INDEPENDENT ROUTES
                  
                  IMPORTANT:
                  Teams are NOT dependent on workspace/project.
                  
                  Main Team Routes:
                  
                  /teams
                  /teams/create
                  /teams/:id
                  =====================================================
                  ===================================================== */}

              {/* ================================
                  Teams Dashboard
                  ================================ */}

              <Route
                path="/teams"
                element={<TeamsManagement />}
              />


              {/* ================================
                  Create Team
                  ================================ */}

              <Route
                path="/teams/create"
                element={<CreateTeam />}
              />


              {/* ================================
                  Team Details
                  ================================ */}

              <Route
                path="/teams/:id"
                element={<TeamDetails />}
              />


              {/* =====================================================
                  WORKSPACE LEVEL
              ===================================================== */}

              <Route path="/workspaces/:workspaceId">

                {/* ================================
                    Workspace Home
                ================================ */}

                <Route
                  index
                  element={<WorkspaceGateway />}
                />


                {/* ================================
                    Workspace Dashboard
                ================================ */}

                <Route
                  path="dashboard"
                  element={<WorkspaceGateway />}
                />


                {/* =================================================
                    OPTIONAL WORKSPACE TEAM ROUTES

                    These can remain if you still want
                    teams accessible from a workspace.

                    But the MAIN Team Management should use:

                    /teams
                    /teams/create
                    /teams/:id
                ================================================= */}

                <Route
                  path="teams"
                  element={<TeamsManagement />}
                />

                <Route
                  path="create-team"
                  element={<CreateTeam />}
                />

                <Route
                  path="teams/:id"
                  element={<TeamDetails />}
                />


                {/* ================================
                    Create Project
                ================================ */}

                <Route
                  path="new-project"
                  element={<ProjectCreation />}
                />


                {/* =================================================
                    PROJECT LEVEL
                ================================================= */}

                <Route path="projects/:projectId">

                  {/* Project Home */}

                  <Route
                    index
                    element={<ComponentsManagement />}
                  />


                  {/* Components */}

                  <Route
                    path="components"
                    element={<ComponentsManagement />}
                  />


                  {/* Setup Wizard */}

                  <Route
                    path="wizard"
                    element={<SetupWizard />}
                  />


                  {/* Specific Wizard */}

                  <Route
                    path="wizard/:wizardId"
                    element={<SetupWizard />}
                  />


                  {/* Graph */}

                  <Route
                    path="graph"
                    element={<EmptyGraph />}
                  />

                </Route>

              </Route>

            </Route>

          </Routes>


          {/* =====================================================
              TOAST NOTIFICATIONS
          ===================================================== */}

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="dark"
            toastClassName="atlas-toast"
          />

        </WorkspaceProvider>

      </BrowserRouter>

    </AuthProvider>

  </StrictMode>
);

