const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Brand name is required"],
         trim: true,
         maxlength: [100, "Brand name cannot exceed 100 characters"],
      },
      description: {
         type: String,
         trim: true,
         maxlength: [500, "Description cannot exceed 500 characters"],
      },
      website: {
         type: String,
         trim: true,
         match: [/^https?:\/\/.+/, "Please enter a valid website URL"],
      },
      industry: {
         type: String,
         trim: true,
         maxlength: [50, "Industry cannot exceed 50 characters"],
      },
      keywords: [
         {
            type: String,
            trim: true,
            maxlength: [50, "Keyword cannot exceed 50 characters"],
         },
      ],
      isActive: {
         type: Boolean,
         default: true,
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      lastAnalyzed: Date,
      totalAnalyses: {
         type: Number,
         default: 0,
      },
      settings: {
         redditLimit: {
            type: Number,
            default: 20,
            min: 5,
            max: 100,
         },
         redditSort: {
            type: String,
            enum: ["new", "hot", "top", "relevance"],
            default: "new",
         },
         analysisFrequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "manual"],
            default: "manual",
         },
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better query performance
brandSchema.index({ name: 1 });
brandSchema.index({ createdBy: 1 });
brandSchema.index({ isActive: 1 });
brandSchema.index({ createdAt: -1 });

// Virtual for brand status
brandSchema.virtual("status").get(function () {
   if (!this.isActive) return "inactive";
   if (this.totalAnalyses === 0) return "never_analyzed";
   if (this.lastAnalyzed) {
      const daysSinceLastAnalysis = Math.floor(
         (Date.now() - this.lastAnalyzed.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastAnalysis > 30) return "stale";
      if (daysSinceLastAnalysis > 7) return "needs_update";
      return "fresh";
   }
   return "unknown";
});

// Transform output
brandSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Brand", brandSchema);
