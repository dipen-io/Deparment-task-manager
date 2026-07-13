const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema ({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    }

}, { timestamp: true });

module.exports = mongoose.model("TaskAssignment", taskAssignmentSchema) ;
