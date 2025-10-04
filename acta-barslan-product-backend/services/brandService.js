const Brand = require("../models/Brand");

class BrandService {
   // Create new brand
   async createBrand(brandData, userId) {
      try {
         const brand = await Brand.create({
            ...brandData,
            createdBy: userId,
         });

         const populatedBrand = await Brand.findById(brand._id).populate(
            "createdBy",
            "firstName lastName email"
         );

         return {
            success: true,
            brand: populatedBrand,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get all brands for a user
   async getUserBrands(userId, options = {}) {
      try {
         const { page = 1, limit = 10, search, isActive } = options;

         // Build filter
         const filter = { createdBy: userId };

         if (search) {
            filter.$or = [
               { name: new RegExp(search, "i") },
               { description: new RegExp(search, "i") },
               { industry: new RegExp(search, "i") },
            ];
         }

         if (isActive !== undefined) {
            filter.isActive = isActive === "true";
         }

         // Calculate pagination
         const skip = (Number(page) - 1) * Number(limit);

         // Execute query
         const brands = await Brand.find(filter)
            .populate("createdBy", "firstName lastName email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

         const total = await Brand.countDocuments(filter);

         return {
            success: true,
            brands,
            pagination: {
               currentPage: Number(page),
               totalPages: Math.ceil(total / Number(limit)),
               totalBrands: total,
               hasNext: Number(page) < Math.ceil(total / Number(limit)),
               hasPrev: Number(page) > 1,
            },
         };
      } catch (error) {
         throw error;
      }
   }

   // Get single brand
   async getBrand(brandId, userId) {
      try {
         const brand = await Brand.findById(brandId).populate(
            "createdBy",
            "firstName lastName email"
         );

         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy._id.toString() !== userId.toString()) {
            throw new Error("Unauthorized to view this brand");
         }

         return {
            success: true,
            brand,
         };
      } catch (error) {
         throw error;
      }
   }

   // Update brand
   async updateBrand(brandId, updateData, userId) {
      try {
         const brand = await Brand.findById(brandId);

         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to update this brand");
         }

         const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            updateData,
            { new: true, runValidators: true }
         ).populate("createdBy", "firstName lastName email");

         return {
            success: true,
            brand: updatedBrand,
         };
      } catch (error) {
         throw error;
      }
   }

   // Delete brand
   async deleteBrand(brandId, userId) {
      try {
         const brand = await Brand.findById(brandId);

         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to delete this brand");
         }

         await Brand.findByIdAndDelete(brandId);

         return {
            success: true,
            message: "Brand deleted successfully",
         };
      } catch (error) {
         throw error;
      }
   }

   // Get brand statistics
   async getBrandStats(userId) {
      try {
         const stats = await Brand.aggregate([
            {
               $match: { createdBy: userId },
            },
            {
               $group: {
                  _id: null,
                  totalBrands: { $sum: 1 },
                  activeBrands: {
                     $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
                  },
                  inactiveBrands: {
                     $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
                  },
                  totalAnalyses: { $sum: "$totalAnalyses" },
                  avgAnalysesPerBrand: { $avg: "$totalAnalyses" },
               },
            },
         ]);

         const industryStats = await Brand.aggregate([
            {
               $match: {
                  createdBy: userId,
                  industry: { $exists: true, $ne: null },
               },
            },
            {
               $group: {
                  _id: "$industry",
                  count: { $sum: 1 },
                  avgAnalyses: { $avg: "$totalAnalyses" },
               },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
         ]);

         const recentBrands = await Brand.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name industry totalAnalyses lastAnalyzed createdAt");

         return {
            success: true,
            stats: stats[0] || {
               totalBrands: 0,
               activeBrands: 0,
               inactiveBrands: 0,
               totalAnalyses: 0,
               avgAnalysesPerBrand: 0,
            },
            industryStats,
            recentBrands,
         };
      } catch (error) {
         throw error;
      }
   }

   // Search brands
   async searchBrands(query, userId, limit = 20) {
      try {
         const brands = await Brand.find({
            createdBy: userId,
            $or: [
               { name: new RegExp(query, "i") },
               { description: new RegExp(query, "i") },
               { industry: new RegExp(query, "i") },
               { keywords: { $in: [new RegExp(query, "i")] } },
            ],
         })
            .populate("createdBy", "firstName lastName email")
            .limit(Number(limit))
            .sort({ createdAt: -1 });

         return {
            success: true,
            brands,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get brands needing analysis
   async getBrandsNeedingAnalysis(userId) {
      try {
         const thirtyDaysAgo = new Date();
         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

         const brands = await Brand.find({
            createdBy: userId,
            isActive: true,
            $or: [
               { lastAnalyzed: { $exists: false } },
               { lastAnalyzed: { $lt: thirtyDaysAgo } },
            ],
         })
            .populate("createdBy", "firstName lastName email")
            .sort({ lastAnalyzed: 1 });

         return {
            success: true,
            brands,
         };
      } catch (error) {
         throw error;
      }
   }

   // Toggle brand active status
   async toggleBrandStatus(brandId, userId) {
      try {
         const brand = await Brand.findById(brandId);

         if (!brand) {
            throw new Error("Brand not found");
         }

         if (brand.createdBy.toString() !== userId.toString()) {
            throw new Error("Unauthorized to modify this brand");
         }

         brand.isActive = !brand.isActive;
         await brand.save();

         return {
            success: true,
            brand,
            message: `Brand ${
               brand.isActive ? "activated" : "deactivated"
            } successfully`,
         };
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new BrandService();
