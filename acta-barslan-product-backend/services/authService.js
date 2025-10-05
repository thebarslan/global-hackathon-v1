const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const crypto = require("crypto");

class AuthService {
   // Register new user
   async register(userData) {
      try {
         const { firstName, lastName, email, password } = userData;

         // Check if user already exists
         const existingUser = await User.findOne({ email });
         if (existingUser) {
            throw new Error("User already exists with this email");
         }

         // Create user with subscription
         const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            subscription: {
               isSubscribed: true,
               plan: "premium",
               startDate: new Date(),
               endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
               autoRenew: true,
               status: "active",
               features: {
                  maxBrands: 50,
                  maxAnalyses: 200,
                  maxReports: 100,
                  redditApiCalls: 10000,
                  geminiApiCalls: 5000,
               },
            },
         });

         // Generate JWT token
         const token = generateToken({ id: user._id });

         return {
            success: true,
            user: {
               id: user._id,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               role: user.role,
               isEmailVerified: user.isEmailVerified,
               subscription: user.subscription,
            },
            token,
         };
      } catch (error) {
         throw error;
      }
   }

   // Login user
   async login(email, password) {
      try {
         // Find user and include password for comparison
         const user = await User.findOne({ email }).select("+password");

         if (!user) {
            throw new Error("Invalid email or password");
         }

         if (!user.isActive) {
            throw new Error("Account is deactivated");
         }

         // Check password
         const isPasswordValid = await user.comparePassword(password);
         if (!isPasswordValid) {
            throw new Error("Invalid email or password");
         }

         // Update last login
         user.lastLogin = new Date();
         await user.save();

         // Generate JWT token
         const token = generateToken({ id: user._id });

         return {
            success: true,
            user: {
               id: user._id,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               role: user.role,
               isEmailVerified: user.isEmailVerified,
               lastLogin: user.lastLogin,
               subscription: user.subscription,
            },
            token,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get current user profile
   async getProfile(userId) {
      try {
         const user = await User.findById(userId);

         if (!user) {
            throw new Error("User not found");
         }

         return {
            success: true,
            user,
         };
      } catch (error) {
         throw error;
      }
   }

   // Update user profile
   async updateProfile(userId, updateData) {
      try {
         const allowedUpdates = [
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
         ];
         const updates = {};

         // Filter allowed updates
         Object.keys(updateData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
               updates[key] = updateData[key];
            }
         });

         const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
         });

         if (!user) {
            throw new Error("User not found");
         }

         return {
            success: true,
            user,
         };
      } catch (error) {
         throw error;
      }
   }

   // Change password
   async changePassword(userId, currentPassword, newPassword) {
      try {
         const user = await User.findById(userId).select("+password");

         if (!user) {
            throw new Error("User not found");
         }

         // Verify current password
         const isCurrentPasswordValid = await user.comparePassword(
            currentPassword
         );
         if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
         }

         // Update password
         user.password = newPassword;
         await user.save();

         return {
            success: true,
            message: "Password changed successfully",
         };
      } catch (error) {
         throw error;
      }
   }

   // Generate password reset token
   async generatePasswordResetToken(email) {
      try {
         const user = await User.findOne({ email });

         if (!user) {
            throw new Error("User not found with this email");
         }

         // Generate reset token
         const resetToken = crypto.randomBytes(20).toString("hex");

         // Hash token and set to user
         user.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

         user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
         await user.save();

         return {
            success: true,
            resetToken,
            message: "Password reset token generated",
         };
      } catch (error) {
         throw error;
      }
   }

   // Reset password with token
   async resetPassword(token, newPassword) {
      try {
         // Hash token to compare with stored token
         const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

         const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
         });

         if (!user) {
            throw new Error("Invalid or expired reset token");
         }

         // Update password and clear reset token
         user.password = newPassword;
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         await user.save();

         return {
            success: true,
            message: "Password reset successfully",
         };
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new AuthService();
