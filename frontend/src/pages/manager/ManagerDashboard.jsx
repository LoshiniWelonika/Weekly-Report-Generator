import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboardSummary, getProjectWorkload, getRecentActivity, getSubmissionStatus, getTasksTrend } from "../../api/dashboardApi";

const colors = ["#0f766e", "#14b8a6", "#f97316", "#0f172a"];

const ManagerDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [workload, setWorkload] = useState([]);
    const [activity, setActivity] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [summaryResponse, trendResponse, statusResponse, workloadResponse, activityResponse] = await Promise.all([
                    getDashboardSummary(),
                    getTasksTrend(),
                    getSubmissionStatus(),
                    getProjectWorkload(),
                    getRecentActivity(),
                ]);

                setSummary(summaryResponse.data.data);
                setTrend(trendResponse.data.data);
                setSubmissionStatus(statusResponse.data.data);
                setWorkload(workloadResponse.data.data);
                setActivity(activityResponse.data.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load dashboard");
            }
        };

        loadDashboard();
    }, []);

    const pieData = submissionStatus
        ? [
              { name: "Submitted", value: submissionStatus.submitted },
              { name: "Pending", value: submissionStatus.pending },
              { name: "Late", value: submissionStatus.late },
          ]
        : [];

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">Manager Dashboard</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Track compliance, project load, and recent team activity from one place.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Grid container spacing={3}>
                {[
                    { label: "Total reports", value: summary?.totalReports ?? 0 },
                    { label: "Pending reports", value: summary?.pendingReports ?? 0 },
                    { label: "Compliance rate", value: `${summary?.complianceRate ?? 0}%` },
                    { label: "Open blockers", value: summary?.openBlockers ?? 0 },
                ].map((item) => (
                    <Grid item xs={12} sm={6} lg={3} key={item.label}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">{item.label}</Typography>
                                <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={7}>
                    <Paper sx={{ p: 3, height: 360 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Tasks completed trend
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="tasksCompleted" fill="#0f766e" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Paper sx={{ p: 3, height: 360 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Submission status
                        </Typography>
                        <ResponsiveContainer width="100%" height="88%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={4}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={entry.name} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Project workload
                        </Typography>
                        <Stack spacing={1.5}>
                            {workload.length ? (
                                workload.map((item) => (
                                    <Box key={item.project} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <Typography fontWeight={600}>{item.project}</Typography>
                                        <Typography color="text.secondary">{item.tasksCompleted} completed tasks</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography color="text.secondary">No workload data yet.</Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Recent activity
                        </Typography>
                        <Stack spacing={1.5}>
                            {activity.length ? (
                                activity.map((item, index) => (
                                    <Box key={`${item.email}-${index}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <Box>
                                            <Typography fontWeight={600}>{item.user}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.project}
                                            </Typography>
                                        </Box>
                                        <Typography color="text.secondary">{item.date}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography color="text.secondary">No activity yet.</Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default ManagerDashboard;