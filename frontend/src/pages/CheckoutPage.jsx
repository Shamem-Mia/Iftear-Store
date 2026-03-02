// pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, Lock, ArrowLeft, Shield } from "lucide-react";

const CheckoutPage = () => {
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return (
      cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0) *
      1.05
    );
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardInfoChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: customerInfo,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.finalPrice,
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: paymentMethod,
      };

      const { data } = await axiosInstance.post("/orders", orderData);

      // Clear cart
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");

      toast.success("অর্ডার সফলভাবে দেওয়া হয়েছে!");
      navigate("/order-confirmation", { state: { order: data.order } });
    } catch (error) {
      toast.error(error.response?.data?.message || "অর্ডার দিতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={20} />
            <span>কার্টে ফিরে যান</span>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Back to Cart
            </div>
          </button>
          <h1 className="text-3xl font-bold">
            চেকআউট
            <div className="text-sm font-normal text-gray-500 mt-1">
              Checkout
            </div>
          </h1>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Customer Information & Payment */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">
                গ্রাহকের তথ্য
                <div className="text-sm font-normal text-gray-500">
                  Customer Information
                </div>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="পুরো নাম"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Full Name
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="ইমেইল ঠিকানা"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Email Address
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="ফোন নম্বর"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Phone Number
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="শহর"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    City
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="পোস্টাল কোড"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Postal Code
                  </div>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    name="address"
                    placeholder="সম্পূর্ণ ঠিকানা"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Full Address
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">
                পেমেন্ট পদ্ধতি
                <div className="text-sm font-normal text-gray-500">
                  Payment Method
                </div>
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border-blue-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <Truck size={24} className="text-blue-600" />
                  <div>
                    <span className="font-medium">ক্যাশ অন ডেলিভারি</span>
                    <div className="text-xs text-gray-400 bg-blue-100 px-2 py-1 rounded inline-block">
                      Cash on Delivery
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      অর্ডার পাওয়ার সময় পেমেন্ট করুন
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors border-green-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-green-600"
                  />
                  <CreditCard size={24} className="text-green-600" />
                  <div>
                    <span className="font-medium">ক্রেডিট/ডেবিট কার্ড</span>
                    <div className="text-xs text-gray-400 bg-green-100 px-2 py-1 rounded inline-block">
                      Credit/Debit Card
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      আপনার কার্ড দিয়ে সুরক্ষিত পেমেন্ট
                    </p>
                  </div>
                </label>
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="mt-6 p-6 border-2 rounded-lg bg-green-50 border-green-200">
                  <h3 className="font-semibold mb-4 text-green-800">
                    কার্ডের তথ্য
                    <div className="text-xs text-green-600 font-normal">
                      Card Details
                    </div>
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="কার্ড নম্বর"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInfoChange}
                        required
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-400 mt-1 bg-white px-2 py-1 rounded inline-block">
                        Card Number
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInfoChange}
                          required
                          className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="text-xs text-gray-400 mt-1 bg-white px-2 py-1 rounded inline-block">
                          Expiry Date
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          required
                          className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="text-xs text-gray-400 mt-1 bg-white px-2 py-1 rounded inline-block">
                          CVV
                        </div>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="কার্ডের上的 নাম"
                        value={cardInfo.cardName}
                        onChange={handleCardInfoChange}
                        required
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-400 mt-1 bg-white px-2 py-1 rounded inline-block">
                        Name on Card
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">
                অর্ডার সামারি
                <div className="text-sm font-normal text-gray-500">
                  Order Summary
                </div>
              </h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ৳{(item.finalPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span>সাবটোটাল:</span>
                    <div className="text-xs text-gray-500">Subtotal</div>
                  </div>
                  <span>
                    ৳
                    {cart
                      .reduce(
                        (total, item) =>
                          total + item.finalPrice * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span>ডেলিভারি:</span>
                    <div className="text-xs text-gray-500">Shipping</div>
                  </div>
                  <span className="text-green-600">ফ্রি</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span>ট্যাক্স (৫%):</span>
                    <div className="text-xs text-gray-500">Tax (5%)</div>
                  </div>
                  <span>
                    ৳
                    {(
                      cart.reduce(
                        (total, item) =>
                          total + item.finalPrice * item.quantity,
                        0
                      ) * 0.05
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold items-center pt-2 border-t">
                  <div>
                    <span>মোট:</span>
                    <div className="text-xs text-gray-500 font-normal">
                      Total
                    </div>
                  </div>
                  <span className="text-green-600">
                    ৳{getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-300 font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Lock size={20} />
                <Shield size={20} />
                <span className="text-lg">
                  {loading
                    ? "প্রসেসিং..."
                    : `অর্ডার দিন - ৳${getTotalPrice().toFixed(2)}`}
                </span>
                <div className="text-xs text-green-200">
                  {loading ? "Processing..." : "Place Order"}
                </div>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 bg-gray-100 p-2 rounded">
                আপনার ব্যক্তিগত তথ্য আপনার অর্ডার প্রক্রিয়া করতে এবং আপনার
                অভিজ্ঞতা সমর্থন করতে ব্যবহার করা হবে।
                <br />
                <span className="text-gray-400">
                  Your personal data will be used to process your order and
                  support your experience.
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
