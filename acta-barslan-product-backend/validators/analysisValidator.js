const { body, param, query } = require("express-validator");

const createAnalysisValidation = [
   body("brandId")
      .notEmpty()
      .withMessage("Brand ID is required")
      .isMongoId()
      .withMessage("Invalid brand ID"),

   body("keyword")
      .trim()
      .notEmpty()
      .withMessage("Keyword is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Keyword must be between 2 and 100 characters")
      .matches(/^[a-zA-Z0-9\s\-_]+$/)
      .withMessage(
         "Keyword can only contain letters, numbers, spaces, hyphens, and underscores"
      ),
];

const analysisIdValidation = [
   param("id").isMongoId().withMessage("Invalid analysis ID"),
];

const brandIdValidation = [
   param("brandId").isMongoId().withMessage("Invalid brand ID"),
];

const paginationValidation = [
   query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

   query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
];

const statusValidation = [
   query("status")
      .optional()
      .isIn(["pending", "processing", "completed", "failed"])
      .withMessage(
         "Status must be one of: pending, processing, completed, failed"
      ),
];

const sentimentValidation = [
   query("sentiment")
      .optional()
      .isIn(["positive", "negative", "neutral", "mixed"])
      .withMessage(
         "Sentiment must be one of: positive, negative, neutral, mixed"
      ),
];

module.exports = {
   createAnalysisValidation,
   analysisIdValidation,
   brandIdValidation,
   paginationValidation,
   statusValidation,
   sentimentValidation,
};
