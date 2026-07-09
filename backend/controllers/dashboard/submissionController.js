const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");
const buildReportFilter = require("./filterHelper");


const getSubmissionStatus = async (req, res) => {

    try {
        const {
            filter,
        } = buildReportFilter(req.query);

        const reports =
            await WeeklyReport.find(filter);

        const submitted = reports.filter(report => report.status === "SUBMITTED").length;
        const pending = reports.filter(report => report.status === "PENDING").length;
        const late = 0;



        res.json({

            success:true,

            data:{

                submitted,

                pending,

                late,

                totalMembers: await User.countDocuments({
                    role: "MEMBER"
                })

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
    getSubmissionStatus
};