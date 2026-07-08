import api from "./axios";


// Get all projects
export const getProjects = async () => {

    const response = await api.get(
        "/projects"
    );

    return response.data;

};