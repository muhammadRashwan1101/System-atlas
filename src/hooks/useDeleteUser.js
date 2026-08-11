import { useState, useCallback } from "react";
import api from "../api/axios";

export default function useDeleteUser() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (userId) => {
    try {
      setDeleting(true);
      setError(null);
      await api.delete(`/profile/${userId}`);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteUser, deleting, error };
}