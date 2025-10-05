const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
   {
      analysisId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Analysis",
         required: true,
      },
      brandName: {
         type: String,
         required: true,
         trim: true,
      },
      title: {
         type: String,
         required: true,
         trim: true,
         maxlength: [200, "Title cannot exceed 200 characters"],
      },
      type: {
         type: String,
         enum: ["executive_summary", "detailed_analysis", "custom"],
         required: true,
      },
      status: {
         type: String,
         enum: ["generating", "completed", "failed"],
         default: "generating",
      },
      completedAt: Date,
      filePath: String,
      downloadUrl: String,
      shareUrl: String,
      summary: {
         totalPosts: {
            type: Number,
            default: 0,
         },
         analyzedPosts: {
            type: Number,
            default: 0,
         },
         averageSentiment: {
            type: String,
            enum: ["positive", "negative", "neutral", "mixed"],
            default: "neutral",
         },
         sentimentScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 50,
         },
         topKeywords: [
            {
               keyword: String,
               frequency: Number,
               sentiment: {
                  type: String,
                  enum: ["positive", "negative", "neutral", "mixed"],
               },
            },
         ],
         sentimentDistribution: {
            positive: {
               type: Number,
               default: 0,
            },
            neutral: {
               type: Number,
               default: 0,
            },
            negative: {
               type: Number,
               default: 0,
            },
            mixed: {
               type: Number,
               default: 0,
            },
         },
         timeRange: {
            start: Date,
            end: Date,
         },
      },
      charts: [
         {
            id: String,
            type: {
               type: String,
               enum: [
                  "sentiment_pie",
                  "sentiment_timeline",
                  "keyword_cloud",
                  "subreddit_distribution",
               ],
            },
            title: String,
            data: mongoose.Schema.Types.Mixed,
            config: mongoose.Schema.Types.Mixed,
         },
      ],
      insights: [
         {
            id: String,
            type: {
               type: String,
               enum: ["trend", "anomaly", "recommendation", "warning"],
            },
            title: String,
            description: String,
            severity: {
               type: String,
               enum: ["low", "medium", "high"],
            },
            confidence: {
               type: Number,
               min: 0,
               max: 1,
            },
         },
      ],
      error: {
         message: String,
         code: String,
         timestamp: Date,
      },
      metadata: {
         generationTime: Number,
         fileSize: Number,
         chartCount: Number,
         insightCount: Number,
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better query performance
reportSchema.index({ analysisId: 1 });
reportSchema.index({ brandName: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ createdAt: -1 });

// Virtual for report quality
reportSchema.virtual("quality").get(function () {
   if (this.status !== "completed") return "unknown";

   if (this.summary.totalPosts < 10) return "low";
   if (this.charts.length === 0) return "medium";
   if (this.insights.length >= 3 && this.charts.length >= 2) return "high";
   return "good";
});

// Transform output
reportSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Report", reportSchema);
