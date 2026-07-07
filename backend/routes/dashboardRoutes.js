const express = require("express");

const {
    getDashboardSummary
} = require("../controllers/reports/dashboardController");


const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


const router = express.Router();



router.get(
    "/summary",
    protect,
    authorizeRoles("MANAGER"),
    getDashboardSummary
);



module.exports = router;