// pages/ProductDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  User,
  Heart,
  Share2,
  Home,
} from "lucide-react";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [newRating, setNewRating] = useState({
    user: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchRatings();
      loadCartFromStorage();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/products/${productId}`);
      setProduct(data.product);
    } catch (error) {
      toast.error("পণ্যের তথ্য লোড করতে সমস্যা হয়েছে");
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);
      const { data } = await axiosInstance.get(
        `/products/${productId}/ratings`
      );
      setRatings(data.ratings || []);
      setAverageRating(data.averageRating || 0);
      setTotalRatings(data.totalRatings || 0);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    } finally {
      setLoadingRatings(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const handleQuantityChange = (change) => {
    if (product) {
      setQuantity((prev) =>
        Math.max(1, Math.min(product.stock, prev + change))
      );
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = cart.find((item) => item._id === product._id);

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
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
    saveCartToStorage(newCart);
    toast.success("পণ্য কার্টে যোগ করা হয়েছে!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!newRating.user || !newRating.comment || newRating.rating === 0) {
      toast.error("দয়া করে সব তথ্য প্রদান করুন এবং রেটিং দিন");
      return;
    }

    try {
      await axiosInstance.post(`/products/${productId}/ratings`, newRating);
      toast.success("রিভিউ সফলভাবে যোগ করা হয়েছে!");
      setNewRating({ user: "", rating: 0, comment: "" });
      fetchRatings(); // Refresh ratings
    } catch (error) {
      toast.error(
        error.response?.data?.message || "রিভিউ যোগ করতে সমস্যা হয়েছে"
      );
    }
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">পণ্যের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">পণ্য খুঁজে পাওয়া যায়নি</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={24} />
                <span className="hidden sm:block">পিছনে</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home size={20} />
                <span className="hidden sm:block">হোম</span>
              </button>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-blue-600">
              মানন স্টোর
            </h1>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-96 object-contain rounded-lg"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl p-3 shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} ${item}`}
                    className="w-full h-20 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                  {renderStars(averageRating, 20)}
                  <span className="text-gray-600 font-medium">
                    ({totalRatings} রিভিউ)
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>{product.totalSold || 0}টি বিক্রি হয়েছে</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-4xl md:text-5xl font-bold text-green-600">
                  ৳
                  {calculateDiscountedPrice(
                    product.price,
                    product.discount
                  ).toFixed(2)}
                </span>
                {product.discountAvailable && product.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ৳{product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-pulse">
                      {product.discount}% ছাড়
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Truck size={24} className="text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800">
                    ফ্রি ডেলিভারি
                  </div>
                  <div className="text-sm text-blue-600">সারা দেশে</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <Shield size={24} className="text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">
                    ১ বছর ওয়ারেন্টি
                  </div>
                  <div className="text-sm text-green-600">গ্যারান্টি সহ</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <RotateCcw size={24} className="text-purple-600" />
                <div>
                  <div className="font-semibold text-purple-800">
                    ৭ দিন রিটার্ন
                  </div>
                  <div className="text-sm text-purple-600">সহজ রিটার্ন</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-orange-800">অরিজিনাল</div>
                  <div className="text-sm text-orange-600">১০০% অরিজিনাল</div>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div
              className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold ${
                product.stock > 10
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 10
                    ? "bg-green-500"
                    : product.stock > 0
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
              {product.stock > 0
                ? `${product.stock}টি পণ্য স্টকে আছে`
                : "স্টক শেষ"}
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 text-lg">
                  পরিমাণ:
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 hover:scale-110"
                  >
                    <Minus size={20} className="text-blue-600" />
                  </button>
                  <span className="w-16 text-center text-2xl font-bold text-blue-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 hover:scale-110"
                  >
                    <Plus size={20} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                <ShoppingCart size={24} />
                কার্টে যোগ করুন ({quantity})
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                এখনই কিনুন
              </button>
            </div>
          </div>
        </div>

        {/* Details and Reviews Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 px-6 py-4 font-semibold text-lg border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              পণ্যের বিবরণ
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 px-6 py-4 font-semibold text-lg border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              গ্রাহক রিভিউ ({totalRatings})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "details" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  পণ্যের সম্পূর্ণ বিবরণ
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      পণ্যের বৈশিষ্ট্য
                    </h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        উচ্চমানের উপকরণ দ্বারা তৈরি
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        টেকসই এবং মজবুত কনস্ট্রাকশন
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        ব্যবহারে অত্যন্ত সহজ
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        দীর্ঘদিন ব্যবহারযোগ্য
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      স্পেসিফিকেশন
                    </h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex justify-between py-2 border-b">
                        <span className="font-medium">ব্র্যান্ড:</span>
                        <span className="font-semibold">মানন স্টোর</span>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="font-medium">ক্যাটাগরি:</span>
                        <span className="font-semibold">
                          {product.category}
                        </span>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="font-medium">মডেল নম্বর:</span>
                        <span className="font-semibold">{product.name}</span>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="font-medium">স্টক অবস্থা:</span>
                        <span
                          className={`font-semibold ${
                            product.stock > 10
                              ? "text-green-600"
                              : product.stock > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Add Review Form */}
                <form
                  onSubmit={handleSubmitRating}
                  className="bg-gray-50 p-6 rounded-xl border-2"
                >
                  <h4 className="font-semibold text-xl mb-6 flex items-center gap-3">
                    <MessageCircle size={24} className="text-blue-600" />
                    আপনার রিভিউ লিখুন
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <User size={18} className="text-gray-600" />
                        আপনার নাম
                      </label>
                      <input
                        type="text"
                        value={newRating.user}
                        onChange={(e) =>
                          setNewRating({ ...newRating, user: e.target.value })
                        }
                        className="w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        placeholder="আপনার নাম লিখুন"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <Star size={18} className="text-gray-600" />
                        রেটিং দিন
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setNewRating({ ...newRating, rating: star })
                            }
                            className={`p-2 transition-transform hover:scale-110 ${
                              star <= newRating.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            <Star
                              size={32}
                              className={
                                star <= newRating.rating
                                  ? "fill-yellow-400"
                                  : ""
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center gap-2 text-base font-medium mb-3">
                      <MessageCircle size={18} className="text-gray-600" />
                      আপনার মন্তব্য
                    </label>
                    <textarea
                      value={newRating.comment}
                      onChange={(e) =>
                        setNewRating({ ...newRating, comment: e.target.value })
                      }
                      className="w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      rows={5}
                      placeholder="আপনার অভিজ্ঞতা এবং মতামত শেয়ার করুন..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
                  >
                    রিভিউ সাবমিট করুন
                  </button>
                </form>

                {/* Reviews List */}
                {loadingRatings ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">
                      রিভিউ লোড হচ্ছে...
                    </p>
                  </div>
                ) : ratings.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl">
                    <MessageCircle
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-xl">কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-gray-800">
                      গ্রাহক রিভিউ ({ratings.length})
                    </h4>
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="border-b pb-8 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={24} className="text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-lg block">
                                {rating.user}
                              </span>
                              <div className="flex items-center gap-3 mt-2">
                                {renderStars(rating.rating, 20)}
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    rating.createdAt
                                  ).toLocaleDateString("bn-BD", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-6 rounded-xl">
                          {rating.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
