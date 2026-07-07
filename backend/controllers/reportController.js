const WeeklyReport = require("../models/WeeklyReport");
const dayjs = require("dayjs");

// Create Report
const createReport = async (req,res)=>{
    try{

        const existingReport = await WeeklyReport.findOne({
        user: req.user._id,
        weekStart: req.body.weekStart,
        weekEnd: req.body.weekEnd
        });


        if (existingReport) {
            return res.status(400).json({
                message: "A report for this week already exists."
            });
        }
        

         const deadline = dayjs(req.body.weekStart)
            .add(4, "day") // Friday
            .hour(18)
            .minute(0)
            .second(0)
            .millisecond(0)
            .toDate(); 

        const report = await WeeklyReport.create({
            user:req.user._id,
            deadline,
            ...req.body
        });

        res.status(201).json({

            message:"Report created successfully",

            report

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Get logged-in user's reports
const getMyReports = async(req,res)=>{

    try{

        const reports = await WeeklyReport
            .find({
                user:req.user._id
            })
            .populate("project");


        res.json(reports);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Get all reports (Manager)
const getAllReports = async(req,res)=>{

    try{


        const reports = await WeeklyReport
            .find()
            .populate("user","name email")
            .populate("project");


        res.json(reports);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Get single report
const getReportById = async(req,res)=>{

    try{

        const report =
            await WeeklyReport.findById(req.params.id)
            .populate("user","name email")
            .populate("project");


        if(!report){

            return res.status(404).json({
                message:"Report not found"
            });

        }


        res.json(report);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Update report
const updateReport = async(req,res)=>{

    try{


        const report =
        await WeeklyReport.findById(req.params.id);


        if(!report){

            return res.status(404).json({
                message:"Report not found"
            });

        }



        if(
            report.user.toString()
            !==
            req.user._id.toString()
        ){

            return res.status(403).json({
                message:"Not allowed"
            });

        }



        if(report.status==="SUBMITTED"){

            return res.status(400).json({
                message:"Submitted report cannot be edited"
            });

        }



        Object.assign(
            report,
            req.body
        );


        await report.save();


        res.json({
            message:"Report updated",
            report
        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Submit report
const submitReport = async(req,res)=>{

    try{


        const report =
        await WeeklyReport.findById(req.params.id);



        if(!report){

            return res.status(404).json({
                message:"Report not found"
            });

        }



        if(
            report.user.toString()
            !==
            req.user._id.toString()
        ){

            return res.status(403).json({
                message:"Not allowed"
            });

        }



        report.status="SUBMITTED";

        report.submittedAt=new Date();



        await report.save();



        res.json({

            message:"Report submitted",

            report

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




module.exports={
    createReport,
    getMyReports,
    getAllReports,
    getReportById,
    updateReport,
    submitReport
};