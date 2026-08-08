import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import AuthProvider from "./context/AuthProvider";
import MainLayout from "./layout/MainLayout";
import InnerLayout from "./layout/InnerLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppEntry from "./routes/AppEntry";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Login from "./Pages/Auth/Login/Login";
import WorkspaceCreation from "./Pages/CreateWorkspace/CreateWorkspace";
import ProjectCreation from "./Pages/CreatProject/CreatProject";
import CreateTeam from "./Pages/Create Team/CreateTeam";
import EmptyGraph from "./Pages/EmptyGraph/EmptyGraph";
import TeamsManagement from "./Pages/Teams/TeamsManagement";
// import Profile from "./Pages/profile/Profile";
// import ProfileSettings from "./Pages/profile/ProfileSettings";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="/app" element={<AppEntry />} />

            <Route
              path="/new-workspace"
              element={<WorkspaceCreation />}
            />

            <Route
              path="/workspaces/:workspaceId/new-project"
              element={<ProjectCreation />}
            />

            <Route path="/create-team" element={<CreateTeam />} />

            {/* <Route path="/profile" element={<Profile />} />
            <Route
              path="/profile-settings"
              element={<ProfileSettings />}
            /> */}

            <Route path="/graph" element={<EmptyGraph />} />
            <Route path="/dashboard" element={<TeamsManagement/>} />
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
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);