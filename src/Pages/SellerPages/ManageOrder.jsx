import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  X,
  Calendar,
  MapPin,
  Mail,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import useSellerOrderList from "../../hooks/userSellerOrderList";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";

const ManageOrder = () => {
  const { orders, refetch } = useSellerOrderList();
  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const itemsPerPage = 5;

  // Map the API response to match the structure expected by the component
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    bannerImage: order.service.cover_photo || "https://via.placeholder.com/150",
    service: order.service.title,
    location: order.location,
    order_id: order.order_id,
    client: order.user.full_name,
    email: order.user.email_address,
    avatar:
      order.user.photo ||
      `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
    deadline: order.event_time,
    price: `$${parseFloat(order.amount).toFixed(2)}`,
    status: order.status,
  }));

  // Filter orders based on status
  const filteredOrders =
    activeTab === "All Orders"
      ? formattedOrders
      : formattedOrders.filter((order) => order.status === activeTab);

  // Calculate counts for each status
  const activeCount = formattedOrders.filter(
    (order) => order.status === "Active"
  ).length;
  const pendingCount = formattedOrders.filter(
    (order) => order.status === "Pending"
  ).length;
  const acceptedCount = formattedOrders.filter(
    (order) => order.status === "Accepted"
  ).length;
  const completedCount = formattedOrders.filter(
    (order) => order.status === "Completed"
  ).length;
  const cancelledCount = formattedOrders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status color logic
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Active":
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColorForModal = (status) => {
    const colors = {
      Active: "bg-blue-100 text-blue-700 border-blue-200",
      Completed: "bg-green-100 text-green-700 border-green-200",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
      Accepted: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Open edit modal
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setEditModalOpen(true);
  };

  // Open details modal
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  // Update status via API
  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === selectedOrder.status) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please select a different status",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      return;
    }

    try {
      await apiClient.patch(`/seller/order/update-status/${selectedOrder.id}`, {
        status: newStatus,
      });
      setEditModalOpen(false);
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Status updated successfully!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update status. Please try again.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
  };

  // Determine allowed status options based on current status
  const getAllowedStatuses = (currentStatus) => {
    if (currentStatus === "Pending") {
      return ["Accepted", "Cancelled"];
    } else if (currentStatus === "Accepted") {
      return ["Pending", "Cancelled"];
    } else if (currentStatus === "Active") {
      return ["Completed"];
    }
    return [];
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Manage Orders
      </h1>

      {/* Tabs – scrollable on mobile */}
      <div className="mb-6 -mx-4 overflow-x-auto whitespace-nowrap px-4 sm:mx-0 sm:overflow-visible">
        {[
          { label: `All Orders`, value: "All Orders" },
          { label: `Active (${activeCount})`, value: "Active" },
          { label: `Pending (${pendingCount})`, value: "Pending" },
          { label: `Accepted (${acceptedCount})`, value: "Accepted" },
          { label: `Completed (${completedCount})`, value: "Completed" },
          { label: `Cancelled (${cancelledCount})`, value: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setCurrentPage(1);
            }}
            className={`inline-block pb-2 mr-6 font-medium transition-colors ${
              activeTab === tab.value
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600 border-b border-gray-300">
          <div className="col-span-3">Service Info</div>
          <div className="col-span-2">Client Info</div>
          <div className="col-span-2">Deadline</div>
          <div className="col-span-2 text-center">Location</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-2 text-center">Status & Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {currentOrders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No orders found for the selected filter.
            </p>
          ) : (
            currentOrders.map((order) => (
              <DesktopRow
                key={order.id}
                order={order}
                getStatusColor={getStatusColor}
                openDetailsModal={openDetailsModal}
                openEditModal={openEditModal}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentOrders.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No orders found for the selected filter.
          </p>
        ) : (
          currentOrders.map((order) => (
            <MobileCard
              key={order.id}
              order={order}
              getStatusColor={getStatusColor}
              openDetailsModal={openDetailsModal}
              openEditModal={openEditModal}
            />
          ))
        )}
      </div>

      {/* Pagination (only shown if filteredOrders.length > 10) */}
      {filteredOrders.length > 10 && (
        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-purple-100 transition-colors duration-200 text-xs sm:text-sm"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-purple-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-purple-100 transition-colors duration-200 text-xs sm:text-sm"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Edit Order Status
            </h3>
            <div className="space-y-4">
              <div>
                <img
                  src={selectedOrder.bannerImage}
                  alt={selectedOrder.service}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span>{" "}
                  {selectedOrder.order_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Event Name:</span>{" "}
                  {selectedOrder.service}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Client Name:</span>{" "}
                  {selectedOrder.client}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md p-2 border border-gray-200 outline-none text-sm"
                >
                  <option value={selectedOrder.status} disabled>
                    {selectedOrder.status} (Current)
                  </option>
                  {getAllowedStatuses(selectedOrder.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - MODERN DESIGN */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
  <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
    {/* Header with Image */}
    <div className="relative h-40 sm:h-48 overflow-hidden">
      <img
        src={selectedOrder.bannerImage}
        alt={selectedOrder.service}
        className="w-full h-full object-cover"
        onError={(e) => (e.target.src = "https://via.placeholder.com/800x300")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <button
        onClick={() => setDetailsModalOpen(false)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>
      <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
          {selectedOrder.service}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm font-medium">
          Order ID: {selectedOrder.order_id}
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="p-4 sm:p-6 md:p-8">
      {/* Status Badge */}
      <div className="mb-4 sm:mb-6">
        <span
          className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColorForModal(
            selectedOrder.status
          )}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          {selectedOrder.status}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Client Name */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Client Name
            </p>
            <p className="text-gray-900 font-medium text-sm sm:text-base">
              {selectedOrder.client}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Email
            </p>
            <p className="text-gray-900 font-medium text-sm sm:text-base break-all">
              {selectedOrder.email}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Location
            </p>
            <p className="text-gray-900 font-medium text-sm sm:text-base">
              {selectedOrder.location}
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Deadline
            </p>
            <p className="text-gray-900 font-medium text-sm sm:text-base">
              {selectedOrder.deadline}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Price
            </p>
            <p className="text-gray-900 font-bold text-base sm:text-lg">
              {selectedOrder.price}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setDetailsModalOpen(false)}
          className="w-full sm:w-1/2 px-5 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
        >
          Close
        </button>
        <Link
          to={`/timeline/${selectedOrder.id}`}
          className="w-full sm:w-1/2 px-5 py-2.5 sm:py-3 bg-[#c8c1f5] text-black rounded-lg hover:bg-[#beb6f5] transition-all font-medium text-sm sm:text-base text-center shadow-lg shadow-purple-300/30"
        >
          View Timeline
        </Link>
      </div>
    </div>
  </div>
</div>

      )}
    </div>
  );
};

/* Desktop Row */
function DesktopRow({ order, getStatusColor, openDetailsModal, openEditModal }) {
  return (
    <div 
      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer"
      onClick={() => openDetailsModal(order)}
    >
      {/* Service */}
      <div className="col-span-3 flex items-center space-x-3">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <img
            src={order.bannerImage}
            alt={order.service}
            className="h-full w-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        </div>
        <div>
          <Link
            to={`/timeline/${order.id}`}
            className="text-purple-600 font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {order.service}
          </Link>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {order.location}
          </p>
          <p className="text-xs text-gray-500">
            Order ID: {order.order_id}
          </p>
        </div>
      </div>

      {/* Client */}
      <div className="col-span-2 flex items-center gap-2">
        <img
          src={order.avatar}
          alt={order.client}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://i.pravatar.cc/40")}
        />
        <div>
          <p className="text-gray-700 truncate max-w-[150px]">{order.client}</p>
          <p className="text-xs text-gray-500">{order.email}</p>
        </div>
      </div>

      {/* Deadline */}
      <div className="col-span-2 text-gray-600">{order.deadline}</div>

      {/* Location */}
      <div className="col-span-2 text-center text-gray-600">{order.location}</div>

      {/* Price */}
      <div className="col-span-1 text-center font-medium text-gray-900">
        {order.price}
      </div>

      {/* Status + Action */}
      <div className="col-span-2 flex items-center justify-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
        {order.status !== "Completed" && order.status !== "Cancelled" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(order);
            }}
            className="text-purple-600 hover:text-purple-800"
          >
            <Edit size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/* Mobile Card */
function MobileCard({ order, getStatusColor, openDetailsModal, openEditModal }) {
  return (
    <div 
      className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
      onClick={() => openDetailsModal(order)}
    >
      {/* Service Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <img
            src={order.bannerImage}
            alt={order.service}
            className="h-full w-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        </div>
        <div className="flex-1">
          <Link
            to={`/timeline/${order.id}`}
            className="font-semibold text-gray-900 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {order.service}
          </Link>
          <p className="mt-0.5 text-xs text-gray-500">
            Order #{order.order_id} • {order.location}
          </p>
          <span
            className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="font-medium text-gray-700">Client</p>
          <p className="text-gray-600">{order.client}</p>
          <p className="text-xs text-gray-500">{order.email}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Deadline</p>
          <p className="text-gray-600">{order.deadline}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Location</p>
          <p className="text-gray-600">{order.location}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Price</p>
          <p className="font-medium text-gray-900">{order.price}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-end">
        {order.status !== "Completed" && order.status !== "Cancelled" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(order);
            }}
            className="rounded-full bg-[#c8c1f5] px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#b0a8e2]"
          >
            Edit Status
          </button>
        )}
      </div>
    </div>
  );
}

export default ManageOrder;