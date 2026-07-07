const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use( "/api/projects", projectRoutes);

app.get("/", (req,res)=>{
    res.send("Weekly Report API is running...");
});


module.exports = app;