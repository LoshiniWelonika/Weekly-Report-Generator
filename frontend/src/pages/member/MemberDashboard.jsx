import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import { Link } from "react-router-dom";
import { getMyReports } from "../../api/reportApi";

const MemberDashboard = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                const response = await getMyReports();
                setReports(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load reports");
            }
        };

        loadReports();
    }, []);

    const totalReports = reports.length;
    const submittedReports = reports.filter((report) => report.status === "SUBMITTED").length;
    const pendingReports = totalReports - submittedReports;

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">Member Dashboard</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Submit weekly work, keep drafts moving, and review your report history.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Grid container spacing={3}>
                {[
                    { label: "Total reports", value: totalReports },
                    { label: "Submitted", value: submittedReports },
                    { label: "Pending", value: pendingReports },
                ].map((item) => (
                    <Grid item xs={12} md={4} key={item.label}>
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

            <Paper sx={{ p: 3, background: "linear-gradient(135deg, rgba(15,118,110,0.08), rgba(249,115,22,0.08))" }}>
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between">
                    <Box>
                        <Typography variant="h5">Start a new report</Typography>
                        <Typography color="text.secondary">Fill in the week, tasks, blockers, and hours worked.</Typography>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button component={Link} to="/member/reports/create" variant="contained" startIcon={<AddIcon />}>
                            Create report
                        </Button>
                        <Button component={Link} to="/member/reports" variant="outlined" startIcon={<HistoryIcon />}>
                            View history
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
};

export default MemberDashboard;