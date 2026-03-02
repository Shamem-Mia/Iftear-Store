// components/OrderDetailsModal.jsx
import {
  XCircle,
  User,
  Phone,
  MapPin,
  Package,
  ShoppingBag,
  CheckCircle,
  Trash2,
} from "lucide-react";

const OrderDetailsModal = ({
  order,
  onClose,
  onStatusUpdate,
  onDelete,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText,
  formatDate,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl sm:text-2xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle size={20} className="sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <User size={18} className="sm:w-5" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div>
                  <strong>Name:</strong> {order.customer.name}
                </div>
                <div>
                  <strong>Email:</strong> {order.customer.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="sm:w-4" />
                  <strong>Phone:</strong> {order.customer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="sm:w-4" />
                  <strong>Address:</strong> {order.customer.address}
                </div>
                {order.customer.city && (
                  <div>
                    <strong>City:</strong> {order.customer.city}
                  </div>
                )}
                {order.customer.postalCode && (
                  <div>
                    <strong>Postal Code:</strong> {order.customer.postalCode}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Package size={18} className="sm:w-5" />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <strong>Order ID:</strong>
                  <span className="font-mono text-xs">
                    {order._id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Status:</strong>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Payment Status:</strong>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Total Amount:</strong>
                  <span className="font-bold text-green-600">
                    ৳{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Order Date:</strong>
                  <span className="text-xs sm:text-sm">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Updated Date:</strong>
                  <span className="text-xs sm:text-sm">
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="sm:w-5" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded border"
                >
                  <img
                    src={item.product?.image || "/placeholder-image.jpg"}
                    alt={item.product?.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base truncate">
                      {item.product?.name || "Product Not Found"}
                    </h4>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Quantity: {item.quantity} × ৳{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-green-600 text-sm sm:text-base">
                      ৳{(item.quantity * item.price).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Unit: ৳{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 mt-3 border-t">
              <span className="text-base sm:text-lg font-bold">
                Total Amount:
              </span>
              <span className="text-lg sm:text-2xl font-bold text-green-600">
                ৳{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t">
            {order.status === "pending" && (
              <>
                <button
                  onClick={() => onStatusUpdate(order._id, "approved")}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                >
                  <CheckCircle size={16} className="sm:w-4" />
                  Approve Order
                </button>
                <button
                  onClick={() => onStatusUpdate(order._id, "cancelled")}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                >
                  <XCircle size={16} className="sm:w-4" />
                  Cancel Order
                </button>
              </>
            )}

            {(order.status === "approved" || order.status === "shipped") && (
              <button
                onClick={() => onStatusUpdate(order._id, "delivered")}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                <Package size={16} className="sm:w-4" />
                Mark as Delivered
              </button>
            )}

            <button
              onClick={() => onDelete(order._id)}
              className="flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <Trash2 size={16} className="sm:w-4" />
              Delete Order
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
