const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");


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

                user: report.user
                    ? report.user.name
                    : "Unknown User",


                email: report.user
                    ? report.user.email
                    : "Unknown Email",


                action: "Submitted weekly report",


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