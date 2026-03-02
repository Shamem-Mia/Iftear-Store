// routes/orderRoute.js
import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  deleteOrder, // Add this
} from "../controllers/orderController.js";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", authUser, isAdmin, getAllOrders);
orderRouter.put("/:id/status", authUser, isAdmin, updateOrderStatus);
orderRouter.delete("/:id", authUser, isAdmin, deleteOrder); // Add this route
orderRouter.get("/stats", getOrderStats);

export default orderRouter;
