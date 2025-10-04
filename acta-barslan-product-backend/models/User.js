const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: [true, "First name is required"],
         trim: true,
         maxlength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
         type: String,
         required: [true, "Last name is required"],
         trim: true,
         maxlength: [50, "Last name cannot exceed 50 characters"],
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         lowercase: true,
         trim: true,
         match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
         ],
      },
      password: {
         type: String,
         required: [true, "Password is required"],
         minlength: [6, "Password must be at least 6 characters"],
         select: false, // Don't include password in queries by default
      },
      role: {
         type: String,
         enum: ["user", "admin", "moderator"],
         default: "user",
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      isEmailVerified: {
         type: Boolean,
         default: false,
      },
      emailVerificationToken: String,
      passwordResetToken: String,
      passwordResetExpires: Date,
      lastLogin: Date,
      profilePicture: String,
      phoneNumber: {
         type: String,
         trim: true,
      },
      address: {
         street: String,
         city: String,
         state: String,
         zipCode: String,
         country: String,
      },
   },
   {
      timestamps: true,
   }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   try {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error) {
      next(error);
   }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual("fullName").get(function () {
   return `${this.firstName} ${this.lastName}`;
});

// Transform output
userSchema.set("toJSON", {
   virtuals: true,
   transform: function (doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
   },
});

module.exports = mongoose.model("User", userSchema);
