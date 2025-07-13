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

export const fetchLicenses = async () => {
    const res = await api.get("/licenses");
    return res.data;
};

export const createLicense = async (data) => {
    const res = await api.post("/licenses", data);
    return res.data;
};

export const updateLicense = async (id, data) => {
    const res = await api.put(`/licenses/${id}`, data);
    return res.data;
};

export const deleteLicense = async (id) => {
    const res = await api.delete(`/licenses/${id}`);
    return res.data;
};

// Tickets
export const fetchTickets = async () => {
    const res = await api.get("/tickets");
    return res.data;
};

export const createTicket = async (ticketData) => {
    const res = await api.post("/tickets", ticketData);
    return res.data;
};

export const updateTicket = async (id, ticketData) => {
    const res = await api.put(`/tickets/${id}`, ticketData);
    return res.data;
};

export const deleteTicket = async (id) => {
    const res = await api.delete(`/tickets/${id}`);
    return res.data;
};

export const fetchITStaff = async () => {
    const res = await api.get("/users/it"); // adjust if route is different
    return res.data;
};

export default api;