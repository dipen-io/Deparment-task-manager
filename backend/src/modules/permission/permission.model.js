const { Schema, model } = require("mongoose");

const permissionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // CREATE_TASK, DELETE_TASK
            trim: true,
            uppercase: true,
        },
        desc: {
            type: String, // allow creating new tasks
            trim: true, 
        },
        createdBy: {
            type:Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true },
);

permissionSchema.index({ name: 1}, { unique: true });
permissionSchema.index({ createdBy: 1});

module.exports = model("Permission", permissionSchema);
