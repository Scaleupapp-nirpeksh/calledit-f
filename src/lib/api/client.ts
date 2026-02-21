import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/lib/utils/storage";
import type { AuthResponse } from "@/lib/types/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mutex to prevent concurrent refresh calls
let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshToken(): Promise<AuthResponse> {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token");
  const { data } = await axios.post<AuthResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refresh_token: rt }
  );
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  return data;
}

// On 401, attempt token refresh then retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken().finally(() => {
            refreshPromise = null;
          });
        }
        const data = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
