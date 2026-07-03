const { Schema, default: mongoose } = require("mongoose");

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
    head: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });


module.exports = mongoose.model("Department", departmentSchema);

