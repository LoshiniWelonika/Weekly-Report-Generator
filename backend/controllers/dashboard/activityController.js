const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");


const getRecentActivity = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const limit = Math.min(Number(req.query.limit) || 10, 50);


        const reports = await WeeklyReport.find(filter)

            .populate("user", "name email")

            .populate("project", "name")

            .sort({
                submittedAt: -1
            })

            .limit(limit);



        const activities = reports.map(report => {


            return {

                user: report.user
                    ? report.user.name
                    : "Unknown User",


                email: report.user
                    ? report.user.email
                    : "Unknown Email",


                action: "Submitted weekly report",

                status: report.status,

                reportId: report._id.toString(),


                project: report.project
                    ? report.project.name
                    : "No project",


                date: report.submittedAt
                    ? report.submittedAt.toISOString().split("T")[0]
                    : null

            };


        });



        res.json({

            success:true,

            data:activities

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};



module.exports = {
    getRecentActivity
};