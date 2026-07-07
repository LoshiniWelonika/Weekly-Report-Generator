const express = require("express");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projects/projectController");


const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


const router = express.Router();



// Manager only
router.post(
    "/",
    protect,
    authorizeRoles("MANAGER"),
    createProject
);



// Both roles
router.get(
    "/",
    protect,
    getProjects
);


router.get(
    "/:id",
    protect,
    getProjectById
);



// Manager only
router.put(
    "/:id",
    protect,
    authorizeRoles("MANAGER"),
    updateProject
);


router.delete(
    "/:id",
    protect,
    authorizeRoles("MANAGER"),
    deleteProject
);



module.exports = router;