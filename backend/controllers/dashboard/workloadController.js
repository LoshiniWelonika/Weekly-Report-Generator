const WeeklyReport = require("../../models/WeeklyReport");
const buildReportFilter = require("./filterHelper");

const getProjectWorkload = async (req, res) => {

    try {

        const { filter } = buildReportFilter(req.query);

        const reports = await WeeklyReport.find(filter)
            .populate("project", "name")
            .populate("user", "name email");

        const workload = new Map();

        reports.forEach(report => {

            if (!report.project) {
                return;
            }

            const projectName = report.project.name;
            const projectId = report.project._id.toString();

            const taskCount =
                report.tasksCompleted?.length || 0;

            if (!workload.has(projectId)) {
                workload.set(projectId, {
                    project: projectName,
                    projectId,
                    tasksCompleted: 0,
                    reports: 0,
                    members: new Map()
                });
            }

            const bucket = workload.get(projectId);
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

        const result = Array.from(workload.values()).map((bucket) => ({
            project: bucket.project,
            projectId: bucket.projectId,
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
    getProjectWorkload
};