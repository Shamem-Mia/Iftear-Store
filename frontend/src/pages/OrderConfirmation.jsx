// pages/OrderConfirmation.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
          <p className="text-gray-600 mb-6">
            Your order has been received and is being processed.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <p>
                  <strong>Order Number:</strong> {order.orderNumber}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ৳{order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Credit Card"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-yellow-600 capitalize">
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Package size={20} />
              <span>Order Confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Truck size={20} />
              <span>Shipped</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle size={20} />
              <span>Delivered</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Home size={20} />
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
