const WeeklyReport = require("../../models/WeeklyReport");
const User = require("../../models/User");
const buildReportFilter = require("./filterHelper");


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


module.exports = {
    getSubmissionStatus
};