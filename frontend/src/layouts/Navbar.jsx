import { AppBar, Avatar, Box, Button, Chip, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: "linear-gradient(90deg, #0f766e 0%, #0f172a 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ display: { md: "none" } }}>
                    <MenuIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Weekly Report Generator
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Simple reporting for members and managers
                    </Typography>
                </Box>

                {user ? (
                    <>
                        <Chip
                            avatar={<Avatar sx={{ bgcolor: "rgba(255,255,255,0.16)" }}>{user.name?.[0]}</Avatar>}
                            label={`${user.name} · ${user.role}`}
                            sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }}
                            variant="outlined"
                        />
                        <Button color="inherit" onClick={logout} sx={{ borderColor: "rgba(255,255,255,0.2)" }}>
                            Logout
                        </Button>
                    </>
                ) : null}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;