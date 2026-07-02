const { Schema, default: mongoose } = require("mongoose");

const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // "Manager", "Deleloper"
            trim: true,
            uppercase: true,
        },
        // removed s
        permission: [
            {
                type: Schema.Types.ObjectId,
                ref: "Permission",
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true },
);

// roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ permission: 1 });


module.exports = mongoose.model("Role", roleSchema);
