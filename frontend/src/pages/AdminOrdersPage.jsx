// pages/AdminOrdersPage.jsx
import { useState, useEffect } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Search, RefreshCw } from "lucide-react";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderCard from "../components/OrderCard";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/orders");
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.phone.includes(searchTerm) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      toast.success(
        `Order ${
          newStatus === "approved" ? "approved" : "cancelled"
        } successfully`
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                paymentStatus: newStatus === "approved" ? "paid" : "cancelled",
              }
            : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      toast.success("Order deleted successfully");

      setOrders(orders.filter((order) => order._id !== orderId));

      if (selectedOrder && selectedOrder._id === orderId) {
        setShowOrderDetails(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Order Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Total {orders.length} orders
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center mt-2 sm:mt-0"
            >
              <RefreshCw size={16} className="sm:w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-3 sm:px-4 py-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <Package size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || statusFilter !== "all"
                ? "No orders match your search criteria"
                : "No orders have been placed yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 p-4 bg-gray-50 border-b font-semibold text-gray-700 text-sm">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-1">Items</div>
              <div className="col-span-2">Total Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Orders List */}
            <div className="divide-y">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onViewDetails={viewOrderDetails}
                  onStatusUpdate={updateOrderStatus}
                  onDelete={deleteOrder}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPaymentStatusColor={getPaymentStatusColor}
                  getPaymentStatusText={getPaymentStatusText}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={updateOrderStatus}
          onDelete={deleteOrder}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getPaymentStatusColor={getPaymentStatusColor}
          getPaymentStatusText={getPaymentStatusText}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
