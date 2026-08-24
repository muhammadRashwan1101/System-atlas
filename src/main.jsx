import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./layout/MainLayout";
import InnerLayout from "./layout/InnerLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import WorkspaceCreation from "./Pages/CreateWorkspace/CreateWorkspace";
import ProjectCreation from "./Pages/CreatProject/CreatProject";
import Login from "./Pages/Auth/Login/Login";
import CreateTeam from "./Pages/Create Team/CreateTeam";
import EmptyGraph from "./Pages/EmptyGraph/EmptyGraph";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./context/AuthProvider";
import WorkspaceProvider from "./context/WorkspaceProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppEntry from "./routes/AppEntry";
import Profile from "./Pages/profile/Profile";
import ProfileSettings from "./Pages/profile/ProfileSettings";
import SetupWizard from "./Pages/SetupWizard/SetupWizard";
import ComponentsManagement from "./Pages/ComponentsManagement/ComponentsManagement";
import ComponentDetails from "./Pages/ComponentDetails/ComponentDetails";
import WorkspaceGateway from "./Pages/WorkspaceGateway/WorkspaceGateway";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ManagerDashboard from "./Pages/ManagerDashboard/ManagerDashboard";
import ImpactAnalysis from "./Pages/ImpactAnalysis/ImpactAnalysis";
import InvitationAcceptance from "./Pages/Auth/Invitation/InvitationAcceptance";
import SetNewPassword from "./Pages/Auth/SetNewPassword/SetNewPassword";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <WorkspaceProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/invite" element={<InvitationAcceptance />} />
            <Route path="/invite/:token" element={<InvitationAcceptance />} />
            <Route
              path="/set-new-password"
              element={
                <ProtectedRoute requirePasswordChange={true}>
                  <SetNewPassword />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <InnerLayout />
                </ProtectedRoute>
              }
            >
              {/* App Level */}
              <Route path="/app" element={<AppEntry />} />
              <Route path="/new-workspace" element={<WorkspaceCreation />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/profile-settings/edit"
                element={<ProfileSettings />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["manager", "admin"]}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/impact" element={<ImpactAnalysis />} />

              {/* Workspace level */}
              <Route path="/workspaces/:workspaceId">
                <Route index element={<WorkspaceGateway />} />
                <Route path="new-project" element={<ProjectCreation />} />
                <Route path="create-team" element={<CreateTeam />} />
                {/* Project Level */}

                <Route path="projects/:projectId">
                  <Route index element={<ComponentsManagement />} />
                  <Route path="components" element={<ComponentsManagement />} />
                  <Route
                    path="components/:componentId"
                    element={<ComponentDetails />}
                  />
                  <Route
                    path="components/:componentId/impact"
                    element={<ImpactAnalysis />}
                  />
                  <Route path="wizard" element={<SetupWizard />} />
                  <Route path="wizard/:wizardId" element={<SetupWizard />} />
                  <Route path="graph" element={<EmptyGraph />} />
                  <Route path="impact" element={<ImpactAnalysis />} />
                </Route>
              </Route>
            </Route>
          </Routes>

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
