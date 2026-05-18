import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true, // Good: This ensures HttpOnly cookies (like refresh tokens) are sent
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      console.log("TOKEN IS EXPIRED");
      // 1. Skip refresh for login attempts
      if (originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // 2. ONLY enter this block if we haven't retried yet
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Set flag ONLY here

        try {
          console.log("REFRESHING TOKEN......");
          const response = await axios.post(
            "http://localhost:8080/api/v1/auth/refresh",
            {},
            { withCredentials: true },
          );

          const { data } = response.data;
          const newAccessToken = data.accessToken;

          localStorage.setItem("token", newAccessToken);

          console.log("TOKEN REFRESH SUCCESSFULLY......");

          window.dispatchEvent(
            new CustomEvent("onTokenRefresh", {
              detail: newAccessToken,
            }),
          );

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          window.dispatchEvent(new Event("onTokenExpired"));
          return Promise.reject(refreshError);
        }
      }
    }

    const message = error.response?.data?.message || "Something went wrong";
    error.customMessage = message;
    return Promise.reject(error);
  },
);

export default api;
