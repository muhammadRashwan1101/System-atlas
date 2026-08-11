import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export default function useUserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
     
      const res = await api.get("/profile/stats/overview");
      setStats(res.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadStats = async () => {
    await fetchStats();;
  };
    loadStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}