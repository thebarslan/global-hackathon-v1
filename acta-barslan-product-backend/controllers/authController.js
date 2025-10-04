const authService = require("../services/authService");

class AuthController {
   // Register new user
   async register(req, res, next) {
      try {
         const result = await authService.register(req.body);

         res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Login user
   async login(req, res, next) {
      try {
         const { email, password } = req.body;
         const result = await authService.login(email, password);

         res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get current user profile
   async getProfile(req, res, next) {
      try {
         const result = await authService.getProfile(req.user.id);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Update user profile
   async updateProfile(req, res, next) {
      try {
         const result = await authService.updateProfile(req.user.id, req.body);

         res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Change password
   async changePassword(req, res, next) {
      try {
         const { currentPassword, newPassword } = req.body;
         const result = await authService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
         );

         res.status(200).json({
            success: true,
            message: result.message,
         });
      } catch (error) {
         next(error);
      }
   }

   // Generate password reset token
   async forgotPassword(req, res, next) {
      try {
         const { email } = req.body;
         const result = await authService.generatePasswordResetToken(email);

         res.status(200).json({
            success: true,
            message: "Password reset token sent to email",
            // In production, you would send the token via email
            // For development, you might want to return the token
            ...(process.env.NODE_ENV === "development" && {
               resetToken: result.resetToken,
            }),
         });
      } catch (error) {
         next(error);
      }
   }

   // Reset password with token
   async resetPassword(req, res, next) {
      try {
         const { token, newPassword } = req.body;
         const result = await authService.resetPassword(token, newPassword);

         res.status(200).json({
            success: true,
            message: result.message,
         });
      } catch (error) {
         next(error);
      }
   }

   // Logout (client-side token removal)
   async logout(req, res, next) {
      try {
         res.status(200).json({
            success: true,
            message: "Logout successful",
         });
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new AuthController();
