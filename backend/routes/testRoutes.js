const express = require("express");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


const router = express.Router();



router.get(
    "/member",
    protect,
    authorizeRoles("MEMBER"),
    (req,res)=>{

        res.json({
            message:"Member route accessed",
            user:req.user
        });

    }
);



router.get(
    "/manager",
    protect,
    authorizeRoles("MANAGER"),
    (req,res)=>{

        res.json({
            message:"Manager route accessed",
            user:req.user
        });

    }
);



module.exports = router;