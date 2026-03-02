// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  addProductRating,
  getProductRatings,
} from "../controllers/productController.js";
import authUser from "../middlewares/userAuth.js";
import upload, { cleanupUploads } from "../middlewares/uploadMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", upload.single("image"), cleanupUploads, createProduct);
productRouter.put(
  "/:id",
  authUser,
  isAdmin,
  upload.single("image"),
  cleanupUploads,
  updateProduct
);
productRouter.delete("/:id", authUser, isAdmin, deleteProduct);
productRouter.put(
  "/:id/availability",
  authUser,
  isAdmin,
  toggleProductAvailability
);

// Rating routes
productRouter.post("/:id/ratings", addProductRating);
productRouter.get("/:id/ratings", getProductRatings);

export default productRouter;
