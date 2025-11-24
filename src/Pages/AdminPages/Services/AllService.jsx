import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";
import useServicesList from "../../../hooks/useServicesList";

const AllService = () => {
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServicesList([]);

  // Transform fetched services to match table structure
  const transformedServices = services.map((service) => ({
    id: service.id,
    eventName: service.title,
    date: new Date(service.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    location: service.location,
    seller: service.seller.full_name,
    service_type: service.category.title,
    price: `$${parseFloat(service.price).toFixed(2)}`,
    status: service.status,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredOrders = transformedServices.filter(
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

  if (servicesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">Loading services...</div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-lg">Error: {servicesError}</div>
      </div>
    );
  }

  return (
    <div className="">
      <SectionTitle
        title="All Services"
        description="Track, manage, and forecast your customers and orders."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <input
            type="text"
            placeholder="Search services..."
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
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-700">{service.id}</td>
                    <td className="p-4 text-gray-700">{service.eventName}</td>
                    <td className="p-4 text-gray-700">{service.date}</td>
                    <td className="p-4 text-gray-700">{service.location}</td>
                    <td className="p-4 text-gray-700">{service.seller}</td>
                    <td className="p-4 text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800`}
                      >
                        {service.service_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{service.price}</td>
                    <td className="p-4 text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : service.status === "Canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status}
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
                    No services found matching your criteria.
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

export default AllService;
