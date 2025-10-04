const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validation");
const {
   createBrandValidation,
   updateBrandValidation,
   brandIdValidation,
   searchValidation,
   paginationValidation,
} = require("../validators/brandValidator");

// All routes require authentication
router.use(protect);

// Brand CRUD operations
router.post("/", createBrandValidation, validate, brandController.createBrand);
router.get("/", paginationValidation, validate, brandController.getUserBrands);
router.get("/stats", brandController.getBrandStats);
router.get(
   "/search",
   searchValidation,
   paginationValidation,
   validate,
   brandController.searchBrands
);
router.get("/needing-analysis", brandController.getBrandsNeedingAnalysis);
router.get("/:id", brandIdValidation, validate, brandController.getBrand);
router.put(
   "/:id",
   brandIdValidation,
   updateBrandValidation,
   validate,
   brandController.updateBrand
);
router.delete("/:id", brandIdValidation, validate, brandController.deleteBrand);
router.patch(
   "/:id/toggle-status",
   brandIdValidation,
   validate,
   brandController.toggleBrandStatus
);

module.exports = router;
