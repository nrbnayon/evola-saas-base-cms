import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import SectionTitle from "../../../components/SectionTitle";
import { Link } from "react-router-dom";

export default function AllUser() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const allUsers = [
    {
      id: 1,
      name: "Olivia Rhye",
      email: "phoenix@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Buyer",
    },
    {
      id: 2,
      name: "Phoenix Baker",
      email: "phoenix@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Seller",
    },
    {
      id: 3,
      name: "Candice Wu",
      email: "candice@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Buyer",
    },
    {
      id: 4,
      name: "Drew Cano",
      email: "drew@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Seller",
    },
    {
      id: 5,
      name: "Orlando Diggs",
      email: "orlando@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Buyer",
    },
    {
      id: 6,
      name: "Andi Lane",
      email: "andi@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Seller",
    },
    {
      id: 7,
      name: "Kate Morrison",
      email: "kate@untitledui.com",
      joiningDate: "Jan 6, 2025",
      location: "Overland Park, KS",
      userType: "Buyer",
    },
    {
      id: 8,
      name: "John Smith",
      email: "john@untitledui.com",
      joiningDate: "Jan 5, 2025",
      location: "Austin, TX",
      userType: "Seller",
    },
    {
      id: 9,
      name: "Sarah Johnson",
      email: "sarah@untitledui.com",
      joiningDate: "Jan 4, 2025",
      location: "Denver, CO",
      userType: "Buyer",
    },
    {
      id: 10,
      name: "Mike Wilson",
      email: "mike@untitledui.com",
      joiningDate: "Jan 3, 2025",
      location: "Seattle, WA",
      userType: "Seller",
    },
    {
      id: 11,
      name: "Emily Davis",
      email: "emily@untitledui.com",
      joiningDate: "Jan 2, 2025",
      location: "Miami, FL",
      userType: "Buyer",
    },
    {
      id: 12,
      name: "David Brown",
      email: "david@untitledui.com",
      joiningDate: "Jan 1, 2025",
      location: "Boston, MA",
      userType: "Seller",
    },
    {
      id: 13,
      name: "Lisa Garcia",
      email: "lisa@untitledui.com",
      joiningDate: "Dec 31, 2024",
      location: "Phoenix, AZ",
      userType: "Buyer",
    },
    {
      id: 14,
      name: "Tom Anderson",
      email: "tom@untitledui.com",
      joiningDate: "Dec 30, 2024",
      location: "Portland, OR",
      userType: "Seller",
    },
    {
      id: 15,
      name: "Anna Martinez",
      email: "anna@untitledui.com",
      joiningDate: "Dec 29, 2024",
      location: "Nashville, TN",
      userType: "Buyer",
    },
    {
      id: 16,
      name: "Chris Lee",
      email: "chris@untitledui.com",
      joiningDate: "Dec 28, 2024",
      location: "San Diego, CA",
      userType: "Seller",
    },
    {
      id: 17,
      name: "Jessica White",
      email: "jessica@untitledui.com",
      joiningDate: "Dec 27, 2024",
      location: "Atlanta, GA",
      userType: "Buyer",
    },
    {
      id: 18,
      name: "Ryan Taylor",
      email: "ryan@untitledui.com",
      joiningDate: "Dec 26, 2024",
      location: "Chicago, IL",
      userType: "Seller",
    },
  ];

  const [users, setUsers] = useState(allUsers);

  const avatarColors = [
    "bg-purple-100 text-purple-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-pink-100 text-pink-600",
    "bg-indigo-100 text-indigo-600",
    "bg-red-100 text-red-600",
    "bg-orange-100 text-orange-600",
    "bg-teal-100 text-teal-600",
  ];

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by tab
    if (activeTab !== "All") {
      filtered = filtered.filter((user) => user.userType === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [users, activeTab, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
              currentPage === i
                ? "text-black bg-purple-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
            currentPage === 1
              ? "text-black bg-purple-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          1
        </button>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-500">
            ...
          </span>
        );
      }

      // Show pages around current page
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
                  ? "text-black bg-purple-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-500">
            ...
          </span>
        );
      }

      // Show last page
      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? "text-black bg-purple-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
        title={"Buyer & User management"}
        description={"Track, manage and forecast your customers and orders."}
      />
      <div className="border border-gray-200 p-5 rounded-2xl">
        {/* Header */}
        <div className="">
          {/* Filter Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {["All", "Seller", "Buyer"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? "text-gray-900 bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}{" "}
            of {filteredUsers.length} results
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/userDetail/${user.id}`}
                        className="flex items-center"
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            avatarColors[user.id % avatarColors.length]
                          }`}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.joiningDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.userType === "Seller"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {renderPaginationButtons()}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 "
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
