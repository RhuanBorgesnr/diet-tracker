import axios from "axios";
import { clearToken, getToken } from "../utils/login";
import { API_HOST } from "./consts";

const api = axios.create({
  baseURL: API_HOST,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `JWT ${token}`,
    };
  } else {
    if (config.headers) {
      delete config.headers.Authorization;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
