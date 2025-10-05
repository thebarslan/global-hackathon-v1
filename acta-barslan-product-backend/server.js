const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const routes = require("./routes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
   cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

// Static file serving for reports
const path = require("path");
app.use("/reports", express.static(path.join(__dirname, "reports")));

// Rate limiting
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
   },
   standardHeaders: true,
   legacyHeaders: false,
});

app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
} else {
   app.use(morgan("combined"));
}

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
   res.status(200).json({
      success: true,
      message: "Acta Barslan Product Management API",
      version: "1.0.0",
      documentation: "/api/health",
      endpoints: {
         auth: "/api/auth",
         products: "/api/products",
         health: "/api/health",
      },
   });
});

// 404 handler for non-API routes
app.use("*", (req, res) => {
   res.status(404).json({
      success: false,
      message: "Route not found",
      availableRoutes: [
         "GET /",
         "GET /api/health",
         "POST /api/auth/register",
         "POST /api/auth/login",
         "GET /api/products",
         "GET /api/products/:id",
      ],
   });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
   console.log(
      `🚀 Server running in ${
         process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
   );
   console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
   console.log(
      `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
   );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
   console.log(`❌ Unhandled Rejection: ${err.message}`);
   // Close server & exit process
   server.close(() => {
      process.exit(1);
   });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
   console.log(`❌ Uncaught Exception: ${err.message}`);
   process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
   console.log("🛑 SIGTERM received. Shutting down gracefully...");
   server.close(() => {
      console.log("✅ Process terminated");
   });
});

module.exports = app;
