const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");
const buildReportFilter = require("./filterHelper");


const getSubmissionStatus = async (req, res) => {

    try {

        const today = new Date();


        const {
            filter,
            weekEnd
        } = buildReportFilter(req.query);



        const members = await User.find({
            role:"MEMBER"
        });



        const submittedReports =
            await WeeklyReport.find(filter);



        const submittedUsers = new Set(

            submittedReports
                .filter(report => report.user)
                .map(report =>
                    report.user.toString()
                )

        );



        let submitted = 0;
        let pending = 0;
        let late = 0;



        const deadline = new Date(weekEnd);

        deadline.setHours(
            18,
            0,
            0,
            0
        );



        members.forEach(member => {


            const hasSubmitted =
                submittedUsers.has(
                    member._id.toString()
                );


            if(hasSubmitted){

                submitted++;

            }
            else if(today > deadline){

                late++;

            }
            else{

                pending++;

            }

        });



        res.json({

            success:true,

            data:{

                submitted,

                pending,

                late,

                totalMembers: members.length

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