const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");


const buildReportFilter = (query) => {

    let { weekStart, weekEnd, project, member } = query;

    if (!weekStart || !weekEnd) {

        const today = new Date();

        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay() + 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        weekStart = start;
        weekEnd = end;

    } else {

        weekStart = new Date(weekStart);
        weekStart.setHours(0, 0, 0, 0);

        weekEnd = new Date(weekEnd);
        weekEnd.setHours(23, 59, 59, 999);

    }

    const filter = {
        status: "SUBMITTED",
        weekStart,
        weekEnd
    };

    if (project) {
        filter.project = project;
    }

    if (member) {
        filter.user = member;
    }

    return {
        filter,
        weekStart,
        weekEnd
    };

};


// Get Dashboard Summary
const getDashboardSummary = async (req, res) => {

    try {

        const {
            filter,
            weekStart,
            weekEnd
        } = buildReportFilter(req.query);



        // Count managers should only see submitted reports
        const totalReports = await WeeklyReport.countDocuments(filter);


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
            await WeeklyReport.find(filter);



        let openBlockers = 0;


        reports.forEach(report => {

            openBlockers += report.blockers?.length || 0;

        });



        res.json({

            success:true,

            data:{

                weekStart,

                weekEnd,

                totalReports,

                pendingReports,

                complianceRate,

                openBlockers

            }

        });



    } catch(error){

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get Tasks Completed Trend
const getTasksTrend = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
        .sort({
            weekStart:1
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

            success:false,

            message:error.message

        });

    }

};


// Get Submission Status
const getSubmissionStatus = async (req, res) => {

    try {

        const today = new Date();


        // Calculate current week
        const {
            filter,
            weekStart,
            weekEnd
        } = buildReportFilter(req.query);



        // Get all members
        const members = await User.find({
            role:"MEMBER"
        });



        // Get submitted reports
        const submittedReports =
            await WeeklyReport.find(filter);



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

            success:false,

            message:error.message

        });

    }

};

// Get Project Workload
const getProjectWorkload = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
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

            success:false,

            message:error.message

        });

    }

};


// Get Recent Activity
const getRecentActivity = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
            .populate("user", "name email")
            .populate("project", "name")
            .sort({
                submittedAt: -1
            })
            .limit(10);


        const activities = reports.map(report => {


            return {

                user: report.user.name,

                email: report.user.email,

                action: "Submitted weekly report",

                project: report.project
                    ? report.project.name
                    : "No project",

                date: report.submittedAt

            };


        });



        res.json(activities);



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};


module.exports = {
    getDashboardSummary,
    getTasksTrend,
    getSubmissionStatus,
    getProjectWorkload,
    getRecentActivity
};