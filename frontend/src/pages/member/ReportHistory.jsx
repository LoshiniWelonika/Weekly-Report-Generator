import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { Link as RouterLink } from "react-router-dom";
import { getMyReports, submitReport } from "../../api/reportApi";

const ReportHistory = () => {
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

    const handleSubmitReport = async (id) => {
        try {
            await submitReport(id);
            const response = await getMyReports();
            setReports(response.data);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to submit report");
        }
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">My Reports</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Review drafts, edit unfinished reports, and submit completed work.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Week</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report._id} hover>
                                <TableCell>
                                    {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{report.project?.name || "No project"}</TableCell>
                                <TableCell>
                                    <Chip label={report.status} color={report.status === "SUBMITTED" ? "success" : "warning"} size="small" />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        {report.status !== "SUBMITTED" ? (
                                            <>
                                                <Button component={RouterLink} to={`/member/reports/${report._id}/edit`} size="small" startIcon={<EditIcon />}>
                                                    Edit
                                                </Button>
                                                <Button size="small" variant="contained" startIcon={<SendIcon />} onClick={() => handleSubmitReport(report._id)}>
                                                    Submit
                                                </Button>
                                            </>
                                        ) : null}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default ReportHistory;