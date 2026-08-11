import { useState, useCallback } from "react";
import api from "../api/axios";

export default function useSuspendUser() {
  const [suspending, setSuspending] = useState(false);
  const [error, setError] = useState(null);

  const suspendUser = useCallback(async (userId) => {
    try {
      setSuspending(true);
      setError(null);
      const res = await api.patch(`/profile/${userId}/suspend`);
      return res.data.accountStatus; 
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
      return null;
    } finally {
      setSuspending(false);
    }
  }, []);

  return { suspendUser, suspending, error };
}