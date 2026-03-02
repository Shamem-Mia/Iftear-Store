// pages/ProductManagement.jsx
import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Loader2, Star, ShoppingBag } from "lucide-react";
import ProductForm from "../components/ProductForm";
import RatingModal from "../components/RatingModal";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products");
      setProducts(data.products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/products/${id}/availability`, {
        isAvailable: !currentStatus,
      });
      toast.success(
        `Product marked as ${!currentStatus ? "available" : "unavailable"}`
      );
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  };

  const handleShowRatings = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/admin-order"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold 
               hover:bg-blue-700 hover:shadow-md transition-all duration-200 
               flex items-center justify-center"
        >
          All Orders
        </Link>
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showRatingModal && selectedProduct && (
        <RatingModal
          product={selectedProduct}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedProduct(null);
          }}
          onRatingAdded={fetchProducts}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : products.length === 0 ? (
        <button
          className="bg-gray-100 w-full p-8 rounded-lg text-center hover:bg-gray-200 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <p className="text-gray-600">
            No products found. Add your first product!
          </p>
        </button>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-white"
            >
              {/* Product Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate flex-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 ml-2">
                    {product.discountAvailable && product.discount > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-lg">
                      ৳
                      {calculateDiscountedPrice(
                        product.price,
                        product.discount
                      ).toFixed(2)}
                    </span>
                    {product.discountAvailable && product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        ৳{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Rating and Sales Info */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => handleShowRatings(product)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    {product.averageRating > 0 ? (
                      renderStars(product.averageRating)
                    ) : (
                      <span className="text-gray-400">No ratings</span>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShoppingBag size={16} />
                    <span>Sold: {product.totalSold || 0}</span>
                    <span>Orders: {product.totalOrders || 0}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs capitalize">
                    {product.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toggleAvailability(product._id, product.isAvailable)
                    }
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                      product.isAvailable
                        ? "bg-green-100 hover:bg-green-200 text-green-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
