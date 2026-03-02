// models/productModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAvailable: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Rating system fields
    ratings: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    // Order counting
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }

  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
  this.totalRatings = this.ratings.length;
};

// Pre-save middleware to update average rating
productSchema.pre("save", function (next) {
  this.calculateAverageRating();
  next();
});

export default mongoose.model("Product", productSchema);
