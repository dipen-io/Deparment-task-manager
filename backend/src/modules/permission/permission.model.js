const { Schema, model } = require("mongoose");

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // CREATE_TASK, DELETE_TASK
      trim: true,
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

module.exports = model("Permission", permissionSchema);
