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

export default api;