const Report = require("../models/Report");
const Analysis = require("../models/Analysis");
const Brand = require("../models/Brand");
const reportService = require("../services/reportService");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
   const reports = await Report.find({ createdBy: req.user.id })
      .populate("analysisId", "brandName averageSentiment sentimentScore")
      .sort({ createdAt: -1 });

   res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
   });
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReport = asyncHandler(async (req, res) => {
   const report = await Report.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
   }).populate("analysisId", "brandName averageSentiment sentimentScore");

   if (!report) {
      return res.status(404).json({
         success: false,
         message: "Report not found",
      });
   }

   res.status(200).json({
      success: true,
      data: report,
   });
});

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
   const { analysisId, title, type, includeCharts, includeInsights } = req.body;

   // Check if analysis exists and belongs to user
   const analysis = await Analysis.findOne({
      _id: analysisId,
      createdBy: req.user.id,
   });

   if (!analysis) {
      return res.status(404).json({
         success: false,
         message: "Analysis not found",
      });
   }

   if (analysis.status !== "completed") {
      return res.status(400).json({
         success: false,
         message: "Analysis must be completed to generate report",
      });
   }

   // Get brand information
   const brand = await Brand.findById(analysis.brandId);
   if (!brand) {
      return res.status(404).json({
         success: false,
         message: "Brand not found",
      });
   }

   // Create report
   const reportData = {
      analysisId,
      brandName: brand.name,
      title: title || `${type.replace(/_/g, " ")} Report - ${brand.name}`,
      type,
      status: "generating",
      createdBy: req.user.id,
      summary: {
         totalPosts: analysis.totalPosts,
         analyzedPosts: analysis.analyzedPosts,
         averageSentiment: analysis.averageSentiment,
         sentimentScore: analysis.sentimentScore,
         topKeywords: analysis.sentimentResults
            .map((result) => result.keywords)
            .flat()
            .reduce((acc, keyword) => {
               acc[keyword] = (acc[keyword] || 0) + 1;
               return acc;
            }, {}),
         sentimentDistribution: {
            positive: analysis.sentimentResults.filter(
               (r) => r.sentiment === "positive"
            ).length,
            neutral: analysis.sentimentResults.filter(
               (r) => r.sentiment === "neutral"
            ).length,
            negative: analysis.sentimentResults.filter(
               (r) => r.sentiment === "negative"
            ).length,
            mixed: analysis.sentimentResults.filter(
               (r) => r.sentiment === "mixed"
            ).length,
         },
         timeRange: {
            start: analysis.createdAt,
            end: analysis.completedAt || new Date(),
         },
      },
   };

   const report = await Report.create(reportData);

   // Start report generation process in background
   reportService.generateReport(report._id).catch((error) => {
      console.error(
         `Background report generation failed for ${report._id}:`,
         error
      );
   });

   res.status(201).json({
      success: true,
      message: "Report generation started",
      data: report,
   });
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
   const report = await Report.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
   });

   if (!report) {
      return res.status(404).json({
         success: false,
         message: "Report not found",
      });
   }

   const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );

   res.status(200).json({
      success: true,
      data: updatedReport,
   });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
   const report = await Report.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
   });

   if (!report) {
      return res.status(404).json({
         success: false,
         message: "Report not found",
      });
   }

   await Report.findByIdAndDelete(req.params.id);

   res.status(200).json({
      success: true,
      message: "Report deleted successfully",
   });
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
const downloadReport = asyncHandler(async (req, res) => {
   const report = await Report.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
   });

   if (!report) {
      return res.status(404).json({
         success: false,
         message: "Report not found",
      });
   }

   if (report.status !== "completed") {
      return res.status(400).json({
         success: false,
         message: "Report is not ready for download",
      });
   }

   if (!report.filePath) {
      return res.status(404).json({
         success: false,
         message: "Report file not found",
      });
   }

   // Get download info from service
   const downloadInfo = await reportService.downloadReport(report._id);

   // Check if file exists
   const fs = require("fs");
   if (!fs.existsSync(downloadInfo.filePath)) {
      return res.status(404).json({
         success: false,
         message: "Report file not found on server",
      });
   }

   // Set headers for file download
   res.setHeader("Content-Type", "application/pdf");
   res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadInfo.fileName}"`
   );

   // Stream the file
   const fileStream = fs.createReadStream(downloadInfo.filePath);
   fileStream.pipe(res);

   fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
         res.status(500).json({
            success: false,
            message: "Error streaming file",
         });
      }
   });
});

// @desc    Share report
// @route   POST /api/reports/:id/share
// @access  Private
const shareReport = asyncHandler(async (req, res) => {
   const report = await Report.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
   });

   if (!report) {
      return res.status(404).json({
         success: false,
         message: "Report not found",
      });
   }

   if (report.status !== "completed") {
      return res.status(400).json({
         success: false,
         message: "Report is not ready for sharing",
      });
   }

   // Generate share URL
   const shareUrl = `${process.env.FRONTEND_URL}/share/report/${report._id}`;

   // Update report with share URL
   report.shareUrl = shareUrl;
   await report.save();

   res.status(200).json({
      success: true,
      data: {
         shareUrl,
         reportId: report._id,
      },
   });
});

module.exports = {
   getReports,
   getReport,
   createReport,
   updateReport,
   deleteReport,
   downloadReport,
   shareReport,
};
