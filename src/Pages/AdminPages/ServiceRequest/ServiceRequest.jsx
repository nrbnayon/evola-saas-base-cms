import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";
import useServicesRequest from "../../../dashboardHook/useServicesRequest";
import apiClient from "../../../lib/api-client";
import Swal from "sweetalert2";

const ServiceRequest = () => {
  const { services, loading: servicesLoading, error: servicesError, refetch } = useServicesRequest([]);

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
    seller: service.seller,
    service_type: service.category,
    price: `$${parseFloat(service.price).toFixed(2)}`,
    status: service.status,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); // Track updating state
  const itemsPerPage = 10;

  const filteredOrders = transformedServices.filter(
    (order) =>
      order.id &&
      order.eventName &&
      order.seller &&
      order.location &&
      order.service_type &&
      (order.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.service_type.toLowerCase().includes(searchQuery.toLowerCase()))
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

  // API client to update service status
  const updateServiceStatus = async (id, status) => {
    if (!id) {
      console.error("Invalid service ID:", id);
      alert("Cannot update service: Invalid ID");
      return;
    }
    try {
      setIsUpdating(true);
      await apiClient.put(`/administration/service/request/update/${id}`, { status });
      refetch();
    } catch (error) {
      console.error(`Error updating service ${id} to ${status}:`, error);
      alert(`Failed to update service status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle approving a single service
  const handleApprove = (id) => {
    if (isUpdating) return; // Prevent multiple updates
    updateServiceStatus(id, "Approved");
    Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Service Approved",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
    
  };

  // Handle denying a single service
  const handleDeny = (id) => {
    if (isUpdating) return; // Prevent multiple updates
    updateServiceStatus(id, "Declined");
    Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Service Declined",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
  };

  // Handle approving all services
  const handleApproveAll = async () => {
    if (isUpdating) return; // Prevent multiple updates
    if (filteredOrders.length === 0) {
      alert("No services to approve");
      return;
    }
    try {
      setIsUpdating(true);
      await Promise.all(
        filteredOrders.map((service) => {
          if (!service.id) {
            console.error("Invalid service ID in bulk approve:", service);
            return Promise.reject(new Error("Invalid service ID"));
          }
          return apiClient.put(`/administration/service/request/update/${service.id}`, {
            status: "Approved",
          });
        })
      );
      refetch();
      Swal.fire({
              position: "top-end",
              icon: "success",
              title: "All Service Approved",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            })
    } catch (error) {
      console.error("Error approving all services:", error);
      alert("Failed to approve all services: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle denying all services
  const handleDenyAll = async () => {
    if (isUpdating) return; // Prevent multiple updates
    if (filteredOrders.length === 0) {
      alert("No services to deny");
      return;
    }
    try {
      setIsUpdating(true);
      await Promise.all(
        filteredOrders.map((service) => {
          if (!service.id) {
            console.error("Invalid service ID in bulk deny:", service);
            return Promise.reject(new Error("Invalid service ID"));
          }
          return apiClient.put(`/administration/service/request/update/${service.id}`, {
            status: "Declined",
          });
        })
      );
      refetch();
      Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Service Declined",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            })
    } catch (error) {
      console.error("Error denying all services:", error);
      alert("Failed to deny all services: " + error.message);
    } finally {
      setIsUpdating(false);
    }
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
        <div className="text-gray-600 text-lg">Loading service requests...</div>
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
        title="Service Request"
        description="Track, manage, and forecast your customers and orders."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold">Request List</h1>
          <div className="flex gap-5">
            <button
              onClick={handleApproveAll}
              disabled={isUpdating}
              className={`py-2 px-4 bg-purple-200 text-black rounded-lg hover:shadow-xl ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Approve All
            </button>
            <button
              onClick={handleDenyAll}
              disabled={isUpdating}
              className={`py-2 px-4 border border-gray-200 text-black rounded-lg hover:shadow-xl ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Deny All
            </button>
          </div>
        </div>
        <div className="pb-6">
          <input
            type="text"
            placeholder="Search service requests..."
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
                      <Link
                        to={`/admin/request-details/${service.id}`}
                        className="text-purple-600 hover:underline"
                      >
                        {service.eventName}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">{service.date}</td>
                    <td className="p-4 text-gray-700">{service.location}</td>
                    <td className="p-4 text-gray-700">{service.price}</td>
                    <td className="p-4 text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : service.status === "Canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-6">
                        <button
                          onClick={() => handleApprove(service.id)}
                          disabled={isUpdating}
                          className={isUpdating ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Check className="text-green-500 hover:text-green-700" />
                        </button>
                        <button
                          onClick={() => handleDeny(service.id)}
                          disabled={isUpdating}
                          className={isUpdating ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <X className="text-red-500 hover:text-red-700" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No service requests found matching your criteria.
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

export default ServiceRequest;