import axios from "axios";
import { getAuthToken } from "../utils/auth.jsx";

// Use environment variables with proper fallback for production
const getBaseURL = () => {
  // If VITE_API_URL is set, use it (for local development or custom deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production on Vercel, use relative paths
  if (import.meta.env.PROD) {
    return "/api";
  }
  
  // Default for local development
  return "http://localhost:4000/api";
};

const API_URL = `${getBaseURL()}/auth`;

// Configure axios to use auth token
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    password,
  });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const getUser = async () => {
  const response = await axios.get(`${API_URL}/user`);
  return response.data.user;
};

// TOTP Service API calls
export const getServices = async () => {
  const response = await axios.get(`${API_URL}/services`);
  return response.data;
};

export const registerService = async (name, secret, issuer = "") => {
  const response = await axios.post(`${API_URL}/register-service`, {
    name,
    secret,
    issuer,
  });
  return response.data;
};

export const registerServiceScan = async (otpauth_url) => {
  const response = await axios.post(`${API_URL}/register-service-scan`, {
    otpauth_url,
  });
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await axios.delete(`${API_URL}/services/${serviceId}`);
  return response.data;
};

export const verifyCode = async (serviceId, token) => {
  const response = await axios.post(`${API_URL}/verify`, {
    serviceId,
    token,
  });
  return response.data;
};
