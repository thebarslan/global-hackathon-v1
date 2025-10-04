const Brand = require("../models/Brand");
const Analysis = require("../models/Analysis");
const redditService = require("./redditService");
const geminiService = require("./geminiService");

class AnalysisService {
   // Create new brand analysis
   async createBrandAnalysis(brandId, keyword, userId) {
      try {
         const brand = await Brand.findById(brandId);
         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to analyze this brand");
         }

         // Create analysis record
         const analysis = await Analysis.create({
            brand: brandId,
            keyword,
            createdBy: userId,
            status: "pending",
         });

         // Start analysis process (async)
         this.performAnalysis(analysis._id).catch((error) => {
            console.error(`Analysis ${analysis._id} failed:`, error.message);
         });

         return {
            success: true,
            analysis: {
               id: analysis._id,
               brand: brand.name,
               keyword,
               status: "pending",
               createdAt: analysis.createdAt,
            },
         };
      } catch (error) {
         throw error;
      }
   }

   // Perform the actual analysis (Reddit + Gemini)
   async performAnalysis(analysisId) {
      try {
         const analysis = await Analysis.findById(analysisId);
         if (!analysis) {
            throw new Error("Analysis not found");
         }

         // Update status to processing
         analysis.status = "processing";
         await analysis.save();

         const startTime = Date.now();

         // Step 1: Fetch Reddit posts
         console.log(`Fetching Reddit posts for keyword: ${analysis.keyword}`);
         const redditPosts = await redditService.searchPosts(analysis.keyword, {
            limit: 20,
            sort: "new",
         });

         if (redditPosts.length === 0) {
            throw new Error("No Reddit posts found for the given keyword");
         }

         // Update analysis with Reddit posts
         analysis.redditPosts = redditPosts.map((post) => ({
            title: post.title,
            content: post.content,
            author: post.author,
            subreddit: post.subreddit,
            url: post.url,
            score: post.score,
            numComments: post.numComments,
            createdAt: post.createdAt,
            postId: post.postId,
         }));

         // Step 2: Analyze sentiment with Gemini
         console.log(`Analyzing sentiment for ${redditPosts.length} posts`);
         const sentimentResult = await geminiService.analyzeSentiment(
            redditPosts,
            analysis.keyword
         );

         // Update analysis with sentiment results
         analysis.sentimentAnalysis = {
            overall: sentimentResult.analysis.overall,
            breakdown: sentimentResult.analysis.breakdown,
            summary: sentimentResult.analysis.summary,
         };

         analysis.geminiResponse = {
            rawResponse: sentimentResult.metadata.rawResponse,
            processingTime: sentimentResult.metadata.processingTime,
            model: sentimentResult.metadata.model,
            tokensUsed: sentimentResult.metadata.tokensUsed,
         };

         // Update metadata
         analysis.metadata = {
            redditApiCalls: 1,
            geminiApiCalls: 1,
            totalProcessingTime: Date.now() - startTime,
            postsAnalyzed: redditPosts.length,
         };

         // Mark as completed
         analysis.status = "completed";
         await analysis.save();

         // Update brand's last analyzed timestamp
         await Brand.findByIdAndUpdate(analysis.brand, {
            lastAnalyzed: new Date(),
            $inc: { totalAnalyses: 1 },
         });

         console.log(`Analysis ${analysisId} completed successfully`);
         return analysis;
      } catch (error) {
         console.error(`Analysis ${analysisId} failed:`, error.message);

         // Update analysis with error
         await Analysis.findByIdAndUpdate(analysisId, {
            status: "failed",
            error: {
               message: error.message,
               code: error.code || "ANALYSIS_ERROR",
               timestamp: new Date(),
            },
         });

         throw error;
      }
   }

   // Get analysis results
   async getAnalysis(analysisId, userId) {
      try {
         const analysis = await Analysis.findById(analysisId)
            .populate("brand", "name description")
            .populate("createdBy", "firstName lastName email");

         if (!analysis) {
            throw new Error("Analysis not found");
         }

         if (analysis.createdBy._id.toString() !== userId.toString()) {
            throw new Error("Unauthorized to view this analysis");
         }

         return {
            success: true,
            analysis,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get all analyses for a brand
   async getBrandAnalyses(brandId, userId, options = {}) {
      try {
         const { page = 1, limit = 10, status } = options;

         // Verify brand ownership
         const brand = await Brand.findById(brandId);
         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to view this brand's analyses");
         }

         // Build filter
         const filter = { brand: brandId };
         if (status) {
            filter.status = status;
         }

         // Calculate pagination
         const skip = (Number(page) - 1) * Number(limit);

         // Execute query
         const analyses = await Analysis.find(filter)
            .populate("brand", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

         const total = await Analysis.countDocuments(filter);

         return {
            success: true,
            analyses,
            pagination: {
               currentPage: Number(page),
               totalPages: Math.ceil(total / Number(limit)),
               totalAnalyses: total,
               hasNext: Number(page) < Math.ceil(total / Number(limit)),
               hasPrev: Number(page) > 1,
            },
         };
      } catch (error) {
         throw error;
      }
   }

   // Get analysis statistics
   async getAnalysisStats(userId) {
      try {
         const stats = await Analysis.aggregate([
            {
               $lookup: {
                  from: "brands",
                  localField: "brand",
                  foreignField: "_id",
                  as: "brand",
               },
            },
            {
               $match: {
                  "brand.createdBy": userId,
               },
            },
            {
               $group: {
                  _id: null,
                  totalAnalyses: { $sum: 1 },
                  completedAnalyses: {
                     $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                  },
                  failedAnalyses: {
                     $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
                  },
                  pendingAnalyses: {
                     $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                  },
                  avgProcessingTime: { $avg: "$metadata.totalProcessingTime" },
                  totalPostsAnalyzed: { $sum: "$metadata.postsAnalyzed" },
               },
            },
         ]);

         const sentimentStats = await Analysis.aggregate([
            {
               $lookup: {
                  from: "brands",
                  localField: "brand",
                  foreignField: "_id",
                  as: "brand",
               },
            },
            {
               $match: {
                  "brand.createdBy": userId,
                  status: "completed",
               },
            },
            {
               $group: {
                  _id: "$sentimentAnalysis.overall.sentiment",
                  count: { $sum: 1 },
                  avgConfidence: {
                     $avg: "$sentimentAnalysis.overall.confidence",
                  },
                  avgScore: { $avg: "$sentimentAnalysis.overall.score" },
               },
            },
         ]);

         return {
            success: true,
            stats: stats[0] || {
               totalAnalyses: 0,
               completedAnalyses: 0,
               failedAnalyses: 0,
               pendingAnalyses: 0,
               avgProcessingTime: 0,
               totalPostsAnalyzed: 0,
            },
            sentimentStats,
         };
      } catch (error) {
         throw error;
      }
   }

   // Retry failed analysis
   async retryAnalysis(analysisId, userId) {
      try {
         const analysis = await Analysis.findById(analysisId);
         if (!analysis) {
            throw new Error("Analysis not found");
         }

         if (analysis.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to retry this analysis");
         }

         if (analysis.status !== "failed") {
            throw new Error("Only failed analyses can be retried");
         }

         // Reset analysis
         analysis.status = "pending";
         analysis.error = undefined;
         await analysis.save();

         // Start analysis process again
         this.performAnalysis(analysisId).catch((error) => {
            console.error(
               `Retry analysis ${analysisId} failed:`,
               error.message
            );
         });

         return {
            success: true,
            message: "Analysis retry initiated",
         };
      } catch (error) {
         throw error;
      }
   }

   // Delete analysis
   async deleteAnalysis(analysisId, userId) {
      try {
         const analysis = await Analysis.findById(analysisId);
         if (!analysis) {
            throw new Error("Analysis not found");
         }

         if (analysis.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to delete this analysis");
         }

         await Analysis.findByIdAndDelete(analysisId);

         return {
            success: true,
            message: "Analysis deleted successfully",
         };
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new AnalysisService();
