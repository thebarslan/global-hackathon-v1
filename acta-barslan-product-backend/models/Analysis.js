const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
   {
      brand: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Brand",
         required: true,
      },
      keyword: {
         type: String,
         required: [true, "Keyword is required"],
         trim: true,
      },
      redditPosts: [
         {
            title: String,
            content: String,
            author: String,
            subreddit: String,
            url: String,
            score: Number,
            numComments: Number,
            createdAt: Date,
            postId: String,
         },
      ],
      sentimentAnalysis: {
         overall: {
            sentiment: {
               type: String,
               enum: ["positive", "negative", "neutral", "mixed"],
               required: true,
            },
            confidence: {
               type: Number,
               min: 0,
               max: 1,
               required: true,
            },
            score: {
               type: Number,
               min: -1,
               max: 1,
               required: true,
            },
         },
         breakdown: [
            {
               postId: String,
               sentiment: {
                  type: String,
                  enum: ["positive", "negative", "neutral"],
               },
               confidence: Number,
               score: Number,
               reasoning: String,
            },
         ],
         summary: {
            positiveCount: {
               type: Number,
               default: 0,
            },
            negativeCount: {
               type: Number,
               default: 0,
            },
            neutralCount: {
               type: Number,
               default: 0,
            },
            totalPosts: {
               type: Number,
               default: 0,
            },
         },
      },
      geminiResponse: {
         rawResponse: String,
         processingTime: Number,
         model: String,
         tokensUsed: Number,
      },
      status: {
         type: String,
         enum: ["pending", "processing", "completed", "failed"],
         default: "pending",
      },
      error: {
         message: String,
         code: String,
         timestamp: Date,
      },
      metadata: {
         redditApiCalls: Number,
         geminiApiCalls: Number,
         totalProcessingTime: Number,
         postsAnalyzed: Number,
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
analysisSchema.index({ brand: 1 });
analysisSchema.index({ keyword: 1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ "sentimentAnalysis.overall.sentiment": 1 });

// Virtual for analysis quality
analysisSchema.virtual("quality").get(function () {
   if (this.status !== "completed") return "unknown";

   const { confidence, totalPosts } = this.sentimentAnalysis.overall;

   if (totalPosts < 5) return "low";
   if (confidence < 0.6) return "medium";
   if (totalPosts >= 20 && confidence >= 0.8) return "high";
   return "good";
});

// Virtual for sentiment trend
analysisSchema.virtual("trend").get(function () {
   if (this.status !== "completed") return "unknown";

   const { score } = this.sentimentAnalysis.overall;

   if (score > 0.3) return "very_positive";
   if (score > 0.1) return "positive";
   if (score > -0.1) return "neutral";
   if (score > -0.3) return "negative";
   return "very_negative";
});

// Transform output
analysisSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Analysis", analysisSchema);
