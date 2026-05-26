import axios from "axios";
import { toast } from "sonner";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAuth,
} from "@/utils/auth";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const config = response.config;
    const method = config.method?.toLowerCase();
    
    // Auto success toast for mutations (POST, PUT, DELETE, etc.) if not bypassed and message exists
    if (
      method &&
      method !== "get" &&
      !config.skipToast &&
      response.data?.message
    ) {
      toast.success(response.data.message);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If the request was to login or refresh itself, do not try to refresh
      if (originalRequest.url?.includes("auth/login") || originalRequest.url?.includes("auth/refresh")) {
        clearAuth();
        return Promise.reject(error);
      }

      // If we are already refreshing, wait on the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Perform silent token refresh using standard axios instance
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (refreshResponse.data && refreshResponse.data.payload) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.payload;
            setAccessToken(accessToken);
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }
            
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
            isRefreshing = false;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          clearAuth();
          if (!window.location.pathname.endsWith("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        clearAuth();
        if (!window.location.pathname.endsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Auto error toast if not bypassed
    if (originalRequest && !originalRequest.skipToast) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default api;
