const { body } = require("express-validator");

const registerValidation = [
   body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ max: 50 })
      .withMessage("First name cannot exceed 50 characters"),

   body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ max: 50 })
      .withMessage("Last name cannot exceed 50 characters"),

   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),

   body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
];

const loginValidation = [
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),

   body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
   body("firstName")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("First name cannot exceed 50 characters"),

   body("lastName")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Last name cannot exceed 50 characters"),

   body("phoneNumber")
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),

   body("address.street")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Street address cannot exceed 100 characters"),

   body("address.city")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("City cannot exceed 50 characters"),

   body("address.state")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("State cannot exceed 50 characters"),

   body("address.zipCode")
      .optional()
      .trim()
      .isPostalCode("any")
      .withMessage("Please enter a valid zip code"),

   body("address.country")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Country cannot exceed 50 characters"),
];

const changePasswordValidation = [
   body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

   body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "New password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
];

const forgotPasswordValidation = [
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
];

const resetPasswordValidation = [
   body("token").notEmpty().withMessage("Reset token is required"),

   body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "New password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
];

module.exports = {
   registerValidation,
   loginValidation,
   updateProfileValidation,
   changePasswordValidation,
   forgotPasswordValidation,
   resetPasswordValidation,
};
