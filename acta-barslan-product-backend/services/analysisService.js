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
            brandId: brandId,
            brandName: brand.name,
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
               brandId: analysis.brandId,
               brandName: brand.name,
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

         // Update status to in_progress
         analysis.status = "in_progress";
         await analysis.save();

         const startTime = Date.now();

         // Step 1: Fetch Reddit posts (100 posts for batch processing)
         console.log(`Fetching Reddit posts for keyword: ${analysis.keyword}`);
         const redditPosts = await redditService.searchPosts(analysis.keyword, {
            limit: 100, // Increased to 100 for batch processing
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

         // Step 2: Batch analyze sentiment with Gemini (10 posts per batch)
         console.log(
            `Batch analyzing sentiment for ${redditPosts.length} posts`
         );
         const batchSize = 10;
         const batches = [];

         // Split posts into batches of 10
         for (let i = 0; i < redditPosts.length; i += batchSize) {
            batches.push(redditPosts.slice(i, i + batchSize));
         }

         console.log(
            `Processing ${batches.length} batches of ${batchSize} posts each`
         );

         const allBatchResults = [];
         let totalRelevantPosts = 0;
         let totalIrrelevantPosts = 0;
         let totalGeminiApiCalls = 0;

         // Process each batch
         for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            console.log(
               `Processing batch ${batchIndex + 1}/${batches.length} (${
                  batch.length
               } posts)`
            );

            try {
               const batchResult = await geminiService.analyzeSentiment(
                  batch,
                  analysis.keyword
               );

               totalGeminiApiCalls++;

               // Process batch results and filter relevant posts
               if (batchResult.analysis && batchResult.analysis.breakdown) {
                  batchResult.analysis.breakdown.forEach((item, itemIndex) => {
                     const post = batch[itemIndex];

                     // Check if post is relevant (confidence > 60% and not explicitly irrelevant)
                     const isRelevant =
                        item.confidence > 60 &&
                        item.sentiment !== "neutral" &&
                        !item.summary.toLowerCase().includes("not relevant") &&
                        !item.summary
                           .toLowerCase()
                           .includes("does not mention");

                     if (isRelevant) {
                        totalRelevantPosts++;
                        allBatchResults.push({
                           postId: post?.id || `${batchIndex}-${itemIndex}`,
                           sentiment: item.sentiment,
                           confidence: item.confidence,
                           keywords: item.key_phrases || [],
                           summary: item.summary,
                           postTitle: post?.title || "",
                           postContent: post?.content || "",
                           subreddit: post?.subreddit || "",
                           score: post?.score || 0,
                        });
                     } else {
                        totalIrrelevantPosts++;
                     }
                  });
               }

               // Update progress after each batch
               const currentProgress = Math.round(
                  ((batchIndex + 1) / batches.length) * 100
               );
               analysis.progress = currentProgress;
               await analysis.save();
               console.log(
                  `Progress updated for analysis ${analysisId}: ${currentProgress}% (batch ${
                     batchIndex + 1
                  }/${batches.length})`
               );

               // Small delay between batches to avoid rate limiting
               if (batchIndex < batches.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
               }
            } catch (batchError) {
               console.error(
                  `Error processing batch ${batchIndex + 1}:`,
                  batchError
               );
               // Continue with next batch even if one fails
            }
         }

         console.log(
            `Batch processing complete: ${totalRelevantPosts} relevant, ${totalIrrelevantPosts} irrelevant posts`
         );

         // Update analysis with filtered sentiment results
         analysis.sentimentResults = allBatchResults;
         analysis.totalPosts = redditPosts.length;
         analysis.analyzedPosts = totalRelevantPosts;
         analysis.irrelevantPosts = totalIrrelevantPosts;

         // Calculate overall sentiment from relevant posts only
         if (allBatchResults.length > 0) {
            const sentimentCounts = {
               positive: 0,
               negative: 0,
               neutral: 0,
               mixed: 0,
            };

            let totalConfidence = 0;

            allBatchResults.forEach((result) => {
               sentimentCounts[result.sentiment]++;
               totalConfidence += result.confidence;
            });

            // Determine overall sentiment
            const maxSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
               sentimentCounts[a] > sentimentCounts[b] ? a : b
            );

            analysis.averageSentiment = maxSentiment;
            analysis.sentimentScore = Math.round(
               totalConfidence / allBatchResults.length
            );
         } else {
            analysis.averageSentiment = "neutral";
            analysis.sentimentScore = 50;
         }

         // Update metadata
         analysis.metadata = {
            redditApiCalls: 1,
            geminiApiCalls: totalGeminiApiCalls,
            totalProcessingTime: Date.now() - startTime,
            postsAnalyzed: totalRelevantPosts,
            totalPostsFound: redditPosts.length,
            irrelevantPosts: totalIrrelevantPosts,
            batchSize: batchSize,
            batchesProcessed: batches.length,
         };

         // Mark as completed
         analysis.status = "completed";
         analysis.progress = 100;
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

   // Get all analyses for user (across all brands)
   async getUserAnalyses(userId, options = {}) {
      try {
         const { page = 1, limit = 10, status, sentiment } = options;

         // Build query
         const query = { createdBy: userId };

         if (status) {
            query.status = status;
         }

         if (sentiment) {
            query.averageSentiment = sentiment;
         }

         // Calculate pagination
         const skip = (page - 1) * limit;

         // Get analyses with pagination
         const analyses = await Analysis.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("brandId", "name keywords");

         // Get total count for pagination
         const total = await Analysis.countDocuments(query);

         // Format the response
         const formattedAnalyses = analyses.map((analysis) => ({
            _id: analysis._id,
            brandId: analysis.brandId,
            brandName: analysis.brandName,
            keyword: analysis.keyword,
            status: analysis.status,
            progress: analysis.progress,
            redditPosts: analysis.redditPosts,
            sentimentResults: analysis.sentimentResults,
            createdAt: analysis.createdAt,
            startedAt: analysis.startedAt,
            completedAt: analysis.completedAt,
            totalPosts: analysis.totalPosts,
            analyzedPosts: analysis.analyzedPosts,
            averageSentiment: analysis.averageSentiment,
            sentimentScore: analysis.sentimentScore,
            metadata: analysis.metadata,
         }));

         return {
            success: true,
            analyses: formattedAnalyses,
            pagination: {
               page: parseInt(page),
               limit: parseInt(limit),
               total,
               pages: Math.ceil(total / limit),
            },
         };
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new AnalysisService();
