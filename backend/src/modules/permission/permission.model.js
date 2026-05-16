const { Schema, model } = require("mongoose");

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true, // CREATE_TASK, DELETE_TASK
      trim: true,
    },
    desc: {
      type: String, // allow creating new tasks
      trim: true,
    },
  },
  { timeseries: true },
);

module.exports = model("Permission", permissionSchema);
