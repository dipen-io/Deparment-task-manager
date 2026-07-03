const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requried"],
      trim: true,
      maxLength: [50, "Name cannot exceeded 50 character"],
    },

    userType: {
        type: String,
        enum: ["admin", "head" , "member", "user"], // head is head of department
        default: "user"
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [6, "Password must be at least 6 character"],
      select: false, // never return in query
    },

    roles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        // index: true
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

// indexs
// userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ role: 1, isActive: 1 }); 
userSchema.index({ department: 1, isActive: 1 }); 
userSchema.index({ createdAt: -1 });  

// hash the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//Compare the password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
