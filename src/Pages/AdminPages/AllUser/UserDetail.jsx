// src/pages/admin/UserDetailPage.jsx
import { Mail, MapPin, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import Section_Title from "../../../components/SectionTitle";
import useUserDetail from "../../../dashboardHook/useUserDetail";

export default function UserDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  // Detect role: Capital S
  const isSeller =
    location.pathname.includes("/seller") ||
    location.pathname.includes("/sellers");
  const role = isSeller ? "Seller" : "Buyer"; // Capital S

  const { detail, loading, error } = useUserDetail(role, id);
  console.log(detail);

  // Mock fallback data
  const mock = {
    name: "Daniel Smith",
    role: role,
    email: "daniel@gmail.com",
    location: "Overland Park, KS",
    joinDate: "6 Jan, 2025",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    stats: [
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
      { title: "Total reviews", value: "420", comparison: "From last month" },
    ],
    services: [
      {
        id: 1,
        title: "Floral Arrangements",
        category: "Floral",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=80&h=80&fit=crop",
      },
      {
        id: 2,
        title: "Floral Arrangements",
        category: "Floral",
        image:
          "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=80&h=80&fit=crop",
      },
    ],
    activeOrders: [
      {
        id: 1,
        title: "Floral Arrangements",
        category: "Floral",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop",
      },
      {
        id: 2,
        title: "Floral Arrangements",
        category: "Floral",
        image:
          "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=80&h=80&fit=crop",
      },
      {
        id: 3,
        title: "Outdoor party catering",
        category: "Catering",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
      },
      {
        id: 4,
        title: "Outdoor party catering",
        category: "Catering",
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop",
      },
    ],
  };

  const user = detail || mock;
  const services = detail?.services || mock.services;
  const activeOrders = detail?.activeOrders || mock.activeOrders;

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error (but show mock)
  if (error && !detail) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-2">Error: {error}</p>
        <p className="text-sm text-gray-500">Showing mock data...</p>
      </div>
    );
  }

  return (
    <div>
      <Section_Title
        title={`${user?.role} Details`}
        description="Track, manage and forecast your customers and orders."
      />

      <div className="border border-gray-200 rounded-2xl p-5">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to={`/admin/user`} className="hover:text-gray-700">
            {user?.role}s
          </Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900 font-medium">
            {user?.role} details
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <img
                  src={user?.photo}
                  alt={user?.full_name}
                  className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                />
                <h1 className="text-xl font-semibold text-gray-900">
                  {user.full_name}
                </h1>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{user?.email_address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{user.phone_number || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{user.created_at}</span>
                </div>
              </div>
            </div>

            {/* Description (optional) */}
            {detail?.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {detail.description}
                </p>
              </div>
            )}

            {/* Services (Only for Seller) */}
            {role === "Seller" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {user?.full_name?.split(" ")[0]}'s Services
                </h2>
                <div className="space-y-3">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {s.title}
                        </h3>
                        <p className="text-gray-500 text-xs">{s.category}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Link
                      to={`/admin/${role.toLowerCase()}s/${id}/services`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View all services →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Stats + Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}

            {user.role === "Seller" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Active Orders
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_active_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Earning
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${user?.total_earning || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Complete Order
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_completed_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Paid Orders
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_paid_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Reviews
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_reviews || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Active Orders
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_active_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Bought
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${user?.total_bought || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Paid Order
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_paid_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Pending Orders
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_pending_orders || "N/A"}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total Reviews
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.total_reviews || "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* Active Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Active Orders
              </h2>
              <div className="space-y-3">
                {user?.active_orders?.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={order.image}
                      alt={order.event_name}
                      className="w-12 h-12 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {order.event_name}
                      </h3>
                      <p className="text-gray-500 text-xs">{order.order_id}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link
                    to={`/admin/orders?user=${id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View all orders →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
