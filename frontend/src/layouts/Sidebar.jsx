import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, onMobileClose }) => {
    const { user } = useAuth();
    const location = useLocation();

    const managerItems = [
        { text: "Dashboard", path: "/manager", icon: <DashboardIcon fontSize="small" /> },
        { text: "All Reports", path: "/manager/reports", icon: <ArticleIcon fontSize="small" /> },
        { text: "Projects", path: "/manager/projects", icon: <FolderIcon fontSize="small" /> },
    ];

    const memberItems = [
        { text: "Dashboard", path: "/member", icon: <DashboardIcon fontSize="small" /> },
        { text: "My Reports", path: "/member/reports", icon: <AssignmentTurnedInIcon fontSize="small" /> },
    ];

    const menuItems = user?.role === "MANAGER" ? managerItems : memberItems;

    const drawerContent = (
        <Box sx={{ height: "100%", background: "linear-gradient(180deg, rgba(15,118,110,0.08), rgba(15,23,42,0.02))" }}>
            <Toolbar>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Workspace
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user?.role === "MANAGER" ? "Manager controls" : "Member workspace"}
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />
            <List sx={{ px: 1, py: 1.5 }}>
                {menuItems.map((item) => {
                    const selected = location.pathname === item.path;

                    return (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            selected={selected}
                            onClick={onMobileClose}
                            sx={{
                                mb: 0.75,
                                borderRadius: 3,
                                alignItems: "center",
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(15,118,110,0.12)",
                                    color: "primary.main",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: selected ? "primary.main" : "text.secondary" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        borderRight: "1px solid rgba(15,23,42,0.08)",
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;