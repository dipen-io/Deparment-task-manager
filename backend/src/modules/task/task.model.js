const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        maxLength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Task must have a creator"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
