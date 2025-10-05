const analysisService = require("../services/analysisService");

class AnalysisController {
   // Create new brand analysis
   async createAnalysis(req, res, next) {
      try {
         const { brandId, keyword } = req.body;

         if (!brandId || !keyword) {
            return res.status(400).json({
               success: false,
               message: "Brand ID and keyword are required",
            });
         }

         const result = await analysisService.createBrandAnalysis(
            brandId,
            keyword,
            req.user.id
         );

         res.status(201).json({
            success: true,
            message: "Analysis started successfully",
            data: result.analysis,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get analysis results
   async getAnalysis(req, res, next) {
      try {
         const result = await analysisService.getAnalysis(
            req.params.id,
            req.user.id
         );

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get all analyses for a brand
   async getBrandAnalyses(req, res, next) {
      try {
         const result = await analysisService.getBrandAnalyses(
            req.params.brandId,
            req.user.id,
            req.query
         );

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get analysis statistics
   async getAnalysisStats(req, res, next) {
      try {
         const result = await analysisService.getAnalysisStats(req.user.id);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Retry failed analysis
   async retryAnalysis(req, res, next) {
      try {
         const result = await analysisService.retryAnalysis(
            req.params.id,
            req.user.id
         );

         res.status(200).json({
            success: true,
            message: result.message,
         });
      } catch (error) {
         next(error);
      }
   }

   // Delete analysis
   async deleteAnalysis(req, res, next) {
      try {
         const result = await analysisService.deleteAnalysis(
            req.params.id,
            req.user.id
         );

         res.status(200).json({
            success: true,
            message: result.message,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get all analyses for user (across all brands)
   async getUserAnalyses(req, res, next) {
      try {
         const { page = 1, limit = 10, status, sentiment } = req.query;

         const result = await analysisService.getUserAnalyses(req.user.id, {
            page,
            limit,
            status,
            sentiment,
         });

         res.status(200).json({
            success: true,
            data: result.analyses,
            pagination: result.pagination,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get analysis insights (summary of recent analyses)
   async getAnalysisInsights(req, res, next) {
      try {
         // This would provide insights like trending sentiments, key themes, etc.
         // For now, return a placeholder response
         res.status(501).json({
            success: false,
            message: "Analysis insights endpoint is not yet implemented.",
         });
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new AnalysisController();
