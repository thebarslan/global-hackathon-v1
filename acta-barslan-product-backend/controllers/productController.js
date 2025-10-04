const productService = require("../services/productService");

class ProductController {
   // Get all products
   async getProducts(req, res, next) {
      try {
         const result = await productService.getProducts(req.query);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get single product
   async getProduct(req, res, next) {
      try {
         const result = await productService.getProductById(req.params.id);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Create new product
   async createProduct(req, res, next) {
      try {
         const result = await productService.createProduct(
            req.body,
            req.user.id
         );

         res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Update product
   async updateProduct(req, res, next) {
      try {
         const result = await productService.updateProduct(
            req.params.id,
            req.body,
            req.user.id
         );

         res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Delete product
   async deleteProduct(req, res, next) {
      try {
         const result = await productService.deleteProduct(req.params.id);

         res.status(200).json({
            success: true,
            message: result.message,
         });
      } catch (error) {
         next(error);
      }
   }

   // Update product stock
   async updateStock(req, res, next) {
      try {
         const { stock } = req.body;
         const result = await productService.updateStock(req.params.id, stock);

         res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get products by category
   async getProductsByCategory(req, res, next) {
      try {
         const result = await productService.getProductsByCategory(
            req.params.category,
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

   // Get featured products
   async getFeaturedProducts(req, res, next) {
      try {
         const result = await productService.getFeaturedProducts(
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

   // Search products
   async searchProducts(req, res, next) {
      try {
         const { q } = req.query;

         if (!q) {
            return res.status(400).json({
               success: false,
               message: "Search query is required",
            });
         }

         const result = await productService.searchProducts(q, req.query.limit);

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }

   // Get product statistics
   async getProductStats(req, res, next) {
      try {
         const result = await productService.getProductStats();

         res.status(200).json({
            success: true,
            data: result,
         });
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new ProductController();
