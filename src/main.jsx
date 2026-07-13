import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layout/MainLayout'
import InnerLayout from './layout/InnerLayout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import WorkspaceCreation from "./Pages/CreateWorkspace/CreateWorkspace"
import Login from "./Pages/Auth/Login/Login"
import { ToastContainer } from 'react-toastify';
import AuthProvider from "./context/AuthProvider"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/new-workspace" element={<InnerLayout />}>
              <Route index element={<WorkspaceCreation />} />
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
