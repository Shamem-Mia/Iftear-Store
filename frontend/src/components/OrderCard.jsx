// components/OrderCard.jsx
import { Eye, CheckCircle, XCircle, Trash2, ShoppingBag } from "lucide-react";

const OrderCard = ({
  order,
  onViewDetails,
  onStatusUpdate,
  onDelete,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText,
  formatDate,
}) => {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden p-4 hover:bg-gray-50 transition-colors border-b">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mb-2">
                {order._id.slice(-8)}
              </div>
              <div className="font-medium text-sm">{order.customer.name}</div>
              <div className="text-xs text-gray-500">
                {order.customer.phone}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600 text-sm">
                ৳{order.totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Status and Items */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <ShoppingBag size={12} />
                <span>{order.items.length}</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onViewDetails(order)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View Details"
              >
                <Eye size={14} />
              </button>

              {order.status === "pending" && (
                <>
                  <button
                    onClick={() => onStatusUpdate(order._id, "approved")}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Approve Order"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => onStatusUpdate(order._id, "cancelled")}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Cancel Order"
                  >
                    <XCircle size={14} />
                  </button>
                </>
              )}

              <button
                onClick={() => onDelete(order._id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Order"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-12 gap-3 p-4 hover:bg-gray-50 transition-colors items-center text-sm">
        {/* Order ID */}
        <div className="col-span-2">
          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {order._id.slice(-8)}
          </div>
        </div>

        {/* Customer */}
        <div className="col-span-2">
          <div className="font-medium">{order.customer.name}</div>
          <div className="text-xs text-gray-500">{order.customer.phone}</div>
        </div>

        {/* Items */}
        <div className="col-span-1">
          <div className="flex items-center gap-1">
            <ShoppingBag size={14} />
            <span>{order.items.length}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="col-span-2">
          <div className="font-bold text-green-600">
            ৳{order.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                order.paymentStatus
              )}`}
            >
              {getPaymentStatusText(order.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="col-span-2">
          <div className="text-xs text-gray-500">
            {formatDate(order.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(order)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>

            {order.status === "pending" && (
              <>
                <button
                  onClick={() => onStatusUpdate(order._id, "approved")}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Approve Order"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => onStatusUpdate(order._id, "cancelled")}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Cancel Order"
                >
                  <XCircle size={16} />
                </button>
              </>
            )}

            <button
              onClick={() => onDelete(order._id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete Order"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCard;
