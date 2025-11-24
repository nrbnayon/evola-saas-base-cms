import {
  MapPin,
  MessageCircle,
  Calendar,
  DollarSign,
  User,
  Mail,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import question from "../../assets/icons/question.svg";
import useSellerOrderList from "../../hooks/userSellerOrderList";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";

export default function ServiceTimeline() {
  const { id } = useParams(); // Get order ID from URL
  const { orders } = useSellerOrderList();
  const [showTaskCompleteModal, setShowTaskCompleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Find the specific order by ID
    if (id && orders.length > 0) {
      const foundOrder = orders.find((order) => order.id === parseInt(id));
      console.log(foundOrder, "service timeline");
      setOrderData(foundOrder);
    }
  }, [id, orders]);

  const handleTaskComplete = () => {
    setShowTaskCompleteModal(false);
    // Add your task completion API call here
  };

  const handleAcceptOrder = async () => {
    try {
      const payload = { status: "Accepted" };
      await apiClient.put(`/seller/order/update-status/${id}`, payload);
      setOrderData((prev) => ({ ...prev, status: "Accepted" }));
      setShowAcceptModal(false);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Order accepted successfully!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    } catch (error) {
      console.error("Failed to accept order:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to accept order",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Calculate total price
  const additionalTotal =
    orderData.additionals?.reduce(
      (sum, item) => sum + parseFloat(item.price || 0),
      0
    ) || 0;
  const baseAmount = parseFloat(orderData?.service?.price || 0);
  const totalAmount = baseAmount + additionalTotal;

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!orderData.event_date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const eventDate = new Date(orderData.event_date);
    eventDate.setHours(0, 0, 0, 0);

    const timeDiff = eventDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="min-h-screen py-8 container mx-auto  px-4">
      <div className="mb-6">
        <Link
          to="/manage-orders"
          className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          <span>←</span> Back to Orders
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
        Service Timeline
      </h1>

      {/* Hero Image */}
      <div className="relative h-48 sm:h-64 mb-8">
        <img
          src={
            orderData.service?.cover_photo ||
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2070&q=80"
          }
          alt={orderData.service?.title}
          className="w-full h-full object-cover rounded-2xl"
          onError={(e) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2070&q=80")
          }
        />
        <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>

        {/* Status Badge Overlay */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              orderData.status === "Active"
                ? "bg-blue-500 text-white"
                : orderData.status === "Completed"
                ? "bg-green-500 text-white"
                : orderData.status === "Pending"
                ? "bg-yellow-500 text-white"
                : orderData.status === "Accepted"
                ? "bg-purple-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {orderData.status}
          </span>
        </div>
      </div>

      {/* Service Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        {orderData.service?.title} - {orderData.service?.category}
      </h2>

      {/* Order ID and Payment Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-8 border border-purple-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-gray-800">
              {orderData.order_id}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="font-semibold text-green-600">
                {orderData.paid ? "Paid ✓" : "Unpaid"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold text-gray-800">
                {orderData.payment_method}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Client Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Client Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={orderData.user?.photo || "https://i.pravatar.cc/80"}
                  alt={orderData.user?.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                  onError={(e) => (e.target.src = "https://i.pravatar.cc/80")}
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {orderData.user?.full_name}
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {orderData.user?.email_address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          {orderData.additionals && orderData.additionals.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Services
              </h3>

              <div className="space-y-3">
                {orderData.additionals.map((additional, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-gray-700">{additional.title}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ${parseFloat(additional.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Event Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Location</h4>
                  <p className="text-gray-600">{orderData.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Event Date & Time
                  </h4>
                  <p className="text-gray-600">
                    {orderData.event_date} at {orderData.event_time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Price Breakdown
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Base Service</span>
                <span className="font-medium text-gray-800">
                  ${baseAmount.toFixed(2)}
                </span>
              </div>

              {orderData.additionals?.map((additional, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span className="text-gray-600">{additional.title}</span>
                  <span className="font-medium text-gray-800">
                    ${parseFloat(additional.price).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr className="border-gray-300 my-4" />

              <div className="flex justify-between py-2 bg-purple-50 -mx-6 px-6 rounded">
                <span className="font-bold text-gray-800 text-lg">
                  Total Amount
                </span>
                <span className="font-bold text-purple-600 text-lg">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Time Left & Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center bg-amber-50 p-4 rounded-lg border border-amber-200">
                <span className="text-gray-700 font-medium">Event Date</span>
                <span className="text-orange-600 font-semibold">
                  {orderData.event_date}
                </span>
              </div>

              {orderData.status === "Active" && daysLeft !== null && (
                <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <span className="text-gray-700 font-medium">Days Left</span>
                  <span
                    className={`font-bold text-lg ${
                      daysLeft < 0
                        ? "text-red-600"
                        : daysLeft === 0
                        ? "text-green-600"
                        : daysLeft <= 7
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)} days ago`
                      : daysLeft === 0
                      ? "Today!"
                      : `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/conversation"
                className="flex-1 bg-[#c8c1f5] font-semibold text-gray-600 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-200/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Message</span>
              </Link>
              {orderData.status === "Pending" && (
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="flex-1 bg-[#c8c1f5] font-semibold text-gray-600 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-200/30"
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Complete Modal */}
      {showTaskCompleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-center items-center py-5">
              <img src={question} alt="" className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Are you sure you want to mark this task as complete?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTaskCompleteModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskComplete}
                className="h-12 px-6 bg-[#c8c1f5] font-semibold text-gray-600 rounded-full hover:bg-[#b0a8e2] transition-colors duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Order Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-center items-center py-5">
              <img src={question} alt="" className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Are you sure you want to accept this order?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="py-3 w-full px-6 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptOrder}
                className="py-3 px-6 w-full bg-[#c8c1f5] font-semibold text-gray-600 rounded-full hover:bg-[#b0a8e2] transition-colors duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}