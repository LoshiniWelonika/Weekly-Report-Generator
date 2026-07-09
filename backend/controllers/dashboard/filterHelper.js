const buildReportFilter = (query) => {

    let { weekStart, weekEnd, project, member } = query;

    if (!weekStart || !weekEnd) {

        const today = new Date();

        const start = new Date(today);

        start.setDate(today.getDate() - today.getDay() + 1);

        start.setHours(0, 0, 0, 0);

        const end = new Date(start);

        end.setDate(start.getDate() + 6);

        end.setHours(23, 59, 59, 999);

        weekStart = start;
        weekEnd = end;

    } else {

        weekStart = new Date(weekStart);
        weekStart.setHours(0, 0, 0, 0);

        weekEnd = new Date(weekEnd);
        weekEnd.setHours(23, 59, 59, 999);

    }

    const filter = {
        status: "SUBMITTED",
        weekStart,
        weekEnd
    };

    if (project) {
        filter.project = project;
    }

    if (member) {
        filter.user = member;
    }

    return {
        filter,
        weekStart,
        weekEnd
    };

};

module.exports = buildReportFilter;