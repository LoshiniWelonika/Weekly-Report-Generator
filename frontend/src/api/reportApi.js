import API from "./axios";


// Create weekly report
export const createReport = (data) => {

    return API.post(
        "/reports",
        data
    );

};


// Get my reports
export const getMyReports = () => {

    return API.get(
        "/reports/my"
    );

};


// Get single report
export const getReportById = (id) => {

    return API.get(
        `/reports/${id}`
    );

};


// Update report
export const updateReport = (id, data) => {

    return API.put(
        `/reports/${id}`,
        data
    );

};


// Submit report
export const submitReport = (id) => {

    return API.patch(
        `/reports/${id}/submit`
    );

};