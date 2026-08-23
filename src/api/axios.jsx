import axios from "axios";
import { toast } from "react-toastify";

export const SERVER_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("Axios Error:", error);

    if (!error.response) {
      toast.error("Unable to connect to the server");
      return Promise.reject(error);
    }

    const message =
      Array.isArray(error.response.data?.msg)
        ? error.response.data.msg.join(", ")
        : error.response.data?.msg ||
          error.response.data?.message ||
          "Request failed";

    toast.error(message);

    return Promise.reject(error);
  }
);
  


export default api;