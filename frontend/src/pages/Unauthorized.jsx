import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Unauthorized() {
    return (
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3 }}>
            <Paper sx={{ p: 5, maxWidth: 540, textAlign: "center" }}>
                <Stack spacing={2} alignItems="center">
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
                        Access restricted
                    </Typography>
                    <Typography variant="h4">You do not have permission to view this page.</Typography>
                    <Typography color="text.secondary">
                        Ask an administrator to update your role or return to your dashboard.
                    </Typography>
                    <Button component={RouterLink} to="/" variant="contained">
                        Go home
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}

export default Unauthorized;