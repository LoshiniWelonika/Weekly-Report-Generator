const express = require("express");

const {
    getDashboardSummary, getTasksTrend
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

router.get(
    "/tasks-trend",
    protect,
    authorizeRoles("MANAGER"),
    getTasksTrend
);



module.exports = router;