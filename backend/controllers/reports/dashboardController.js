const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");


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



module.exports = {
    getDashboardSummary
};