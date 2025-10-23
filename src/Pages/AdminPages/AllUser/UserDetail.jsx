import { Mail, MapPin, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle";

export default function UserDetailPage() {
  const user = {
    name: "Daniel Smith",
    role: "Seller",
    email: "daniel@gmail.com",
    location: "Overland Park, KS",
    joinDate: "6 Jan, 2025",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  };

  const stats = [
    {
      title: "Total earning",
      value: "2,420",
      change: "40%",
      changeType: "increase",
      comparison: "vs last month",
    },
    {
      title: "Total orders",
      value: "316",
      change: "40%",
      changeType: "decrease",
      comparison: "vs last month",
    },
    {
      title: "Total reviews",
      value: "420",
      comparison: "From last month",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Floral Arrangements",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=80&h=80&fit=crop",
    },
    {
      id: 2,
      title: "Floral Arrangements",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=80&h=80&fit=crop",
    },
  ];

  const activeOrders = [
    {
      id: 1,
      title: "Floral Arrangements",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop",
    },
    {
      id: 2,
      title: "Floral Arrangements",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=80&h=80&fit=crop",
    },
    {
      id: 3,
      title: "Outdoor party catering",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
    },
    {
      id: 4,
      title: "Outdoor party catering",
      category: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop",
    },
  ];

  return (
    <div className="">
      <SectionTitle
        title={`${user.role} Details`}
        description={"Track, manage and forecast your customers and orders."}
      />
      <div className="border border-gray-200 rounded-2xl p-5">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="text-sm text-gray-500">
            <Link
              to="/admin/user"
              className="hover:text-gray-700 cursor-pointer"
            >
              {user.role}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-medium">
              {user.role} details
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-4">
                  {user.name}
                </h1>

                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">{user.email}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">{user.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">{user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                placerat, leo. Nullam sit sodales, convallis, luctus Cras luctus
                non diam enim. eu Nam quis tincidunt non est. urna gravida .
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Danial Services
              </h2>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className={`flex items-center p-3 border border-gray-200 rounded-lg ${
                      index > 0 ? "mt-3" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {service.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Orders */}
          <div className="lg:col-span-2">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  {stat.change && (
                    <div className="flex items-center text-sm">
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
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
                      <span className="text-gray-500 ml-1">
                        {stat.comparison}
                      </span>
                    </div>
                  )}
                  {!stat.change && (
                    <div className="text-sm text-gray-500">
                      {stat.comparison}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Active Orders
              </h2>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      <img
                        src={order.image}
                        alt={order.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {order.title}
                      </h3>
                      <p className="text-gray-500 text-xs">{order.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
