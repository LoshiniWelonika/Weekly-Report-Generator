const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");

const formatDateKey = (date) => date.toISOString().split("T")[0];

const getTasksTrend = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
            .populate("user", "name email")
            .sort({
                weekStart: 1
            });

        const trend = new Map();

        reports.forEach(report => {

            const week = formatDateKey(report.weekStart);

            const taskCount =
                report.tasksCompleted?.length || 0;

            if (!trend.has(week)) {
                trend.set(week, {
                    week,
                    tasksCompleted: 0,
                    reports: 0,
                    members: new Map()
                });
            }

            const bucket = trend.get(week);
            bucket.tasksCompleted += taskCount;
            bucket.reports += 1;

            if (report.user?._id) {
                const memberId = report.user._id.toString();
                const memberBucket = bucket.members.get(memberId) || {
                    memberId,
                    member: report.user.name || "Unknown User",
                    tasksCompleted: 0,
                    reports: 0
                };

                memberBucket.tasksCompleted += taskCount;
                memberBucket.reports += 1;
                bucket.members.set(memberId, memberBucket);
            }

        });

        const result = Array.from(trend.values()).map((bucket) => ({
            week: bucket.week,
            tasksCompleted: bucket.tasksCompleted,
            reports: bucket.reports,
            members: Array.from(bucket.members.values())
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