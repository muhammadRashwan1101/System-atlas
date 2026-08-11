import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export default function useAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setUsers(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
    await fetchUsers();
  };
  loadUsers()
  }, [fetchUsers]);

  const updateUserLocally = useCallback((userId, updates) => {
  setUsers((prev) =>
    prev.map((u) => (u._id === userId ? { ...u, ...updates } : u))
  );
}, []);
  return { users, loading, error, refetch: fetchUsers ,updateUserLocally };
}