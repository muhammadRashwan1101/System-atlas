import useAuth from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = null,
  requirePasswordChange = false,
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F17] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400 tracking-wider">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const mustChangePassword = Boolean(
    user.mustChangePassword || user.user?.mustChangePassword
  );

  // If user requires mandatory password setup and tries to access normal routes -> redirect to /set-new-password
  if (mustChangePassword && !requirePasswordChange) {
    return <Navigate to="/set-new-password" replace />;
  }

  // If already activated user tries to access /set-new-password -> redirect to /app
  if (!mustChangePassword && requirePasswordChange) {
    return <Navigate to="/app" replace />;
  }

  // Extract role from top-level or nested user
  const rawRole = user.role || user.user?.role || "user";
  const userRole = String(rawRole).toLowerCase();

  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());
    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/app" replace />;
    }
  }

  return children;
}