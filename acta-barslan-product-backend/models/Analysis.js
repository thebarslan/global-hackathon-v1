const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
   {
      brandId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Brand",
         required: true,
      },
      brandName: {
         type: String,
         required: true,
         trim: true,
      },
      keyword: {
         type: String,
         required: true,
         trim: true,
      },
      status: {
         type: String,
         enum: ["pending", "in_progress", "completed", "failed"],
         default: "pending",
      },
      progress: {
         type: Number,
         min: 0,
         max: 100,
         default: 0,
      },
      redditPosts: [
         {
            id: String,
            title: String,
            content: String,
            author: String,
            subreddit: String,
            score: Number,
            upvoteRatio: Number,
            createdAt: Date,
            url: String,
            permalink: String,
         },
      ],
      sentimentResults: [
         {
            postId: String,
            sentiment: {
               type: String,
               enum: [
                  "positive",
                  "negative",
                  "neutral",
                  "mixed",
                  "not applicable",
               ],
            },
            confidence: Number,
            keywords: [String],
            summary: String,
            postTitle: String,
            postContent: String,
            subreddit: String,
            score: Number,
         },
      ],
      startedAt: Date,
      completedAt: Date,
      totalPosts: {
         type: Number,
         default: 0,
      },
      analyzedPosts: {
         type: Number,
         default: 0,
      },
      irrelevantPosts: {
         type: Number,
         default: 0,
      },
      averageSentiment: {
         type: String,
         enum: ["positive", "negative", "neutral", "mixed", "not applicable"],
         default: "neutral",
      },
      sentimentScore: {
         type: Number,
         min: 0,
         max: 100,
         default: 50,
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
analysisSchema.index({ brandId: 1 });
analysisSchema.index({ brandName: 1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ averageSentiment: 1 });

// Virtual for analysis quality
analysisSchema.virtual("quality").get(function () {
   if (this.status !== "completed") return "unknown";

   if (this.totalPosts < 5) return "low";
   if (this.analyzedPosts < this.totalPosts * 0.8) return "medium";
   if (this.totalPosts >= 20 && this.analyzedPosts === this.totalPosts)
      return "high";
   return "good";
});

// Transform output
analysisSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Analysis", analysisSchema);
