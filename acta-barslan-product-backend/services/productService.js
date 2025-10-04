const Product = require("../models/Product");

class ProductService {
   // Get all products with filtering, sorting, and pagination
   async getProducts(query = {}) {
      try {
         const {
            page = 1,
            limit = 10,
            sort = "-createdAt",
            category,
            minPrice,
            maxPrice,
            search,
            isActive = true,
            isFeatured,
         } = query;

         // Build filter object
         const filter = { isActive };

         if (category) {
            filter.category = new RegExp(category, "i");
         }

         if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
         }

         if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === "true";
         }

         if (search) {
            filter.$text = { $search: search };
         }

         // Calculate pagination
         const skip = (Number(page) - 1) * Number(limit);

         // Execute query
         const products = await Product.find(filter)
            .populate("createdBy", "firstName lastName email")
            .populate("updatedBy", "firstName lastName email")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

         // Get total count for pagination
         const total = await Product.countDocuments(filter);

         return {
            success: true,
            products,
            pagination: {
               currentPage: Number(page),
               totalPages: Math.ceil(total / Number(limit)),
               totalProducts: total,
               hasNext: Number(page) < Math.ceil(total / Number(limit)),
               hasPrev: Number(page) > 1,
            },
         };
      } catch (error) {
         throw error;
      }
   }

   // Get single product by ID
   async getProductById(productId) {
      try {
         const product = await Product.findById(productId)
            .populate("createdBy", "firstName lastName email")
            .populate("updatedBy", "firstName lastName email");

         if (!product) {
            throw new Error("Product not found");
         }

         return {
            success: true,
            product,
         };
      } catch (error) {
         throw error;
      }
   }

   // Create new product
   async createProduct(productData, userId) {
      try {
         const product = await Product.create({
            ...productData,
            createdBy: userId,
         });

         const populatedProduct = await Product.findById(product._id).populate(
            "createdBy",
            "firstName lastName email"
         );

         return {
            success: true,
            product: populatedProduct,
         };
      } catch (error) {
         throw error;
      }
   }

   // Update product
   async updateProduct(productId, updateData, userId) {
      try {
         const product = await Product.findByIdAndUpdate(
            productId,
            { ...updateData, updatedBy: userId },
            { new: true, runValidators: true }
         )
            .populate("createdBy", "firstName lastName email")
            .populate("updatedBy", "firstName lastName email");

         if (!product) {
            throw new Error("Product not found");
         }

         return {
            success: true,
            product,
         };
      } catch (error) {
         throw error;
      }
   }

   // Delete product
   async deleteProduct(productId) {
      try {
         const product = await Product.findByIdAndDelete(productId);

         if (!product) {
            throw new Error("Product not found");
         }

         return {
            success: true,
            message: "Product deleted successfully",
         };
      } catch (error) {
         throw error;
      }
   }

   // Update product stock
   async updateStock(productId, newStock) {
      try {
         const product = await Product.findByIdAndUpdate(
            productId,
            { stock: newStock },
            { new: true, runValidators: true }
         );

         if (!product) {
            throw new Error("Product not found");
         }

         return {
            success: true,
            product,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get products by category
   async getProductsByCategory(category, limit = 10) {
      try {
         const products = await Product.find({
            category: new RegExp(category, "i"),
            isActive: true,
         })
            .populate("createdBy", "firstName lastName email")
            .limit(Number(limit))
            .sort("-createdAt");

         return {
            success: true,
            products,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get featured products
   async getFeaturedProducts(limit = 10) {
      try {
         const products = await Product.find({
            isFeatured: true,
            isActive: true,
         })
            .populate("createdBy", "firstName lastName email")
            .limit(Number(limit))
            .sort("-createdAt");

         return {
            success: true,
            products,
         };
      } catch (error) {
         throw error;
      }
   }

   // Search products
   async searchProducts(searchTerm, limit = 20) {
      try {
         const products = await Product.find({
            $text: { $search: searchTerm },
            isActive: true,
         })
            .populate("createdBy", "firstName lastName email")
            .limit(Number(limit))
            .sort({ score: { $meta: "textScore" } });

         return {
            success: true,
            products,
         };
      } catch (error) {
         throw error;
      }
   }

   // Get product statistics
   async getProductStats() {
      try {
         const stats = await Product.aggregate([
            {
               $group: {
                  _id: null,
                  totalProducts: { $sum: 1 },
                  totalStock: { $sum: "$stock" },
                  averagePrice: { $avg: "$price" },
                  totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
               },
            },
         ]);

         const categoryStats = await Product.aggregate([
            {
               $group: {
                  _id: "$category",
                  count: { $sum: 1 },
                  averagePrice: { $avg: "$price" },
               },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
         ]);

         return {
            success: true,
            stats: stats[0] || {
               totalProducts: 0,
               totalStock: 0,
               averagePrice: 0,
               totalValue: 0,
            },
            categoryStats,
         };
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new ProductService();
