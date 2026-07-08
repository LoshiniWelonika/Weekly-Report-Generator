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
            await WeeklyReport.find(filter)
                .populate("user", "name email");



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

        const memberBreakdown = members.map(member => ({
            memberId: member._id.toString(),
            member: member.name,
            email: member.email,
            submitted: false,
            pending: false,
            late: false
        }));



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

                const entry = memberBreakdown.find(item => item.memberId === member._id.toString());

                if (entry) {
                    entry.submitted = true;
                }

            }
            else if(today > deadline){

                late++;

                const entry = memberBreakdown.find(item => item.memberId === member._id.toString());

                if (entry) {
                    entry.late = true;
                }

            }
            else{

                pending++;

                const entry = memberBreakdown.find(item => item.memberId === member._id.toString());

                if (entry) {
                    entry.pending = true;
                }

            }

        });



        res.json({

            success:true,

            data:{

                submitted,

                pending,

                late,

                totalMembers: members.length,
                memberBreakdown

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