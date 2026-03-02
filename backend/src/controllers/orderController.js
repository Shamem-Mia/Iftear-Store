// controllers/orderController.js
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    const order = new Order({
      customer,
      items,
      totalAmount,
    });

    await order.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity, // decrease stock
            totalOrders: 1, // increase order count
            totalSold: item.quantity, // increase total sold
          },
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/orderController.js

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Public
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        paymentStatus:
          status === "approved"
            ? "paid"
            : status === "cancelled"
            ? "cancelled"
            : "pending",
      },
      { new: true }
    ).populate("items.product", "name image price");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Public
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const approvedOrders = await Order.countDocuments({ status: "approved" });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ["approved", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
