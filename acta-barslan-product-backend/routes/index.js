const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const productRoutes = require("./products");
const brandRoutes = require("./brands");
const analysisRoutes = require("./analyses");

// Health check endpoint
router.get("/health", (req, res) => {
   res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
         reddit: "Available",
         gemini: process.env.GEMINI_API_KEY ? "Configured" : "Not configured",
      },
   });
});

// API routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/brands", brandRoutes);
router.use("/analyses", analysisRoutes);

// 404 handler for API routes
router.use("*", (req, res) => {
   res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: [
         "GET /api/health",
         "POST /api/auth/register",
         "POST /api/auth/login",
         "GET /api/brands",
         "POST /api/brands",
         "GET /api/analyses",
         "POST /api/analyses",
      ],
   });
});

module.exports = router;
