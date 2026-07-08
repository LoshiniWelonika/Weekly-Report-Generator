const express = require("express");

const {
    getDashboardSummary
} = require("../controllers/dashboard/summaryController");

const {
    getTasksTrend
} = require("../controllers/dashboard/trendController");

const {
    getSubmissionStatus
} = require("../controllers/dashboard/submissionController");

const {
    getProjectWorkload
} = require("../controllers/dashboard/workloadController");

const {
    getRecentActivity
} = require("../controllers/dashboard/activityController");


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

router.get(
    "/recent-activity",
    protect,
    authorizeRoles("MANAGER"),
    getRecentActivity
);

module.exports = router;