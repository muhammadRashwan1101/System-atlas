import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export default function useMyProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile/me");
      setUser(res.data.user);
      setStats(res.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const loadProfile = async () => {
    await fetchProfile();
  };

  loadProfile();
}, [fetchProfile]);

  return { user, stats, loading, error, refetch: fetchProfile };
}