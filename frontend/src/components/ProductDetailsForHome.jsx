// components/ProductDetailsForHome.jsx
import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingBag, Star, ShoppingCart } from "lucide-react";

const ProductDetailsModal = ({
  product,
  onClose,
  onAddToCart,
  onShowRatings,
  calculateDiscountedPrice,
  renderStars,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log("product", product);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    onShowRatings(product);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  {product.averageRating > 0 ? (
                    renderStars(product.averageRating)
                  ) : (
                    <span className="text-gray-400">No ratings</span>
                  )}
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingBag size={16} />
                  <span>{product.totalSold || 0} sold</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ml-4"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image Section */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  onLoad={handleImageLoad}
                  className={`w-full h-80 object-cover transition-all duration-500 ${
                    imageLoaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  } group-hover:scale-105`}
                />
                {product.discountAvailable && product.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-semibold">Category</div>
                  <div className="text-gray-700 capitalize">
                    {product.category}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    product.stock > 10
                      ? "bg-green-50"
                      : product.stock > 0
                      ? "bg-yellow-50"
                      : "bg-red-50"
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Availability
                  </div>
                  <div
                    className={
                      product.stock > 10
                        ? "text-green-700"
                        : product.stock > 0
                        ? "text-yellow-700"
                        : "text-red-700"
                    }
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ৳
                    {calculateDiscountedPrice(
                      product.price,
                      product.discount
                    ).toFixed(2)}
                  </span>
                  {product.discountAvailable && product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ৳{product.price.toFixed(2)}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save ৳
                        {(
                          product.price -
                          calculateDiscountedPrice(
                            product.price,
                            product.discount
                          )
                        ).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
                    >
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
                    >
                      <Plus size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center mb-6 p-3 bg-white rounded-lg">
                  <span className="text-lg font-semibold text-gray-700">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳
                    {(
                      calculateDiscountedPrice(
                        product.price,
                        product.discount
                      ) * quantity
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  {product.stock === 0
                    ? "Out of Stock"
                    : `Add ${quantity} to Cart`}
                </button>

                {/* Stock Warning */}
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="mt-3 text-center">
                    <span className="text-yellow-600 text-sm font-medium">
                      ⚠️ Only {product.stock} left in stock!
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Why you'll love it:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Fast and secure delivery
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    30-day return policy
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleClose();
                  onShowRatings(product);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
              >
                <Star size={20} />
                View All Reviews
              </button>
              <button
                onClick={() =>
                  window.open(`/products/${product._id}`, "_blank")
                }
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
