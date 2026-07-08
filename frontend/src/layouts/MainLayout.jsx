import { useState } from "react";
import { Box, Container, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const drawerWidth = 260;

const MainLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuClick = () => setMobileOpen((open) => !open);
    const handleMobileClose = () => setMobileOpen(false);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Navbar onMenuClick={handleMenuClick} />
            <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: "transparent",
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;