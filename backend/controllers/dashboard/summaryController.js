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

module.exports = {
    getDashboardSummary
};