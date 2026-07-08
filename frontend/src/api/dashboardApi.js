import api from "./axios";

const buildQuery = (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            searchParams.set(key, value);
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
};

export const getDashboardSummary = (params) => api.get(`/dashboard/summary${buildQuery(params)}`);

export const getTasksTrend = (params) => api.get(`/dashboard/tasks-trend${buildQuery(params)}`);

export const getSubmissionStatus = (params) => api.get(`/dashboard/submission-status${buildQuery(params)}`);

export const getProjectWorkload = (params) => api.get(`/dashboard/project-workload${buildQuery(params)}`);

export const getRecentActivity = (params) => api.get(`/dashboard/recent-activity${buildQuery(params)}`);