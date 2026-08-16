import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://eco-rentels-api.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eco_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /*
     * If the backend says the token is invalid/expired,
     * remove the old token.
     */

    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem("eco_token");
    }

    return Promise.reject(error);
  }
);


export default api;