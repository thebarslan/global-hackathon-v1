const { body, param, query } = require("express-validator");

const createProductValidation = [
   body("name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ max: 100 })
      .withMessage("Product name cannot exceed 100 characters"),

   body("description")
      .trim()
      .notEmpty()
      .withMessage("Product description is required")
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),

   body("price")
      .notEmpty()
      .withMessage("Product price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

   body("category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required")
      .isLength({ max: 50 })
      .withMessage("Category cannot exceed 50 characters"),

   body("brand")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Brand cannot exceed 50 characters"),

   body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

   body("images").optional().isArray().withMessage("Images must be an array"),

   body("images.*.url")
      .optional()
      .isURL()
      .withMessage("Image URL must be valid"),

   body("images.*.alt")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Image alt text cannot exceed 100 characters"),

   body("specifications.weight")
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Weight specification cannot exceed 20 characters"),

   body("specifications.dimensions")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Dimensions specification cannot exceed 50 characters"),

   body("specifications.color")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Color specification cannot exceed 30 characters"),

   body("specifications.material")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Material specification cannot exceed 50 characters"),

   body("specifications.warranty")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Warranty specification cannot exceed 50 characters"),

   body("tags").optional().isArray().withMessage("Tags must be an array"),

   body("tags.*")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Each tag cannot exceed 30 characters"),

   body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be a boolean"),
];

const updateProductValidation = [
   body("name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Product name cannot exceed 100 characters"),

   body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),

   body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

   body("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category cannot exceed 50 characters"),

   body("brand")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Brand cannot exceed 50 characters"),

   body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

   body("images").optional().isArray().withMessage("Images must be an array"),

   body("images.*.url")
      .optional()
      .isURL()
      .withMessage("Image URL must be valid"),

   body("images.*.alt")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Image alt text cannot exceed 100 characters"),

   body("specifications.weight")
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Weight specification cannot exceed 20 characters"),

   body("specifications.dimensions")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Dimensions specification cannot exceed 50 characters"),

   body("specifications.color")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Color specification cannot exceed 30 characters"),

   body("specifications.material")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Material specification cannot exceed 50 characters"),

   body("specifications.warranty")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Warranty specification cannot exceed 50 characters"),

   body("tags").optional().isArray().withMessage("Tags must be an array"),

   body("tags.*")
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Each tag cannot exceed 30 characters"),

   body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be a boolean"),

   body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
];

const updateStockValidation = [
   body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
];

const productIdValidation = [
   param("id").isMongoId().withMessage("Invalid product ID"),
];

const categoryValidation = [
   param("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ max: 50 })
      .withMessage("Category cannot exceed 50 characters"),
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

   query("sort")
      .optional()
      .trim()
      .matches(/^-?[a-zA-Z]+$/)
      .withMessage("Sort field must be a valid field name"),
];

module.exports = {
   createProductValidation,
   updateProductValidation,
   updateStockValidation,
   productIdValidation,
   categoryValidation,
   searchValidation,
   paginationValidation,
};
