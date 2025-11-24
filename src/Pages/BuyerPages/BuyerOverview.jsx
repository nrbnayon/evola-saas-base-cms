import {
  Package,
  DollarSign,
  TrendingUp,
  Briefcase,
  Wallet,
  Eye,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function BuyerOverview() {
  const [hasData, setHasData] = useState(true);

  const EmptyStateIllustration = () => (
    <div className="flex justify-center items-center">
      <svg
        width="64"
        height="64"
        viewBox="0 0 120 120"
        className="text-purple-200 w-16 h-16 sm:w-20 sm:h-20"
      >
        <path
          d="M30 40 Q50 20, 70 40 Q90 60, 70 80 Q50 100, 30 80 Q10 60, 30 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M25 50 Q40 35, 55 50 Q70 65, 55 80 Q40 95, 25 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="45" cy="45" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="75" cy="75" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );

  const activeOrders = hasData
    ? [
        {
          id: 1,
          title: "Catering services for home event",
          image:
            "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
          status: 2,
        },
        {
          id: 2,
          title: "Catering services for home event",
          image:
            "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
          status: 2,
        },
        {
          id: 3,
          title: "Outdoor party catering services",
          image:
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
          status: 5,
        },
        {
          id: 4,
          title: "Corporate inhouse event managment",
          image:
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
          status: 1,
        },
      ]
    : [];

  const services = hasData
    ? [
        {
          id: 1,
          title: "Floral Arrangements",
          category: "Floral Arrangements",
          image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
          price: 150,
        },
        {
          id: 2,
          title: "Outdoor party catering",
          category: "Catering",
          image:
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
          price: 150,
        },
      ]
    : [];

  const stats = {
    totalBookings: hasData ? 213 : 0,
    income: hasData ? 2788 : 0,
    totalSales: hasData ? 2456 : 0,
    totalServices: hasData ? 120 : 0,
    totalBalance: hasData ? 2788 : 0,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-orange-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen container mx-auto">
      <div className="">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                Hey Daniel 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Welcome back to your dashboard!
              </p>
            </div>
            <button
              onClick={() => setHasData(!hasData)}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              {hasData ? "Show No Data" : "Show With Data"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
                  alt="Daniel Smith"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                Daniel Smith
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                danial@gmail.com
              </p>
              <button className="w-full py-2 sm:py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
                View profile
              </button>
            </div>

            {/* Active Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Active Orders
                </h3>
                <button className="text-purple-600 text-xs sm:text-sm hover:text-purple-800">
                  See All
                </button>
              </div>

              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={order.image}
                          alt={order.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 text-sm font-medium truncate">
                          {order.title}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${getStatusColor(
                          order.status
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white text-[10px] sm:text-xs font-bold">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <EmptyStateIllustration />
                  <p className="text-gray-500 text-sm mt-4">
                    No active orders yet
                  </p>
                </div>
              )}

              <button className="w-full mt-6 py-2 sm:py-3 border border-purple-300 text-purple-600 rounded-full hover:bg-purple-50 transition flex items-center justify-center space-x-2 text-sm">
                <Eye className="w-4 h-4" />
                <span>Manage Services</span>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                icon={<Package className="w-5 h-5 text-gray-400" />}
                label="Total Bookings"
                value={stats.totalBookings.toLocaleString()}
              />
              <StatCard
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                label="Income"
                value={`$${stats.income.toFixed(2)} USD`}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
                label="Total Sales"
                value={`$${stats.totalSales.toFixed(2)} USD`}
              />
              <StatCard
                icon={<Briefcase className="w-5 h-5 text-gray-400" />}
                label="Total Services"
                value={stats.totalServices.toLocaleString()}
              />
            </div>

            {/* Balance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">Total Balance</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-purple-600">
                    ${stats.totalBalance.toFixed(2)} USD
                  </p>
                </div>
                <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition text-sm">
                  Balance withdraw
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Daniels Services
                </h3>
                <Link to='/my-services' className="text-purple-600 text-xs sm:text-sm hover:text-purple-800">
                  See All
                </Link>
              </div>

              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                            {service.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {service.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          ${service.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <EmptyStateIllustration />
                  <p className="text-gray-500 text-sm mt-4">
                    You don&apos;t have any service yet
                  </p>
                  <button className="mt-4 px-4 py-2 text-purple-600 border border-purple-300 rounded-full hover:bg-purple-50 transition flex items-center space-x-2 mx-auto text-sm">
                    <Plus className="w-4 h-4" />
                    <span>Create service</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable card for stats */
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center space-x-2 mb-3">
      {icon}
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
  </div>
);
