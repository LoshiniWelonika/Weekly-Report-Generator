const express = require("express");

const {
    getDashboardSummary, 
    getTasksTrend, 
    getSubmissionStatus,
    getProjectWorkload
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

router.get(
    "/submission-status",
    protect,
    authorizeRoles("MANAGER"),
    getSubmissionStatus
);

router.get(
    "/project-workload",
    protect,
    authorizeRoles("MANAGER"),
    getProjectWorkload
);

module.exports = router;