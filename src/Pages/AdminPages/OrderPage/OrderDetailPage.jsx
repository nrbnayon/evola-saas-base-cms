import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Calendar, ArrowLeft } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";
import useAdminOrderDetails from "../../../dashboardHook/useAdminOrderDetails";
import { format } from "date-fns";

const mapOrderToDetail = (raw) => {
  console.log("Raw order data:", raw);
  return {
    user: {
      name: raw.buyer.full_name,
      email: "N/A",
      location: raw.location,
      joinDate: format(new Date(raw.created_at), "d MMM, yyyy"),
      avatar: raw.buyer.photo,
    },
    order: {
      title: raw.event_name,
      description: "Custom event service – details will be provided by the seller.",
      image: raw.service.cover_photo || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=300&fit=crop",
      eventLocation: raw.location,
      eventStart: format(new Date(raw.event_date), "dd/MM/yyyy"),
      eventEnd: format(new Date(raw.event_date), "dd/MM/yyyy"),
      status: raw.status,
      total: `$${raw.amount}`,
    },
  };
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  console.log("Extracted orderId from useParams:", orderId);
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useAdminOrderDetails(orderId);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    console.log("useAdminOrderDetails state:", { orderDetails, loading, error });
    if (loading || !orderDetails) return;
    try {
      setDetail(mapOrderToDetail(orderDetails));
    } catch (err) {
      console.error("Error mapping order details:", err);
      setDetail(null);
    }
  }, [orderDetails, loading]);

  if (!orderId) {
    console.log("No orderId provided in URL");
    return (
      <div className="p-6 text-center text-red-600">
        Invalid order ID
        <button
          onClick={() => navigate(-1)}
          className="ml-4 inline-flex items-center text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading order details…</div>;
  }

  if (error || !detail) {
    console.log("Error or no details:", { error, detail });
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Unable to load order details"}
        <button
          onClick={() => navigate(-1)}
          className="ml-4 inline-flex items-center text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </button>
      </div>
    );
  }

  const { user, order } = detail;

  return (
    <div className="">
      <SectionTitle title="Order Details" />
      <nav className="text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-gray-700 cursor-pointer text-gray-500 hover:underline"
        >
          Orders
        </button>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">Order details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 mb-4">
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
                  <span className="text-sm">Joined {user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Booking info
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Event Location
                </h3>
                <p className="text-sm text-gray-600">{order.eventLocation}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Event Start
                </h3>
                <p className="text-sm text-gray-600">{order.eventStart}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Event End
                </h3>
                <p className="text-sm text-gray-600">{order.eventEnd}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Status
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === "Active" ||
                    order.status === "Accepted" ||
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Total
                  </h3>
                  <span className="text-lg font-semibold text-gray-900">
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden mb-6">
            <img
              src={order.image}
              alt={order.title}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {order.title}
            </h1>
            <div className="mb-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {order.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}