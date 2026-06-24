const { Schema, model } = require("mongoose");

const departmentSchema = new Schema ({
    name : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });


module.export = new model("Deparment", departmentSchema);
