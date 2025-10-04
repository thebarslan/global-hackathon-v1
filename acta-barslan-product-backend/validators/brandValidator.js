const { body, param, query } = require("express-validator");

const createBrandValidation = [
   body("name")
      .trim()
      .notEmpty()
      .withMessage("Brand name is required")
      .isLength({ max: 100 })
      .withMessage("Brand name cannot exceed 100 characters"),

   body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),

   body("website")
      .optional()
      .trim()
      .isURL()
      .withMessage("Please enter a valid website URL"),

   body("industry")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Industry cannot exceed 50 characters"),

   body("keywords")
      .optional()
      .isArray()
      .withMessage("Keywords must be an array"),

   body("keywords.*")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Each keyword cannot exceed 50 characters"),

   body("settings.redditLimit")
      .optional()
      .isInt({ min: 5, max: 100 })
      .withMessage("Reddit limit must be between 5 and 100"),

   body("settings.redditSort")
      .optional()
      .isIn(["new", "hot", "top", "relevance"])
      .withMessage("Reddit sort must be one of: new, hot, top, relevance"),

   body("settings.analysisFrequency")
      .optional()
      .isIn(["daily", "weekly", "monthly", "manual"])
      .withMessage(
         "Analysis frequency must be one of: daily, weekly, monthly, manual"
      ),
];

const updateBrandValidation = [
   body("name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Brand name cannot exceed 100 characters"),

   body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),

   body("website")
      .optional()
      .trim()
      .isURL()
      .withMessage("Please enter a valid website URL"),

   body("industry")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Industry cannot exceed 50 characters"),

   body("keywords")
      .optional()
      .isArray()
      .withMessage("Keywords must be an array"),

   body("keywords.*")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Each keyword cannot exceed 50 characters"),

   body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),

   body("settings.redditLimit")
      .optional()
      .isInt({ min: 5, max: 100 })
      .withMessage("Reddit limit must be between 5 and 100"),

   body("settings.redditSort")
      .optional()
      .isIn(["new", "hot", "top", "relevance"])
      .withMessage("Reddit sort must be one of: new, hot, top, relevance"),

   body("settings.analysisFrequency")
      .optional()
      .isIn(["daily", "weekly", "monthly", "manual"])
      .withMessage(
         "Analysis frequency must be one of: daily, weekly, monthly, manual"
      ),
];

const brandIdValidation = [
   param("id").isMongoId().withMessage("Invalid brand ID"),
];

const searchValidation = [
   query("q")
      .trim()
      .notEmpty()
      .withMessage("Search query is required")
      .isLength({ min: 2 })
      .withMessage("Search query must be at least 2 characters"),
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

module.exports = {
   createBrandValidation,
   updateBrandValidation,
   brandIdValidation,
   searchValidation,
   paginationValidation,
};
