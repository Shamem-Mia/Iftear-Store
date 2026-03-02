// components/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Minus, ShoppingCart, ShoppingBag } from "lucide-react";

const ProductCard = ({
  product,
  quantities,
  onQuantityChange,
  onAddToCart,
  onShowRatings,
  calculateDiscountedPrice,
  renderStars,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const quantity = quantities[product._id] || 1;

  const handleAddToCart = async (product) => {
    setIsAdding(true);
    await onAddToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleShowDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in border border-gray-100 relative z-20">
      {/* Product Image */}
      <div
        className="relative overflow-hidden rounded-t-xl cursor-pointer"
        onClick={handleShowDetails}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        {product.discountAvailable && product.discount > 0 && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
            {product.discount}% <span className="text-xs">ছাড়</span>
          </span>
        )}
        {product.totalSold > 50 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            হট 🔥
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3
          className="font-bold text-base sm:text-lg mb-2 line-clamp-2 text-gray-800 leading-tight cursor-pointer hover:text-blue-600"
          onClick={handleShowDetails}
        >
          {product.name}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating and Sales Info */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => onShowRatings(product)}
            className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors hover:scale-105"
          >
            {product.averageRating > 0 ? (
              renderStars(product.averageRating)
            ) : (
              <span className="text-gray-400 text-xs">রেটিং নেই</span>
            )}
          </button>

          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            <ShoppingBag size={14} className="sm:w-4 text-green-600" />
            <span>বিক্রি: {product.totalSold || 0}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-green-600">
              ৳
              {calculateDiscountedPrice(
                product.price,
                product.discount
              ).toFixed(2)}
            </span>
            {product.discountAvailable && product.discount > 0 && (
              <span className="text-gray-500 line-through text-xs sm:text-sm">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.stock > 10
                ? "bg-green-100 text-green-800 border border-green-200"
                : product.stock > 0
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {product.stock > 0 ? `স্টক: ${product.stock}` : "স্টক শেষ"}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3 bg-blue-50 p-2 rounded-lg">
          <span className="text-xs sm:text-sm font-medium text-blue-800">
            পরিমাণ:
          </span>
          <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 py-1 rounded-full shadow-inner">
            <button
              onClick={() => onQuantityChange(product._id, -1)}
              disabled={quantity <= 1}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 hover:scale-110 text-blue-600"
            >
              <Minus size={12} className="sm:w-4" />
            </button>
            <span className="w-6 sm:w-8 text-center font-bold text-blue-700 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(product._id, 1)}
              disabled={quantity >= product.stock}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 hover:scale-110 text-blue-600"
            >
              <Plus size={12} className="sm:w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleShowDetails}
            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-2 sm:px-3 sm:py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-h-[2.5rem] shadow-md"
          >
            <Eye size={14} className="sm:w-4 flex-shrink-0" />
            <span className="truncate font-medium">বিস্তারিত</span>
          </button>
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0 || isAdding}
            className={`flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-2 sm:px-3 sm:py-2 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-h-[2.5rem] shadow-md ${
              isAdding ? "animate-pulse" : ""
            }`}
          >
            <ShoppingCart size={14} className="sm:w-4 flex-shrink-0" />
            <span className="truncate font-medium">
              {isAdding
                ? "যোগ হচ্ছে..."
                : product.stock === 0
                ? "স্টক শেষ"
                : "কার্টে যোগ"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
