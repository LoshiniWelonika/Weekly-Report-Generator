import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createReport, getReportById, updateReport } from "../../api/reportApi";
import { getProjects } from "../../api/projectApi";

const emptyForm = {
    weekStart: "",
    weekEnd: "",
    project: "",
    tasksCompleted: "",
    tasksPlanned: "",
    blockers: "",
    hoursWorked: "",
    notes: "",
};

const toTextarea = (items = []) => items.join("\n");

const toList = (value) =>
    value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

const WeeklyReportForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [projectsResponse] = await Promise.all([getProjects()]);
                setProjects(projectsResponse.data);

                if (isEdit) {
                    const reportResponse = await getReportById(id);
                    const report = reportResponse.data;

                    setFormData({
                        weekStart: report.weekStart ? new Date(report.weekStart).toISOString().split("T")[0] : "",
                        weekEnd: report.weekEnd ? new Date(report.weekEnd).toISOString().split("T")[0] : "",
                        project: report.project?._id || "",
                        tasksCompleted: toTextarea(report.tasksCompleted || []),
                        tasksPlanned: toTextarea(report.tasksPlanned || []),
                        blockers: toTextarea(report.blockers || []),
                        hoursWorked: report.hoursWorked ?? "",
                        notes: report.notes || "",
                    });
                }
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load report data");
            }
        };

        loadInitialData();
    }, [id, isEdit]);

    const handleChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                tasksCompleted: toList(formData.tasksCompleted),
                tasksPlanned: toList(formData.tasksPlanned),
                blockers: toList(formData.blockers),
                hoursWorked: Number(formData.hoursWorked) || 0,
            };

            if (isEdit) {
                await updateReport(id, payload);
            } else {
                await createReport(payload);
            }

            navigate("/member/reports", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || (isEdit ? "Failed to update report" : "Failed to create report"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">{isEdit ? "Edit Weekly Report" : "Create Weekly Report"}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Keep the form short and use one line per task or blocker.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField label="Week start" type="date" name="weekStart" value={formData.weekStart} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                                <TextField label="Week end" type="date" name="weekEnd" value={formData.weekEnd} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                            </Stack>

                            <TextField select label="Project" name="project" value={formData.project} onChange={handleChange} required>
                                {projects.map((project) => (
                                    <MenuItem key={project._id} value={project._id}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Tasks completed"
                                name="tasksCompleted"
                                value={formData.tasksCompleted}
                                onChange={handleChange}
                                multiline
                                minRows={4}
                                helperText="One task per line"
                            />
                            <TextField
                                label="Tasks planned"
                                name="tasksPlanned"
                                value={formData.tasksPlanned}
                                onChange={handleChange}
                                multiline
                                minRows={4}
                                helperText="One task per line"
                            />
                            <TextField
                                label="Blockers"
                                name="blockers"
                                value={formData.blockers}
                                onChange={handleChange}
                                multiline
                                minRows={3}
                                helperText="One blocker per line"
                            />

                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField label="Hours worked" type="number" name="hoursWorked" value={formData.hoursWorked} onChange={handleChange} required />
                                <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline minRows={3} />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? "Saving..." : isEdit ? "Update report" : "Create report"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default WeeklyReportForm;