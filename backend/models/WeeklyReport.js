const mongoose = require("mongoose");


const weeklyReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        weekStart: {
            type: Date,
            required: true
        },

        weekEnd: {
            type: Date,
            required: true
        },

        deadline: {
            type: Date,
            required: true
        },

        tasksCompleted: [
            {
                type: String
            }
        ],

        tasksPlanned: [
            {
                type: String
            }
        ],

        blockers: [
            {
                type: String
            }
        ],

        hoursWorked: {
            type: Number,
            default: 0
        },

        notes: {
            type: String
        },

        status: {
            type: String,
            enum: ["DRAFT", "SUBMITTED"],
            default: "DRAFT"
        },

        submittedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "WeeklyReport",
    weeklyReportSchema
);