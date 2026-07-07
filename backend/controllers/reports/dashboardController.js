const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");
const Project = require("../../models/Project");


// Get Dashboard Summary
const getDashboardSummary = async (req, res) => {

    try {

        // Get current week dates
        const today = new Date();

        const weekStart = new Date(today);
        weekStart.setDate(
            today.getDate() - today.getDay() + 1
        );

        weekStart.setHours(0,0,0,0);


        const weekEnd = new Date(weekStart);

        weekEnd.setDate(
            weekStart.getDate() + 6
        );

        weekEnd.setHours(23,59,59,999);



        // Count managers should only see submitted reports
        const totalReports = await WeeklyReport.countDocuments({

            status: "SUBMITTED",

            weekStart:{
                $gte: weekStart,
                $lte: weekEnd
            }

        });



        // Count total team members
        const totalMembers = await User.countDocuments({

            role:"MEMBER"

        });



        // Calculate pending reports

        const pendingReports =
            totalMembers - totalReports;



        // Compliance percentage

        let complianceRate = 0;


        if(totalMembers > 0){

            complianceRate =
                ((totalReports / totalMembers) * 100)
                .toFixed(2);

        }



        // Calculate blockers

        const reports =
            await WeeklyReport.find({

                status:"SUBMITTED",

                weekStart:{
                    $gte: weekStart,
                    $lte: weekEnd
                }

            });



        let openBlockers = 0;


        reports.forEach(report=>{

            openBlockers += report.blockers.length;

        });



        res.json({

            weekStart,
            weekEnd,

            totalReports,

            pendingReports,

            complianceRate,

            openBlockers

        });



    } catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// Get Tasks Completed Trend
const getTasksTrend = async (req, res) => {

    try {

        const reports = await WeeklyReport.find({
            status: "SUBMITTED"
        })
        .sort({
            weekStart: 1
        });



        const trend = {};



        reports.forEach(report => {

            const week =
                report.weekStart
                .toISOString()
                .split("T")[0];


            const taskCount =
                report.tasksCompleted.length;



            if (!trend[week]) {

                trend[week] = 0;

            }


            trend[week] += taskCount;


        });



        const result =
            Object.keys(trend).map(week => ({

                week,

                tasksCompleted:
                    trend[week]

            }));



        res.json(result);



    } catch(error) {

        res.status(500).json({
            message:error.message
        });

    }

};


// Get Submission Status
const getSubmissionStatus = async (req, res) => {

    try {

        const today = new Date();


        // Calculate current week
        const weekStart = new Date(today);

        weekStart.setDate(
            today.getDate() - today.getDay() + 1
        );

        weekStart.setHours(0,0,0,0);



        const weekEnd = new Date(weekStart);

        weekEnd.setDate(
            weekStart.getDate() + 6
        );

        weekEnd.setHours(23,59,59,999);



        // Get all members
        const members = await User.find({
            role:"MEMBER"
        });



        // Get submitted reports
        const submittedReports =
            await WeeklyReport.find({

                status:"SUBMITTED",

                weekStart:{
                    $gte: weekStart,
                    $lte: weekEnd
                }

            });



        const submittedUsers =
            submittedReports.map(
                report => report.user.toString()
            );



        let submitted = 0;
        let pending = 0;
        let late = 0;



        members.forEach(member => {


            const hasSubmitted =
                submittedUsers.includes(
                    member._id.toString()
                );



            if(hasSubmitted){

                submitted++;

            }
            else {


                // Check deadline

                const deadline =
                    new Date(weekEnd);


                deadline.setHours(
                    18,
                    0,
                    0,
                    0
                );


                if(today > deadline){

                    late++;

                }
                else{

                    pending++;

                }

            }


        });



        res.json({

            submitted,

            pending,

            late,

            totalMembers: members.length

        });



    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

// Get Project Workload
const getProjectWorkload = async (req, res) => {

    try {

        const reports = await WeeklyReport.find({
            status: "SUBMITTED"
        })
        .populate("project");


        const workload = {};


        reports.forEach(report => {


            if (!report.project) {
                return;
            }


            const projectName =
                report.project.name;


            const taskCount =
                report.tasksCompleted.length;



            if (!workload[projectName]) {

                workload[projectName] = 0;

            }


            workload[projectName] += taskCount;


        });



        const result =
            Object.keys(workload).map(project => ({

                project,

                tasksCompleted:
                    workload[project]

            }));


        res.json(result);



    } catch(error) {


        res.status(500).json({

            message:error.message

        });

    }

};


module.exports = {
    getDashboardSummary,
    getTasksTrend,
    getSubmissionStatus,
    getProjectWorkload
};