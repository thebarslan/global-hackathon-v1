const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validation");
const {
   registerValidation,
   loginValidation,
   updateProfileValidation,
   changePasswordValidation,
   forgotPasswordValidation,
   resetPasswordValidation,
} = require("../validators/authValidator");

// Public routes
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post(
   "/forgot-password",
   forgotPasswordValidation,
   validate,
   authController.forgotPassword
);
router.post(
   "/reset-password",
   resetPasswordValidation,
   validate,
   authController.resetPassword
);

// Protected routes
router.use(protect); // All routes below this line require authentication

router.get("/profile", authController.getProfile);
router.put(
   "/profile",
   updateProfileValidation,
   validate,
   authController.updateProfile
);
router.put(
   "/change-password",
   changePasswordValidation,
   validate,
   authController.changePassword
);
router.post("/logout", authController.logout);

module.exports = router;
