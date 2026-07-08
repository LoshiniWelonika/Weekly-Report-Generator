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



        const totalReports =
            await WeeklyReport.countDocuments(filter);



        const totalMembers =
            await User.countDocuments({
                role:"MEMBER"
            });



        const pendingReports =
            Math.max(
                totalMembers - totalReports,
                0
            );



        let complianceRate = 0;


        if(totalMembers > 0){

            complianceRate =
                Number(
                    (
                        (totalReports / totalMembers)
                        * 100
                    )
                    .toFixed(2)
                );

        }



        const reports =
            await WeeklyReport.find(filter);



        let openBlockers = 0;


        reports.forEach(report => {

            openBlockers +=
                report.blockers?.length || 0;

        });



        res.json({

            success:true,

            data:{

                weekStart:
                    weekStart
                    .toISOString()
                    .split("T")[0],

                weekEnd:
                    weekEnd
                    .toISOString()
                    .split("T")[0],

                totalReports,

                pendingReports,

                complianceRate,

                openBlockers

            }

        });



    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



module.exports = {
    getDashboardSummary
};