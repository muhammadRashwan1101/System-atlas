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
import WorkspaceGateway from "./Pages/WorkspaceGateway/WorkspaceGateway";

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
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/dashboard" element={<h1>Dashboard</h1>} />

              {/* Workspace level */}
              <Route path="/workspaces/:workspaceId">
                <Route index element={<WorkspaceGateway />} />
                <Route path="new-project" element={<ProjectCreation />} />
                <Route path="create-team" element={<CreateTeam />} />
                {/* Project Level */}

                <Route path="projects/:projectId">
                  <Route index element={<ComponentsManagement />} />
                  <Route path="components" element={<ComponentsManagement />} />
                  <Route path="wizard" element={<SetupWizard />} />
                  <Route path="wizard/:wizardId" element={<SetupWizard />} />
                  <Route path="graph" element={<EmptyGraph />} />
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
