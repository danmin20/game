import axios from "axios";

const accessToken = localStorage.getItem("access-token") ?? "";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: accessToken,
  },
});
