const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");


const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const projectRoutes = require("./routes/projectRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

app.use(cors());

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use( "/api/projects", projectRoutes);

app.use( "/api/reports", reportRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req,res)=>{
    res.send("Weekly Report API is running...");
});


module.exports = app;