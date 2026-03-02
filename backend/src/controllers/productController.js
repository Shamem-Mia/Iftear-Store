// controllers/productController.js
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      discountAvailable,
      stock,
      category,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Product image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mannanstore/products",
      resource_type: "image",
    });

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      discountAvailable: discountAvailable || false,
      stock,
      category,
      image: result.secure_url,
      cloudinaryId: result.public_id,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add rating/review to product
// @route   POST /api/products/:id/ratings
// @access  Public
export const addProductRating = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "User, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find((r) => r.user === user);
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this product",
      });
    }

    // Add new rating
    product.ratings.push({ user, rating, comment });
    await product.save();

    res.json({
      success: true,
      message: "Rating added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product ratings
// @route   GET /api/products/:id/ratings
// @access  Public
export const getProductRatings = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      ratings: product.ratings,
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      discountAvailable,
      stock,
      category,
      isAvailable,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image;
    let cloudinaryId = product.cloudinaryId;

    if (req.file) {
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mannanstore/products",
        resource_type: "image",
      });

      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.discountAvailable =
      discountAvailable !== undefined
        ? discountAvailable
        : product.discountAvailable;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category || product.category;
    product.isAvailable =
      isAvailable !== undefined ? isAvailable : product.isAvailable;
    product.image = imageUrl;
    product.cloudinaryId = cloudinaryId;

    await product.save();
    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: "Product deleted successfully",
      deletedProductId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/availability
// @access  Public
export const toggleProductAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isAvailable = isAvailable;
    await product.save();

    res.json({
      success: true,
      message: `Product marked as ${isAvailable ? "available" : "unavailable"}`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update availability",
    });
  }
};
