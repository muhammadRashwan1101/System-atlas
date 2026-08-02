import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = Array.isArray(error.response?.data?.msg)
      ? error.response.data.msg[0]
      : error.response?.data?.msg ||
        "Unable to connect to the server";

    toast.error(message);

    return Promise.reject({
      ...error,
      message,
    });
  }
);

export default api;