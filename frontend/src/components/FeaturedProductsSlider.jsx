// components/FeaturedProductsSlider.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";

const FeaturedProductsSlider = ({
  products,
  quantities,
  onQuantityChange,
  onAddToCart,
  onShowRatings,
  calculateDiscountedPrice,
  renderStars,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleShowDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Sort products by rating and sales (mostly rated and highly sold)
  const featuredProducts = products
    .filter((product) => product.averageRating >= 4 || product.totalSold > 50)
    .sort((a, b) => {
      // Priority: high rating first, then high sales
      const ratingScoreA = a.averageRating * 20 + (a.totalSold || 0);
      const ratingScoreB = b.averageRating * 20 + (b.totalSold || 0);
      return ratingScoreB - ratingScoreA;
    })
    .slice(0, 12); // Take top 12 products

  useEffect(() => {
    if (isPaused || featuredProducts.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, featuredProducts.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get current 3 products to display
  const getCurrentProducts = () => {
    const products = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % featuredProducts.length;
      products.push(featuredProducts[index]);
    }
    return products;
  };

  const currentProducts = getCurrentProducts();

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-3 rounded-2xl mx-6 my-2 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Header - Compact */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="text-yellow-500" size={15} />
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              জনপ্রিয় পণ্য
            </h2>
            <TrendingUp className="text-green-500" size={20} />
          </div>
        </div>

        {/* Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          {featuredProducts.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* Products Grid - Always show 3 products */}
          <div className="grid grid-cols-3 gap-3 px-1">
            {currentProducts.map((product, index) => (
              <div
                key={`${product._id}-${currentIndex}-${index}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group min-h-[180px] flex flex-col animate-fade-in"
              >
                {/* Product Image - Compact */}
                <div
                  className="relative overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => handleShowDetails(product._id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badges - Compact */}
                  <div className="absolute top-1 left-1 flex flex-col gap-1">
                    {product.discountAvailable && product.discount > 0 && (
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                        {product.discount}%
                      </span>
                    )}
                    {product.averageRating >= 4.5 && (
                      <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                        <Star size={8} className="fill-white" />
                        টপ
                      </span>
                    )}
                  </div>

                  {/* Sales Counter */}
                  {product.totalSold > 0 && (
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-[8px]">
                      {product.totalSold}+
                    </div>
                  )}
                </div>

                {/* Product Info - Compact */}
                <div className="p-2 flex-1 flex flex-col">
                  {/* Product Name */}
                  <h3
                    className="font-semibold text-xs mb-1 line-clamp-2 text-gray-800 leading-tight group-hover:text-blue-600 transition-colors flex-1 cursor-pointer"
                    onClick={() => handleShowDetails(product._id)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating and Category */}
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => onShowRatings(product)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {product.averageRating > 0 ? (
                        renderStars(product.averageRating)
                      ) : (
                        <span className="text-gray-400 text-[10px]">
                          রেটিং নেই
                        </span>
                      )}
                    </button>
                    <span className="text-[8px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-green-600">
                        ৳
                        {calculateDiscountedPrice(
                          product.price,
                          product.discount
                        ).toFixed(0)}
                      </span>
                      {product.discountAvailable && product.discount > 0 && (
                        <span className="text-gray-500 line-through text-[10px]">
                          ৳{product.price.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[8px] px-1 py-0.5 rounded font-medium ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock}` : "স্টক শেষ"}
                    </span>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || isAdding}
                    className={`w-full bg-blue-600 text-white py-1.5 px-2 rounded text-[10px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 ${
                      isAdding ? "animate-pulse" : ""
                    }`}
                  >
                    <ShoppingBag size={10} />
                    {isAdding ? "যোগ হচ্ছে..." : "কার্টে যোগ"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          {featuredProducts.length > 3 && (
            <div className="flex justify-center mt-4 space-x-1.5">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-600 w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsSlider;
