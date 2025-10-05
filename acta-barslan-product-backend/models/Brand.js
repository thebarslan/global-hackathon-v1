const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Brand name is required"],
         trim: true,
         maxlength: [100, "Brand name cannot exceed 100 characters"],
      },
      keywords: [
         {
            type: String,
            trim: true,
            maxlength: [50, "Keyword cannot exceed 50 characters"],
         },
      ],
      status: {
         type: String,
         enum: ["active", "monitoring", "inactive"],
         default: "active",
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      lastAnalysisAt: Date,
      totalAnalyses: {
         type: Number,
         default: 0,
      },
      averageSentiment: {
         type: String,
         enum: ["positive", "neutral", "negative", "mixed"],
         default: "neutral",
      },
      sentimentScore: {
         type: Number,
         min: 0,
         max: 100,
         default: 50,
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
brandSchema.index({ status: 1 });
brandSchema.index({ createdAt: -1 });

// Transform output
brandSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Brand", brandSchema);
