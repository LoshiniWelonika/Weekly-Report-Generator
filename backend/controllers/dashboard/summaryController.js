const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");
const buildReportFilter = require("./filterHelper");


const getDashboardSummary = async (req, res) => {

    try {

        const {
            filter,
            weekStart,
            weekEnd
        } = buildReportFilter(req.query);


        const reports =
            await WeeklyReport.find(filter);


        const totalReports = reports.length;


        const submittedReports =
            reports.filter(
                report => report.status === "SUBMITTED"
            ).length;


        const pendingReports =
            reports.filter(
                report => report.status === "PENDING"
            ).length;


        const totalMembers =
            await User.countDocuments({
                role: "MEMBER"
            });


        let complianceRate = 0;

        if (totalMembers > 0) {

            complianceRate =
                Number(
                    (
                        (submittedReports / totalMembers)
                        * 100
                    )
                    .toFixed(2)
                );

        }


        let openBlockers = 0;

        reports.forEach(report => {
            openBlockers += report.blockers?.length || 0;
        });


        res.json({

            success: true,

            data: {

                weekStart:
                    weekStart
                    .toISOString()
                    .split("T")[0],

                weekEnd:
                    weekEnd
                    .toISOString()
                    .split("T")[0],

                totalReports,

                submittedReports,

                pendingReports,

                complianceRate,

                openBlockers

            }

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {
    getDashboardSummary
};