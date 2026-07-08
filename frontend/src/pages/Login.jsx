import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Divider, Link, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await loginUser({ email, password });
            login(response.data.user, response.data.token);
            navigate(response.data.user.role === "MANAGER" ? "/manager" : "/member", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", py: 4 }}>
            <Card sx={{ width: "100%", maxWidth: 1120, overflow: "hidden", boxShadow: 12 }}>
                <Box sx={{ display: { xs: "block", md: "grid" }, gridTemplateColumns: { md: "1.05fr 0.95fr" } }}>
                    <Box
                        sx={{
                            p: { xs: 4, md: 6 },
                            color: "white",
                            background: "linear-gradient(160deg, #0f766e 0%, #0f172a 100%)",
                            minHeight: { xs: 220, md: 520 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                                Team Reporting
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                                Weekly reporting that stays simple.
                            </Typography>
                            <Typography sx={{ maxWidth: 500, opacity: 0.9 }}>
                                Sign in to submit weekly updates, track progress, and review manager analytics in one clean workspace.
                            </Typography>
                        </Stack>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Fast
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    Create reports in minutes.
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Clear
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    View statuses and metrics.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <CardContent sx={{ p: { xs: 4, md: 6 }, display: "flex", alignItems: "center" }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="h4">Welcome back</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        Use your team account to continue.
                                    </Typography>
                                </Box>

                                {error ? <Alert severity="error">{error}</Alert> : null}

                                <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

                                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.4 }}>
                                    {loading ? "Signing in..." : "Sign in"}
                                </Button>

                                <Divider>or</Divider>

                                <Typography variant="body2" color="text.secondary">
                                    Need an account?{' '}
                                    <Link component={RouterLink} to="/register" underline="hover">
                                        Create one here
                                    </Link>
                                </Typography>
                            </Stack>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};

export default Login;