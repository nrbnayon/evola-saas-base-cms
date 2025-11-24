// src/lib/api-client.js
import axios from "axios";
import { getCookie, setCookie, removeAuthTokens } from "./cookie-utils";
const API_URL = import.meta.env.VITE_API_URL || "http://10.10.12.10:3000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("access_token");
    // const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5NjM1NDk4LCJpYXQiOjE3NTk1NDkwOTgsImp0aSI6IjNlNDE5YTdjOTc2NjQwMDhhOGM3ZmNlMWM0Y2RmZjUwIiwidXNlcl9pZCI6IjE4In0.FDNFP5Hm_7dtyN3FDqhAuAdDgHb0cSaL7Ty5SbrAPE4';
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    if (error?.response?.data?.message.includes("You are not authorized")) {
      console.error("Invalid token detected, clearing auth state");
      removeAuthTokens();
      clearAuthState();
    }
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh-token")
      ) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return await axios(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) {
          clearAuthState();
          return Promise.reject(error);
        }

        try {
          const response = await apiClient.get(
            `/auth/refresh-token?refreshToken=${refreshToken}`
          );
          const { accessToken } = response.data.data;
          setCookie("accessToken", accessToken, { maxAge: 30 * 24 * 60 * 60 });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return axios(originalRequest);
        } catch (err) {
          processQueue(err, null);
          clearAuthState();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

function clearAuthState() {
  removeAuthTokens();
}

export default apiClient;