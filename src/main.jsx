import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layout/MainLayout'
import InnerLayout from './layout/InnerLayout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import WorkspaceCreation from "./Pages/Auth/CreateWorkspace/CreateWorkspace"
import Login from "./Pages/Auth/Login/Login"

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
    </BrowserRouter>
  </StrictMode>,
)
