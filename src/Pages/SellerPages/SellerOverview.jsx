import {
  Package,
  TrendingUp,
  Briefcase,
  Wallet,
  Eye,
  Plus,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import useSellerAnalytics from "../../hooks/useSellerAnalytics";
import service_box from "../../assets/images/service_box.svg";

const EmptyStateIllustration = () => (
  <div className="flex justify-center items-center">
    <img
      src={service_box}
      alt="No items"
      className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 opacity-80"
    />
  </div>
);

const StatCard = ({ icon, label, value, highlight = false }) => (
  <div
    className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${
      highlight ? "bg-purple-50" : ""
    }`}
  >
    <div className="flex items-center space-x-2 mb-3">
      {icon}
      <span className="text-gray-500 text-sm font-medium">{label}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold text-gray-700">{value}</p>
  </div>
);

const ActiveOrderCard = ({ order }) => (
  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-300">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={order.cover_photo}
        alt={order.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-800 text-sm font-medium truncate">
        {order.title}
      </p>
      <p className="text-gray-500 text-xs">
        Total orders: {order.total_orders}
      </p>
    </div>
    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-[10px] sm:text-xs font-bold">
        {order.total_orders}
      </span>
    </div>
  </div>
);

const ServiceCard = ({ service }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
        <img
          src={service.cover_photo}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="font-medium text-gray-800 text-sm sm:text-base">
          {service.title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500">
          {service.category.title}
        </p>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600 ml-1">
            {service.average_rating || 0}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-800 text-sm sm:text-base">
        ${parseFloat(service.price).toFixed(2)}
      </p>
      <p className="text-xs text-gray-500">
        {service.complete_orders} completed
      </p>
    </div>
  </div>
);

export default function SellerOverview() {
  const { analytics, loading } = useSellerAnalytics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <EmptyStateIllustration />
        <p className="text-gray-500 text-sm mt-4">No data available</p>
      </div>
    );
  }

  const activeOrders = analytics.service_and_active_orders || [];
  const services = analytics.service_list || [];
  const stats = {
    totalBookings: analytics.total_bookings || 0,
    income: analytics.this_month_income || 0,
    totalSales: analytics.total_income || 0,
    totalServices: analytics.total_services || 0,
    totalCompleted: analytics.total_completed || 0,
  };

  return (
    <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
              Hey {analytics.full_name} 👋
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Welcome back to your dashboard!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile */}
          <div
            className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            style={{
              backgroundImage: `url(${analytics.cover_photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-purple-100">
              <img
                src={analytics.photo}
                alt={analytics.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
              {analytics.full_name}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4">
              {analytics.email_address}
            </p>
            <Link
              to={`/seller-profile/${analytics.user_id}`}
              className="w-full py-2 sm:py-3 border border-purple-200 text-purple-500 rounded-full hover:bg-purple-50 transition-colors duration-300 inline-block text-sm font-medium"
            >
              View Profile
            </Link>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Active Orders
              </h3>
              <Link
                to="/manage-orders"
                className="text-purple-500 text-xs sm:text-sm hover:text-purple-700 transition-colors duration-300"
              >
                See All
              </Link>
            </div>

            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map((order, index) => (
                  <ActiveOrderCard key={index} order={order} />
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

            <Link
              to="/manage-orders"
              className="w-full mt-6 py-2 sm:py-3 border border-purple-200 text-purple-500 rounded-full hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              <span>Manage Orders</span>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              icon={<Briefcase className="w-5 h-5 text-gray-400" />}
              label="Total Services"
              value={stats.totalServices.toLocaleString()}
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
              label="Total Sales"
              value={`$${stats.totalSales.toFixed(2)} USD`}
            />
            <StatCard
              icon={<Package className="w-5 h-5 text-gray-400" />}
              label="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
            />
            <StatCard
              icon={<Star className="w-5 h-5 text-gray-400" />}
              label="Completed Orders"
              value={stats.totalCompleted.toLocaleString()}
            />
          </div>

          {/* Balance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500 text-sm font-medium">
                    This Month's Income
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-purple-500">
                  ${stats.income.toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {analytics.full_name}'s Services
              </h3>
              <Link
                to="/my-services"
                className="text-purple-500 text-xs sm:text-sm hover:text-purple-700 transition-colors duration-300"
              >
                See All
              </Link>
            </div>

            {services.length > 0 ? (
              <div className="">
                {services.slice(0, 3).map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <EmptyStateIllustration />
                <p className="text-gray-500 text-sm mt-4">
                  You don&apos;t have any service yet
                </p>
                <Link
                  to="/create-service"
                  className="mt-1 px-4 py-2 text-purple-500 transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Service</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
