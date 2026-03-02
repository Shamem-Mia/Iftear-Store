// pages/CartPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateQuantity = (productId, change) => {
    const newCart = cart
      .map((item) => {
        if (item._id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          if (newQuantity === 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean);

    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item._id !== productId);
    saveCart(newCart);
    toast.success("পণ্য কার্ট থেকে সরানো হয়েছে");
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            আপনার কার্ট খালি
            <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
              Your cart is empty
            </div>
          </h2>
          <p className="text-gray-500 mb-6">
            শপিং চালিয়ে যেতে আপনার কার্টে কিছু পণ্য যোগ করুন
            <div className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
              Add some products to your cart to continue shopping
            </div>
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            শপিং চালিয়ে যান
            <div className="text-xs text-blue-200 mt-1">Continue Shopping</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={20} />
            <span>শপিং চালিয়ে যান</span>
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Continue Shopping
            </div>
          </button>
          <h1 className="text-3xl font-bold">
            শপিং কার্ট
            <div className="text-sm font-normal text-gray-500 mt-1">
              Shopping Cart
            </div>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-lg">
                  কার্ট আইটেম ({getTotalItems()}টি পণ্য)
                  <div className="text-xs text-gray-500 font-normal">
                    Cart Items ({getTotalItems()} products)
                  </div>
                </h2>
              </div>
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
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

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span>পণ্য ({getTotalItems()}টি):</span>
                    <div className="text-xs text-gray-500">Items</div>
                  </div>
                  <span>৳{getTotalPrice().toFixed(2)}</span>
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
                    <span>ট্যাক্স:</span>
                    <div className="text-xs text-gray-500">Tax</div>
                  </div>
                  <span>৳{(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold items-center">
                  <div>
                    <span>মোট:</span>
                    <div className="text-xs text-gray-500 font-normal">
                      Total
                    </div>
                  </div>
                  <span>৳{(getTotalPrice() * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                চেকআউট করুন
                <div className="text-xs text-green-200 mt-1">
                  Proceed to Checkout
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg border"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {item.description}
        </p>
        <span className="text-green-600 font-bold">
          ৳{item.finalPrice.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => onUpdateQuantity(item._id, -1)}
              className="p-2 rounded-full bg-white hover:bg-gray-200 shadow-sm transition-all hover:scale-110"
            >
              <Minus size={16} className="text-red-600" />
            </button>
            <span className="w-8 text-center font-medium text-lg">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item._id, 1)}
              className="p-2 rounded-full bg-white hover:bg-gray-200 shadow-sm transition-all hover:scale-110"
            >
              <Plus size={16} className="text-green-600" />
            </button>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Quantity
          </div>
        </div>

        <div className="text-center">
          <span className="font-bold text-lg block">
            ৳{(item.finalPrice * item.quantity).toFixed(2)}
          </span>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">
            Total
          </div>
        </div>

        <button
          onClick={() => onRemove(item._id)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200 hover:border-red-300"
        >
          <Trash2 size={18} />
          <div className="text-xs text-red-400 mt-1">Remove</div>
        </button>
      </div>
    </div>
  );
};

export default CartPage;
