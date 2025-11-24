import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";

const SellerRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([
    {
      id: "ORD-AX93K7-1",
      eventName: "Catering",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Phoenix Baker",
      service_type: "Regular",
      price: "$2,000",
      status: "Active",
    },
    {
      id: "ORD-AX93K7-2",
      eventName: "Wedding photography expert in chicago",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Drew Cano",
      service_type: "Regular",
      price: "$3,500",
      status: "Canceled",
    },
    {
      id: "ORD-AX93K7-3",
      eventName: "Dj",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Phoenix Baker",
      service_type: "Regular",
      price: "$1,800",
      status: "Active",
    },
    {
      id: "ORD-AX93K7-4",
      eventName: "Catering",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Drew Cano",
      service_type: "Regular",
      price: "$2,000",
      status: "Pending",
    },
    {
      id: "ORD-AX93K7-5",
      eventName: "Wedding photography expert in chicago",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Phoenix Baker",
      service_type: "Regular",
      price: "$3,500",
      status: "Active",
    },
    {
      id: "ORD-AX93K7-6",
      eventName: "Dj",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Drew Cano",
      service_type: "Regular",
      price: "$1,800",
      status: "Canceled",
    },
    {
      id: "ORD-AX93K7-7",
      eventName: "Catering",
      date: "Jan 6, 2025",
      location: "Overland Park, KS",
      seller: "Phoenix Baker",
      service_type: "Custom",
      price: "$2,000",
      status: "Active",
    },
  ]);

  const itemsPerPage = 10;

  const filteredOrders = services.filter(
    (order) =>
      order.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: "Active" } : service
      )
    );
  };

  const handleDeny = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: "Canceled" } : service
      )
    );
  };

  const handleApproveAll = () => {
    setServices((prev) =>
      prev.map((service) => ({ ...service, status: "Active" }))
    );
  };

  const handleDenyAll = () => {
    setServices((prev) =>
      prev.map((service) => ({ ...service, status: "Canceled" }))
    );
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

  return (
    <div className="">
      <SectionTitle
        title={"Service Request"}
        description={"Track, manage and forecast your customers and orders."}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold">Request List</h1>
          <div className="flex gap-5">
            <button
              onClick={handleApproveAll}
              className="py-2 px-4 bg-purple-200 text-black rounded-lg hover:shadow-xl"
            >
              Approve All
            </button>
            <button
              onClick={handleDenyAll}
              className="py-2 px-4 border border-gray-200 text-black rounded-lg hover:shadow-xl"
            >
              Deny All
            </button>
          </div>
        </div>
        <div className="pb-6">
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
                <th className="py-3 px-4">Seller</th>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-700">{service.seller}</td>
                    <td className="p-4 text-gray-700">
                      <Link to={`/admin/request-details/${service.id}`}>
                        {service.eventName}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">{service.date}</td>
                    <td className="p-4 text-gray-700">{service.location}</td>
                    <td className="p-4 text-gray-700">{service.price}</td>
                    <td className="p-4 text-gray-700">{service.status}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-6">
                        <button onClick={() => handleApprove(service.id)}>
                          <Check className="text-green-500 hover:text-green-700" />
                        </button>
                        <button onClick={() => handleDeny(service.id)}>
                          <X className="text-red-500 hover:text-red-700" />
                        </button>
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
                    No Request found matching your criteria.
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

export default SellerRequest;