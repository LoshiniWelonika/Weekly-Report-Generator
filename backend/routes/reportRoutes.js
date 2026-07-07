const express=require("express");


const {
createReport,
getMyReports,
getAllReports,
getReportById,
updateReport,
submitReport
}=require("../controllers/reports/reportController");


const {
protect,
authorizeRoles
}=require("../middleware/authMiddleware");


const router=express.Router();



// Member create
router.post(
"/",
protect,
authorizeRoles("MEMBER"),
createReport
);



// Member own reports
router.get(
"/my",
protect,
authorizeRoles("MEMBER"),
getMyReports
);



// Manager all reports
router.get(
"/",
protect,
authorizeRoles("MANAGER"),
getAllReports
);



// Single report
router.get(
"/:id",
protect,
getReportById
);



// Update
router.put(
"/:id",
protect,
authorizeRoles("MEMBER"),
updateReport
);



// Submit
router.put(
"/:id/submit",
protect,
authorizeRoles("MEMBER"),
submitReport
);



module.exports=router;