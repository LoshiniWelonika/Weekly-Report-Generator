const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");


const getProjectWorkload = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
        .populate("project");


        const workload = {};


        reports.forEach(report => {


            if (!report.project) {
                return;
            }


            const projectName =
                report.project.name;


            const taskCount =
                report.tasksCompleted.length;



            if (!workload[projectName]) {

                workload[projectName] = 0;

            }


            workload[projectName] += taskCount;


        });



        const result =
            Object.keys(workload).map(project => ({

                project,

                tasksCompleted:
                    workload[project]

            }));


        res.json(result);



    } catch(error) {
            res.status(500).json({

            success:false,

            message:error.message

        });

    }

};


module.exports = {
    getProjectWorkload
};