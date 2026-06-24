import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layout/MainLayout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import SignUp from "./Pages/Auth/SignUp/SignUp"
import Login from "./Pages/Auth/Login/Login"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
