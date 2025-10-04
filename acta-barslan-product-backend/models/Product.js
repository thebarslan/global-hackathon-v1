const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Product name is required"],
         trim: true,
         maxlength: [100, "Product name cannot exceed 100 characters"],
      },
      description: {
         type: String,
         required: [true, "Product description is required"],
         trim: true,
         maxlength: [1000, "Description cannot exceed 1000 characters"],
      },
      price: {
         type: Number,
         required: [true, "Product price is required"],
         min: [0, "Price cannot be negative"],
      },
      category: {
         type: String,
         required: [true, "Product category is required"],
         trim: true,
      },
      brand: {
         type: String,
         trim: true,
      },
      sku: {
         type: String,
         unique: true,
         trim: true,
      },
      stock: {
         type: Number,
         required: [true, "Stock quantity is required"],
         min: [0, "Stock cannot be negative"],
         default: 0,
      },
      images: [
         {
            url: String,
            alt: String,
            isPrimary: {
               type: Boolean,
               default: false,
            },
         },
      ],
      specifications: {
         weight: String,
         dimensions: String,
         color: String,
         material: String,
         warranty: String,
      },
      tags: [String],
      isActive: {
         type: Boolean,
         default: true,
      },
      isFeatured: {
         type: Boolean,
         default: false,
      },
      rating: {
         average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
         },
         count: {
            type: Number,
            default: 0,
         },
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      updatedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better query performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Generate SKU if not provided
productSchema.pre("save", function (next) {
   if (!this.sku) {
      this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
   }
   next();
});

// Virtual for availability status
productSchema.virtual("isAvailable").get(function () {
   return this.stock > 0 && this.isActive;
});

// Transform output
productSchema.set("toJSON", {
   virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
