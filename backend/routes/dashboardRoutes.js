const express = require("express");

const {
    getSummary
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
    getSummary
);


module.exports = router;