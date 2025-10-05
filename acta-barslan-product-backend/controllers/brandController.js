const brandService = require("../services/brandService");

class BrandController {
   // Create new brand
   async createBrand(req, res, next) {
      try {
         const result = await brandService.createBrand(req.body, req.user.id);

         res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: result.brand,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get all brands for user
   async getUserBrands(req, res, next) {
      try {
         const result = await brandService.getUserBrands(
            req.user.id,
            req.query
         );

         res.status(200).json({
            success: true,
            data: result.brands,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get single brand
   async getBrand(req, res, next) {
      try {
         const result = await brandService.getBrand(req.params.id, req.user.id);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Update brand
   async updateBrand(req, res, next) {
      try {
         const result = await brandService.updateBrand(
            req.params.id,
            req.body,
            req.user.id
         );

         res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Delete brand
   async deleteBrand(req, res, next) {
      try {
         const result = await brandService.deleteBrand(
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

   // Get brand statistics
   async getBrandStats(req, res, next) {
      try {
         const result = await brandService.getBrandStats(req.user.id);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Search brands
   async searchBrands(req, res, next) {
      try {
         const { q } = req.query;

         if (!q) {
            return res.status(400).json({
               success: false,
               message: "Search query is required",
            });
         }

         const result = await brandService.searchBrands(
            q,
            req.user.id,
            req.query.limit
         );

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get brands needing analysis
   async getBrandsNeedingAnalysis(req, res, next) {
      try {
         const result = await brandService.getBrandsNeedingAnalysis(
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

   // Toggle brand status
   async toggleBrandStatus(req, res, next) {
      try {
         const result = await brandService.toggleBrandStatus(
            req.params.id,
            req.user.id
         );

         res.status(200).json({
            success: true,
            message: result.message,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new BrandController();
