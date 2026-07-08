const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");

const getTasksTrend = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
            .sort({
                weekStart: 1
            });

        const trend = {};

        reports.forEach(report => {

            const week = report.weekStart
                .toISOString()
                .split("T")[0];

            const taskCount =
                report.tasksCompleted?.length || 0;

            if (!trend[week]) {
                trend[week] = 0;
            }

            trend[week] += taskCount;

        });

        const result = Object.keys(trend).map(week => ({

            week,

            tasksCompleted: trend[week]

        }));

        res.json({

            success: true,

            data: result

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    getTasksTrend
};