import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createProject, deleteProject, getProjects, updateProject } from "../../api/projectApi";

const emptyProject = { name: "", description: "", status: "ACTIVE" };

const ManagerProjects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState(emptyProject);

    const loadProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to load projects");
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const openCreateDialog = () => {
        setEditingProject(null);
        setFormData(emptyProject);
        setDialogOpen(true);
    };

    const openEditDialog = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name || "",
            description: project.description || "",
            status: project.status || "ACTIVE",
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingProject) {
                await updateProject(editingProject._id, formData);
            } else {
                await createProject(formData);
            }

            setDialogOpen(false);
            setEditingProject(null);
            setFormData(emptyProject);
            await loadProjects();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to save project");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            await loadProjects();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to delete project");
        }
    };

    return (
        <Stack spacing={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Box>
                    <Typography variant="h4">Projects</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Create and manage active team projects.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
                    New project
                </Button>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Stack spacing={2}>
                {projects.map((project) => (
                    <Card key={project._id}>
                        <CardContent>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
                                <Box>
                                    <Typography variant="h6">{project.name}</Typography>
                                    <Typography color="text.secondary">{project.description || "No description"}</Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <IconButton onClick={() => openEditDialog(project)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(project._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingProject ? "Edit project" : "New project"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Project name" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} />
                        <TextField label="Description" value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} multiline minRows={3} />
                        <TextField select label="Status" value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}>
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default ManagerProjects;