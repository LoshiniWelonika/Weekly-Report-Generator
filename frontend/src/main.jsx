import React from "react";
import ReactDOM from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";


import {
    ThemeProvider
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


import App from "./App";

import theme from "./utils/theme";

import {
    AuthProvider
} from "./context/AuthContext.jsx";



ReactDOM.createRoot(
    document.getElementById("root")
)
.render(

    <React.StrictMode>

        <ThemeProvider theme={theme}>

            <CssBaseline />

            <AuthProvider>

                <BrowserRouter>

                    <App />

                </BrowserRouter>

            </AuthProvider>

        </ThemeProvider>

    </React.StrictMode>

);