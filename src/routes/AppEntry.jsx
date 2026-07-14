import useAuth from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function AppEntry() {
    const {user, loading} = useAuth()
    console.log("App Entry", user)
    if(loading) {
        
        return (
            <div className="flex items-center justify-center h-screen">
                <span>Authorizing you in...</span>
            </div>
        )
    }

    return user?.user?.onboarding === "completed"
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/new-workspace" replace />;
}