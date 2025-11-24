import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";
import useOrderList from "../../../dashboardHook/useAdminOrders";
import { format } from "date-fns";

const OrderList = () => {
  const { orderList, loading } = useOrderList();
  console.log("Order list response:", orderList); // Debug full response
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Use dynamic data if available, fallback to static if loading or empty
  const ordersRaw = loading || !orderList || !orderList.orders ? [] : orderList.orders;

  // Map to the required format and format date
  const orders = ordersRaw.map(order => ({
    id: order.id, // Use numeric id instead of order_id
    order_id: order.order_id, // Keep order_id for display
    eventName: order.event_name,
    date: format(new Date(order.event_date), 'MMM d, yyyy'),
    location: order.location,
    seller: order.seller.full_name, // Adjusted to match response structure
    buyer: order.buyer.full_name, // Adjusted to match response structure
    price: `$${order.amount}`,
    status: order.status,
  }));

  // Dynamic stats from response
  const totalOrders = orders.length.toString();
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      change: "40%",
      changeType: "increase",
      comparison: "vs last month",
    },
    {
      title: "Active Orders",
      value: loading ? "0" : orderList.total_active_orders?.toString() || "0",
      change: "20%",
      changeType: "decrease",
      comparison: "vs last month",
    },
    {
      title: "Total Cancel",
      value: loading ? "0" : orderList.total_cancelled_orders?.toString() || "0",
      change: "20%",
      changeType: "decrease",
      comparison: "From last month",
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      order.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
              currentPage === i
                ? "bg-purple-100 text-black"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
            currentPage === 1
              ? "bg-purple-100 text-black"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-500 mx-1">
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
                currentPage === i
                  ? "bg-purple-100 text-black"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-500 mx-1">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-purple-100 text-black"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="">
      <SectionTitle
        title={"Order List"}
        description={"Track, manage and forecast your customers and orders."}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {stat.value}
            </p>
            {stat.change && (
              <div className="flex items-center mt-1 text-sm">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span
                  className={
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">{stat.comparison}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 uppercase text-sm font-bold">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Seller</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-700">{order.order_id}</td>
                    <td className="p-4 text-gray-700">
                      <Link to={`/admin/order-details/${order.id}`}>
                        {order.eventName}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">{order.date}</td>
                    <td className="p-4 text-gray-700">{order.location}</td>
                    <td className="p-4 text-gray-700">{order.seller}</td>
                    <td className="p-4 text-gray-700">{order.buyer}</td>
                    <td className="p-4 text-gray-700">{order.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Active" || order.status === "Accepted" || order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No order found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 flex items-center justify-between">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-2">{renderPaginationButtons()}</div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;