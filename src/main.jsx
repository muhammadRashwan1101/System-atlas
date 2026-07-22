import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layout/MainLayout'
import InnerLayout from './layout/InnerLayout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import WorkspaceCreation from "./Pages/CreateWorkspace/CreateWorkspace"
import ProjectCreation from './Pages/CreatProject/CreatProject'
import Login from "./Pages/Auth/Login/Login"
import { ToastContainer } from 'react-toastify';
import AuthProvider from "./context/AuthProvider"
import ProtectedRoute from "./routes/ProtectedRoute"
import AppEntry from "./routes/AppEntry"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><InnerLayout /></ProtectedRoute>}>
            <Route path="/app" element={<AppEntry />} />
            <Route path="/new-workspace" element={<WorkspaceCreation />} />
            <Route
              path="workspaces/:workspaceId/new-project"
              element={<ProjectCreation />}
            />
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
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
  </StrictMode>,
)
