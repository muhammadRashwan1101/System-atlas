import { useState, useCallback } from "react";
import api from "../api/axios";

export default function useCreateUser() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useCallback(async (payload) => {
    try {
      setCreating(true);
      setError(null);
      const res = await api.post("/profile", payload);
      return res.data.user;
    } catch (err) {
      const message = Array.isArray(err.response?.data?.msg)
        ? err.response.data.msg[0]
        : err.response?.data?.msg;
      setError(message || "Unable to connect to the server");
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  return { createUser, creating, error };
}
