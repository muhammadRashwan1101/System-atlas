import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ================= Context =================
import AuthProvider from "./context/AuthProvider";

// ================= Layouts / Routes =================
import ProtectedRoute from "./routes/ProtectedRoute";
import AppEntry from "./routes/AppEntry";

// ================= Pages =================
import LandingPage from "./Pages/LandingPage/LandingPage";
import Login from "./Pages/Login/Login";
import WorkspaceCreation from "./Pages/Workspace/WorkspaceCreation";
import ProjectCreation from "./Pages/ProjectCreation/ProjectCreation";
import EmptyGraph from "./Pages/EmptyGraph/EmptyGraph";
import Profile from "./Pages/profile/Profile";
import ProfileSettings from "./Pages/profile/ProfileSettings";

// ================= Team =================
import CreateTeam from "./components/CreateTeam/CreateTeam";
import TeamsManagement from "./components/TeamManagmentDashboard/TeamsManagement";

// ================= Layouts =================
import MainLayout from "./layouts/MainLayout";
import InnerLayout from "./layouts/InnerLayout";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* ================= Public Routes ================= */}

        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route path="/login" element={<Login />} />


        {/* ================= Protected Routes ================= */}

        <Route
          element={
            <ProtectedRoute>
              <InnerLayout />
            </ProtectedRoute>
          }
        >
          {/* App */}
          <Route path="/app" element={<AppEntry />} />

          {/* Workspace */}
          <Route
            path="/new-workspace"
            element={<WorkspaceCreation />}
          />

          {/* Project */}
          <Route
            path="/workspaces/:workspaceId/new-project"
            element={<ProjectCreation />}
          />

          {/* Teams */}
          <Route
            path="/create-team"
            element={<CreateTeam />}
          />

          <Route
            path="/dashboard"
            element={<TeamsManagement />}
          />

          {/* Graph */}
          <Route
            path="/graph"
            element={<EmptyGraph />}
          />

          {/* Profile */}
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
        </Route>

      </Routes>

      {/* ================= Toast ================= */}

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
);