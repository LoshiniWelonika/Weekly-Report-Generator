import { useEffect, useState } from "react";
import { Alert, Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { getAllReports } from "../../api/reportApi";

const ManagerReports = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                const response = await getAllReports();
                setReports(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to load reports");
            }
        };

        loadReports();
    }, []);

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">All Reports</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Manager view of the submitted team reports.
                </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Member</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Week</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report._id} hover>
                                <TableCell>{report.user?.name || "Unknown"}</TableCell>
                                <TableCell>{report.project?.name || "No project"}</TableCell>
                                <TableCell>
                                    {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip label={report.status} color={report.status === "SUBMITTED" ? "success" : "warning"} size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default ManagerReports;