import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import SectionTitle from "../../../components/SectionTitle";
import { Link } from "react-router-dom";
import useUserList from "../../../dashboardHook/useUserList";

// Theme constants
const AVATAR_COLORS = [
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

const USER_TYPE_STYLES = {
  Seller: "bg-green-100 text-green-800",
  Buyer: "bg-purple-100 text-purple-800",
};

const TABS = ["All", "Seller", "Buyer"];

const ITEMS_PER_PAGE = 8;
const SPINNER_COLOR = "#C8C1F5"; // Matches CategoryProducts and AdminLogin theme

// Helper to format ISO date to "Oct 7, 2025"
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function AllUser() {
  const { userList, loading } = useUserList();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
console.log(userList);
  // Map API userList to UI format
  const mappedUsers = useMemo(() => {
    return (
      userList?.map((user) => ({
        id: user.id,
        name: user.full_name || "Unknown User",
        email: user.email_address || "N/A",
        joiningDate: formatDate(user.created_at),
        phoneNumber: user.phone_number || "N/A",
        userType: user.role || "Buyer",
        photo: user.photo,
      })) || []
    );
  }, [userList]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    let filtered = mappedUsers;

    // Filter by tab
    if (activeTab !== "All") {
      filtered = filtered.filter((user) => user.userType === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phoneNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [mappedUsers, activeTab, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset page on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDeleteUser = (userId) => {
    // In a real app, this would call an API; here, filter locally for demo
    // setUsers(users.filter((user) => user.id !== userId));
    alert(`Delete user ${userId}? (Implement API call)`);
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
                ? "text-black bg-purple-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
              ? "text-black bg-purple-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-500">
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
                  ? "text-black bg-purple-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-500">
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div
          className={`w-10 h-10 border-4 border-[${SPINNER_COLOR}] border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  return (
    <div className="">
      <SectionTitle
        title={"Buyer & Seller management"}
        description={"Track, manage and forecast your customers and orders."}
      />
      <div className="border border-gray-200 p-5 rounded-2xl bg-white">
        {/* Header: Tabs and Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {TABS.map((tab) => (
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
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] focus:border-transparent w-80"
            />
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
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                  Phone Number
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
                        to={
                          user.userType === "Seller"
                            ? `/admin/sellers/${user.id}`
                            : `/admin/users/${user.id}`
                        }
                        className="flex items-center"
                      >
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              AVATAR_COLORS[user.id % AVATAR_COLORS.length]
                            }`}
                          >
                            {getInitials(user.name)}
                          </div>
                        )}
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
                        {user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          USER_TYPE_STYLES[user.userType] ||
                          "bg-gray-100 text-gray-800"
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
                  : "text-gray-500 hover:text-gray-700"
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
