const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validation");
const {
   createProductValidation,
   updateProductValidation,
   updateStockValidation,
   productIdValidation,
   categoryValidation,
   searchValidation,
   paginationValidation,
} = require("../validators/productValidator");

// Public routes (no authentication required)
router.get("/", paginationValidation, validate, productController.getProducts);
router.get(
   "/featured",
   paginationValidation,
   validate,
   productController.getFeaturedProducts
);
router.get(
   "/category/:category",
   categoryValidation,
   paginationValidation,
   validate,
   productController.getProductsByCategory
);
router.get(
   "/search",
   searchValidation,
   paginationValidation,
   validate,
   productController.searchProducts
);
router.get("/stats", productController.getProductStats);
router.get("/:id", productIdValidation, validate, productController.getProduct);

// Protected routes (authentication required)
router.use(protect);

// Admin/Moderator only routes
router.post(
   "/",
   authorize("admin", "moderator"),
   createProductValidation,
   validate,
   productController.createProduct
);
router.put(
   "/:id",
   authorize("admin", "moderator"),
   productIdValidation,
   updateProductValidation,
   validate,
   productController.updateProduct
);
router.delete(
   "/:id",
   authorize("admin", "moderator"),
   productIdValidation,
   validate,
   productController.deleteProduct
);
router.put(
   "/:id/stock",
   authorize("admin", "moderator"),
   productIdValidation,
   updateStockValidation,
   validate,
   productController.updateStock
);

module.exports = router;
