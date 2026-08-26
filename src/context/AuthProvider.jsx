import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/current-user");
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await api.patch("/auth/complete-onboarding");
    } catch (e) {
      console.warn("Could not patch backend onboarding status:", e);
    }
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        onboarding: "completed",
        onboardingStatus: "completed",
        user: prev.user
          ? {
              ...prev.user,
              onboarding: "completed",
              onboardingStatus: "completed",
            }
          : prev.user,
      };
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/auth/current-user")
      .then((res) => {
        if (isMounted) setUser(res.data);
      })
      .catch((err) => {
        console.error("Auth session expired or invalid:", err);
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        getCurrentUser,
        completeOnboarding,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
