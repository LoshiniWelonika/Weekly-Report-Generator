import api from "./axios";

export const createReport = (data) => api.post("/reports", data);

export const getMyReports = () => api.get("/reports/my");

export const getAllReports = () => api.get("/reports");

export const getReportById = (id) => api.get(`/reports/${id}`);

export const updateReport = (id, data) => api.put(`/reports/${id}`, data);

export const submitReport = (id) => api.put(`/reports/${id}/submit`);