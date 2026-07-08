import { useEffect, useState } from "react";
import { Alert, Avatar, Box, Card, CardContent, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboardSummary, getProjectWorkload, getRecentActivity, getSubmissionStatus, getTasksTrend } from "../../api/dashboardApi";

// One accent family, used with intent rather than repeated identically across every card.
const teal = "#0f766e";
const statusColors = { Submitted: "#0f766e", Pending: "#f59e0b", Late: "#dc2626" };

const avatarPalette = ["#0f766e", "#0369a1", "#7c3aed", "#c2410c", "#4d7c0f"];
const initialsOf = (name = "") =>
    name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
const colorFor = (name = "") => avatarPalette[name.charCodeAt(0) % avatarPalette.length];

const SectionLabel = ({ children }) => (
    <Typography
        variant="overline"
        sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: 1.2, display: "block", mb: 0.5 }}
    >
        {children}
    </Typography>
);

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
    const pieTotal = pieData.reduce((sum, item) => sum + (item.value || 0), 0);

    const maxWorkload = Math.max(1, ...workload.map((item) => item.tasksCompleted || 0));

    const stats = [
        { label: "Total reports", value: summary?.totalReports ?? 0, icon: DescriptionOutlinedIcon, tint: "#0f766e" },
        { label: "Pending reports", value: summary?.pendingReports ?? 0, icon: HourglassEmptyRoundedIcon, tint: "#f59e0b" },
        { label: "Compliance rate", value: `${summary?.complianceRate ?? 0}%`, icon: VerifiedRoundedIcon, tint: "#0369a1" },
        { label: "Open blockers", value: summary?.openBlockers ?? 0, icon: ReportProblemRoundedIcon, tint: "#dc2626" },
    ];

    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Manager Dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Track compliance, project load, and recent team activity from one place.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Grid container spacing={3.5} justifyContent="center">
                {stats.map((item) => (
                    <Grid item xs={12} sm={6} lg={3} key={item.label}>
                        <Card
                            elevation={0}
                            sx={{
                                border: "1px solid rgba(15,23,42,0.08)",
                                borderRadius: 3,
                                height: "100%",
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" },
                            }}
                        >
                            <CardContent sx={{ py: 3, px: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, lineHeight: 1 }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            bgcolor: `${item.tint}1a`,
                                            color: item.tint,
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2.5,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <item.icon fontSize="small" />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2.5}>
                <Grid item xs={12} lg={7}>
                    <Paper elevation={0} sx={{ p: 3, height: 380, border: "1px solid rgba(15,23,42,0.08)", borderRadius: 3 }}>
                        <SectionLabel>Analytics</SectionLabel>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Tasks completed trend
                        </Typography>
                        {trend.length ? (
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.08)" />
                                    <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: "rgba(15,118,110,0.06)" }} />
                                    <Bar dataKey="tasksCompleted" fill={teal} radius={[8, 8, 0, 0]} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography color="text.secondary">No trend data yet.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Paper elevation={0} sx={{ p: 3, height: 380, border: "1px solid rgba(15,23,42,0.08)", borderRadius: 3 }}>
                        <SectionLabel>Analytics</SectionLabel>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                            Submission status
                        </Typography>
                        {pieTotal ? (
                            <>
                                <ResponsiveContainer width="100%" height="70%">
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={110} paddingAngle={3} strokeWidth={0}>
                                            {pieData.map((entry) => (
                                                <Cell key={entry.name} fill={statusColors[entry.name]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <Stack direction="row" justifyContent="center" spacing={2.5} sx={{ mt: 1 }}>
                                    {pieData.map((entry) => (
                                        <Stack key={entry.name} direction="row" spacing={0.75} alignItems="center">
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColors[entry.name] }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {entry.name} · {entry.value}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </>
                        ) : (
                            <Box sx={{ height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography color="text.secondary">No submissions recorded yet.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid item xs={12} lg={6}>
                    <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(15,23,42,0.08)", borderRadius: 3 }}>
                        <SectionLabel>Team</SectionLabel>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Project workload
                        </Typography>
                        <Stack spacing={2}>
                            {workload.length ? (
                                workload.map((item) => (
                                    <Box key={item.project}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                            <Typography fontWeight={600} variant="body2">
                                                {item.project}
                                            </Typography>
                                            <Typography color="text.secondary" variant="body2">
                                                {item.tasksCompleted} completed
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(item.tasksCompleted / maxWorkload) * 100}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: "rgba(15,118,110,0.1)",
                                                "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: teal },
                                            }}
                                        />
                                    </Box>
                                ))
                            ) : (
                                <Typography color="text.secondary">No workload data yet.</Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(15,23,42,0.08)", borderRadius: 3 }}>
                        <SectionLabel>Team</SectionLabel>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Recent activity
                        </Typography>
                        <Stack spacing={2}>
                            {activity.length ? (
                                activity.map((item, index) => (
                                    <Stack
                                        key={`${item.email}-${index}`}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Avatar sx={{ width: 34, height: 34, bgcolor: colorFor(item.user), fontSize: 13, fontWeight: 700 }}>
                                                {initialsOf(item.user)}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight={600} variant="body2">
                                                    {item.user}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.project}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                                            {item.date}
                                        </Typography>
                                    </Stack>
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
