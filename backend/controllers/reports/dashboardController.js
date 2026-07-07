const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");


const getSummary = async (req, res) => {

    try {

        const {
            weekStart,
            weekEnd
        } = req.query;


        const reportFilter = {
            status: "SUBMITTED"
        };


        if (weekStart && weekEnd) {

            reportFilter.weekStart = {
                $gte: new Date(weekStart),
                $lte: new Date(weekEnd)
            };

        }


        // Get submitted reports
        const reports = await WeeklyReport.find(reportFilter);


        // Total submitted reports
        const totalReports = reports.length;


        // Total members
        const totalMembers = await User.countDocuments({
            role: "MEMBER"
        });


        // Pending reports
        const pendingReports =
            totalMembers - totalReports;


        // Compliance rate
        const complianceRate =
            totalMembers === 0
                ? 0
                : Math.round(
                    (totalReports / totalMembers) * 100
                );


        // Count blockers
        let openBlockers = 0;


        reports.forEach(report => {

            if(report.blockers){

                openBlockers += report.blockers.length;

            }

        });


        res.json({

            totalReports,

            pendingReports,

            complianceRate,

            openBlockers

        });


    } catch(error) {


        res.status(500).json({
            message:error.message
        });


    }

};


module.exports = {
    getSummary
};