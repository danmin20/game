import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});