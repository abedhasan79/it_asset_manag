import axios from "axios";
import API_BASE_URL from "../config";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Auto-attach token (optional)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getCurrentUser = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const getAssets = async () => {
  const res = await api.get("/assets");
  return res.data;
};

export const createAsset = async (data) => {
  const res = await api.post("/assets", data);
  return res.data;
};

export const updateAsset = async (id, data) => {
  const res = await api.put(`/assets/${id}`, data);
  return res.data;
};

export const deleteAsset = async (id) => {
  const res = await api.delete(`/assets/${id}`);
  return res.data;
};

export default api;