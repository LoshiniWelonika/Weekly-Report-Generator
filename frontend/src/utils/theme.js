import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0f766e",
            dark: "#115e59",
            light: "#14b8a6",
            contrastText: "#f8fafc",
        },
        secondary: {
            main: "#f97316",
        },
        background: {
            default: "#f4f7fb",
            paper: "#ffffff",
        },
        text: {
            primary: "#0f172a",
            secondary: "#475569",
        },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        h4: { fontWeight: 800, letterSpacing: "-0.02em" },
        h5: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 700 },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage:
                        "radial-gradient(circle at top left, rgba(20,184,166,0.08), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent 28%)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: `1px solid ${alpha("#0f172a", 0.08)}`,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    paddingLeft: 18,
                    paddingRight: 18,
                },
            },
        },
        MuiTextField: {
            defaultProps: { variant: "outlined", fullWidth: true },
        },
    },
});

export default theme;