import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Divider, Link, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "MEMBER",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerUser(formData);
            navigate("/login", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", py: 4 }}>
            <Card sx={{ width: "100%", maxWidth: 1120, overflow: "hidden", boxShadow: 12 }}>
                <Box sx={{ display: { xs: "block", md: "grid" }, gridTemplateColumns: { md: "0.95fr 1.05fr" } }}>
                    <CardContent sx={{ p: { xs: 4, md: 6 }, display: "flex", alignItems: "center" }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="h4">Create account</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        Register as a member or manager to access the workspace.
                                    </Typography>
                                </Box>

                                {error ? <Alert severity="error">{error}</Alert> : null}

                                <TextField name="name" label="Full name" value={formData.name} onChange={handleChange} required />
                                <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                                <TextField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                                <TextField name="role" label="Role" select value={formData.role} onChange={handleChange}>
                                    <MenuItem value="MEMBER">Team Member</MenuItem>
                                    <MenuItem value="MANAGER">Manager</MenuItem>
                                </TextField>

                                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.4 }}>
                                    {loading ? "Creating account..." : "Create account"}
                                </Button>

                                <Divider>or</Divider>

                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" underline="hover">
                                        Sign in
                                    </Link>
                                </Typography>
                            </Stack>
                        </Box>
                    </CardContent>

                    <Box
                        sx={{
                            p: { xs: 4, md: 6 },
                            color: "white",
                            background: "linear-gradient(160deg, #0f172a 0%, #0f766e 100%)",
                            minHeight: { xs: 220, md: 520 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                                Team Access
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                                One system for reports, projects, and dashboards.
                            </Typography>
                            <Typography sx={{ maxWidth: 500, opacity: 0.9 }}>
                                Managers track team progress while members submit weekly work in a streamlined flow.
                            </Typography>
                        </Stack>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Reports
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    Submit and manage weekly updates.
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Projects
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    Keep work aligned to active projects.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default Register;