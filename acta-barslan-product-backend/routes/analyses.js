const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validation");
const {
   createAnalysisValidation,
   analysisIdValidation,
   brandIdValidation,
   paginationValidation,
   statusValidation,
   sentimentValidation,
} = require("../validators/analysisValidator");

// All routes require authentication
router.use(protect);

// Analysis operations
router.post(
   "/",
   createAnalysisValidation,
   validate,
   analysisController.createAnalysis
);

// Get all analyses for the authenticated user (alias for /user)
router.get(
   "/",
   paginationValidation,
   statusValidation,
   sentimentValidation,
   validate,
   analysisController.getUserAnalyses
);

router.get("/stats", analysisController.getAnalysisStats);
router.get("/insights", analysisController.getAnalysisInsights);
router.get(
   "/user",
   paginationValidation,
   statusValidation,
   sentimentValidation,
   validate,
   analysisController.getUserAnalyses
);

// Brand-specific analyses
router.get(
   "/brand/:brandId",
   brandIdValidation,
   paginationValidation,
   statusValidation,
   validate,
   analysisController.getBrandAnalyses
);

// Individual analysis operations
router.get(
   "/:id",
   analysisIdValidation,
   validate,
   analysisController.getAnalysis
);
router.post(
   "/:id/retry",
   analysisIdValidation,
   validate,
   analysisController.retryAnalysis
);
router.delete(
   "/:id",
   analysisIdValidation,
   validate,
   analysisController.deleteAnalysis
);

module.exports = router;
