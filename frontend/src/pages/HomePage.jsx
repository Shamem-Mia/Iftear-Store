// pages/HomePage.jsx
import { useState, useEffect } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Search, Filter, Star, ShoppingCart } from "lucide-react";
import RatingModal from "../components/RatingModal";
import ProductCard from "../components/ProductCard";
import FeaturedProductsSlider from "../components/FeaturedProductsSlider";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    loadCartFromStorage();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products");
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      toast.error("পণ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleShowRatings = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    const savedQuantities = localStorage.getItem("quantities");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedQuantities) setQuantities(JSON.parse(savedQuantities));
  };

  const saveCartToStorage = (newCart, newQuantities) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("quantities", JSON.stringify(newQuantities));
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const categories = [
    "সব পণ্য", // All Products
    ...new Set(products.map((product) => product.category)),
  ];

  const handleRatingAdded = () => {
    setShowRatingModal(false);
    setSelectedProduct(null);
    fetchProducts(); // Refresh products to show updated ratings
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

  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    const existingItem = cart.find((item) => item._id === product._id);

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      newCart = [
        ...cart,
        {
          ...product,
          quantity: quantity,
          finalPrice: calculateDiscountedPrice(product.price, product.discount),
        },
      ];
    }

    setCart(newCart);
    saveCartToStorage(newCart, quantities);
    toast.success("পণ্য কার্টে যোগ করা হয়েছে!");
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0,
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {" "}
      {/* Added padding bottom for cart button */}
      {/* Header */}
      <FeaturedProductsSlider
        products={products}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onAddToCart={addToCart}
        onShowRatings={handleShowRatings}
        calculateDiscountedPrice={calculateDiscountedPrice}
        renderStars={renderStars}
      />
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-600">মান্নান স্টোর</h1>

            {/* Search Bar */}
            <div className="flex-1 w-full sm:max-w-2xl sm:mx-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cart Button - Positioned above content */}
            <div className="fixed bottom-6 right-6 z-[9999] transform hover:scale-105 transition-transform duration-300">
              <button
                onClick={() => (window.location.href = "/cart")}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 animate-bounce hover:animate-none border-2 border-white"
              >
                <ShoppingCart size={20} className="flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold whitespace-nowrap">
                    কার্ট ({getCartItemCount()})
                  </span>
                  <span className="text-xs bg-white text-green-700 rounded-full px-2 py-0.5 font-bold">
                    ৳{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-4 mt-4 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-600 flex-shrink-0" />
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(index === 0 ? "all" : category)
                }
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  (index === 0 && selectedCategory === "all") ||
                  (index !== 0 && selectedCategory === category)
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>
      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="relative z-10">
              <ProductCard
                product={product}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                onAddToCart={addToCart}
                onShowRatings={handleShowRatings}
                calculateDiscountedPrice={calculateDiscountedPrice}
                renderStars={renderStars}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">কোনো পণ্য পাওয়া যায়নি।</p>
          </div>
        )}
      </main>
      {/* Rating Modal */}
      {showRatingModal && selectedProduct && (
        <RatingModal
          product={selectedProduct}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedProduct(null);
          }}
          onRatingAdded={handleRatingAdded}
        />
      )}
    </div>
  );
};

export default HomePage;
