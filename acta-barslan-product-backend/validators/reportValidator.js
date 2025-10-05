const { body } = require("express-validator");

// Validation rules for creating a report
const validateCreateReport = [
   body("analysisId")
      .notEmpty()
      .withMessage("Analysis ID is required")
      .isMongoId()
      .withMessage("Invalid analysis ID"),

   body("title")
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters")
      .trim(),

   body("type")
      .notEmpty()
      .withMessage("Report type is required")
      .isIn(["executive_summary", "detailed_analysis", "custom"])
      .withMessage("Invalid report type"),

   body("includeCharts")
      .optional()
      .isBoolean()
      .withMessage("Include charts must be a boolean"),

   body("includeInsights")
      .optional()
      .isBoolean()
      .withMessage("Include insights must be a boolean"),
];

// Validation rules for updating a report
const validateUpdateReport = [
   body("title")
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters")
      .trim(),

   body("status")
      .optional()
      .isIn(["generating", "completed", "failed"])
      .withMessage("Invalid status"),

   body("filePath")
      .optional()
      .isString()
      .withMessage("File path must be a string"),

   body("downloadUrl")
      .optional()
      .isURL()
      .withMessage("Download URL must be a valid URL"),

   body("shareUrl")
      .optional()
      .isURL()
      .withMessage("Share URL must be a valid URL"),
];

module.exports = {
   validateCreateReport,
   validateUpdateReport,
};
