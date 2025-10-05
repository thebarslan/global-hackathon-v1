const express = require("express");
const router = express.Router();
const {
   getReports,
   getReport,
   createReport,
   updateReport,
   deleteReport,
   downloadReport,
   shareReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");
const {
   validateCreateReport,
   validateUpdateReport,
} = require("../validators/reportValidator");

// All routes are protected
router.use(protect);

// Report routes
router.route("/").get(getReports).post(validateCreateReport, createReport);
router
   .route("/:id")
   .get(getReport)
   .put(validateUpdateReport, updateReport)
   .delete(deleteReport);
router.route("/:id/download").get(downloadReport);
router.route("/:id/share").post(shareReport);

module.exports = router;
