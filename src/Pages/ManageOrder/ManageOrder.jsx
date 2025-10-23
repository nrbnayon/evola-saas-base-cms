import { useState } from "react";
import image1 from "../../assets/images/cardImage1.png";
import image2 from "../../assets/images/cardImage2.png";
import image3 from "../../assets/images/cardImage3.png";
import image4 from "../../assets/images/cardImage4.png";
import image5 from "../../assets/images/cardImage5.png";
import image6 from "../../assets/images/cardImage6.png";
import image7 from "../../assets/images/cardImage7.png";
import image8 from "../../assets/images/cardImage8.png";
import { Link } from "react-router-dom";

const ManageOrder = () => {
  const initialOrders = [
    {
      id: 1,
      bannerImage: image1,
      service: "Event Decoration",
      location: "New York, NY New York, NY",
      client: "Emily Johnson",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "08:00AM-06:00PM",
      price: "$1200",
      status: "In Progress",
    },
    {
      id: 2,
      bannerImage: image2,
      service: "DJ Party Setup",
      location: "Los Angeles, CA Los Angeles, CA",
      client: "Michael Brown",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "10:00AM-08:00PM",
      price: "$1800",
      status: "Complete",
    },
    {
      id: 3,
      bannerImage: image3,
      service: "Catering Service",
      location: "Chicago, IL Chicago, IL",
      client: "Sarah Davis",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "09:00AM-07:00PM",
      price: "$900",
      status: "Pending",
    },
    {
      id: 4,
      bannerImage: image4,
      service: "Wedding Photography",
      location: "Houston, TX Houston, TX",
      client: "David Wilson",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "11:00AM-09:00PM",
      price: "$1500",
      status: "In Progress",
    },
    {
      id: 5,
      bannerImage: image5,
      service: "Makeup Artist",
      location: "Phoenix, AZ Phoenix, AZ",
      client: "Lisa Anderson",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "01:00PM-10:00PM",
      price: "$700",
      status: "Complete",
    },
    {
      id: 6,
      bannerImage: image6,
      service: "Stage Lighting",
      location: "Seattle, WA Seattle, WA",
      client: "James Taylor",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "07:00AM-05:00PM",
      price: "$1100",
      status: "Cancelled",
    },
    {
      id: 7,
      bannerImage: image7,
      service: "Live Music Band",
      location: "Miami, FL Miami, FL",
      client: "Rachel White",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "06:00AM-04:00PM",
      price: "$2000",
      status: "Pending",
    },
    {
      id: 8,
      bannerImage: image8,
      service: "Luxury Wedding Car",
      location: "Denver, CO Denver, CO",
      client: "Thomas Clark",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      deadline: "12:00PM-08:00PM",
      price: "$2500",
      status: "In Progress",
    },
  ];

  const [currentFilter, setCurrentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = currentFilter === "All"
    ? initialOrders
    : initialOrders.filter((order) => order.status === currentFilter);

  const activeCount = initialOrders.filter((order) => ["In Progress"].includes(order.status)).length;
  const pendingCount = initialOrders.filter((order) => order.status === "Pending").length;
  const completedCount = initialOrders.filter((order) => order.status === "Complete").length;
  const cancelledCount = initialOrders.filter((order) => order.status === "Cancelled").length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 container mx-auto mt-30 md:mt-15">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Manage Order</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setCurrentFilter("All"); setCurrentPage(1); }}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md ${currentFilter === "All" ? "text-purple-800" : "bg-gray-100 text-gray-700"} text-xs sm:text-sm`}
        >
          All
        </button>
        <button
          onClick={() => { setCurrentFilter("In Progress"); setCurrentPage(1); }}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md ${currentFilter === "In Progress" ? "text-purple-800" : "bg-gray-100 text-gray-700"} text-xs sm:text-sm`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => { setCurrentFilter("Pending"); setCurrentPage(1); }}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md ${currentFilter === "Pending" ? "text-purple-800" : "bg-gray-100 text-gray-700"} text-xs sm:text-sm`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => { setCurrentFilter("Complete"); setCurrentPage(1); }}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md ${currentFilter === "Complete" ? "text-purple-800" : "bg-gray-100 text-gray-700"} text-xs sm:text-sm`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => { setCurrentFilter("Cancelled"); setCurrentPage(1); }}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md ${currentFilter === "Cancelled" ? "text-purple-800" : "bg-gray-100 text-gray-700"} text-xs sm:text-sm`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 font-semibold">
              <th className="px-4 py-2 sm:px-6 sm:py-5 ">Service</th>
              <th className="px-4 py-2 sm:px-6 sm:py-5 ">Clients</th>
              <th className="px-4 py-2 sm:px-6 sm:py-5 ">Deadline</th>
              <th className="px-4 py-2 sm:px-6 sm:py-5 ">Price</th>
              <th className="px-4 py-2 sm:px-6 sm:py-5 ">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-t border-gray-200">
                <td className="px-4 py-2 sm:px-6 sm:py-4">
                  <div className="flex items-center">
                    <img
                      src={order.bannerImage}
                      alt={order.service}
                      className="w-24 h-16 object-cover mr-2 sm:mr-3 rounded-xl hidden sm:block"
                    />
                    <div>
                      <Link to={`/timeline/${order.id}`} className="text-purple-600 font-medium text-sm">{order.service}</Link>
                      <p className="text-gray-500 text-xs sm:text-sm">{order.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4">
                  <div className="flex items-center">
                    <img
                      src={order.avatar}
                      alt={order.client}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-1 sm:mr-2"
                    />
                    <span className="text-gray-700 text-sm">{order.client}</span>
                  </div>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base">{order.deadline}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base">{order.price}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 flex-wrap gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 h-10 w-10 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 text-xs sm:text-sm"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 py-1 h-10 w-10 sm:px-3 sm:py-2 rounded-full ${currentFilter === "All" && currentPage === page ? "bg-purple-200" : "bg-gray-200 text-gray-700"} text-xs sm:text-sm`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 h-10 w-10 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 text-xs sm:text-sm"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ManageOrder;