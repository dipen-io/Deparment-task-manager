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
        permissions: [
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
roleSchema.index({ permissions: 1 });


module.exports = mongoose.model("Role", roleSchema);
