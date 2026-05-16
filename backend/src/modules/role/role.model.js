const { Schema, default: mongoose } = require("mongoose");

const PERMISSION = [
  "task:create",
  "task:read",
  "task:update:all",
  "task:update:complete",
  "task:delete",
  "task:assign",
  "user:manage",
  "dept:manage",
];

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permission: [
      {
        type: String,
        enum: PERMISSION,
      },
    ],
  },
  { timestamps: true },
);

export const Role = mongoose.model("Role", roleSchema);
