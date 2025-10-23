import { Mail, MapPin, Calendar } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";

export default function OrderDetailPage() {
  const user = {
    name: "Daniel Smith",
    email: "daniel@gmail.com",
    location: "Overland Park, KS",
    joinDate: "6 Jan, 2025",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  };

  const orderDetails = {
    title: "Destination engagement and wedding hall, california",
    description:
      "California offers stunning destination engagement and wedding venues, from oceanfront resorts and lush vineyards to historic estates and garden courtyards. Couples can enjoy picturesque backdrops, luxury amenities, and customizable packages for an unforgettable celebration.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=300&fit=crop",
    eventLocation: "775 Rolling Green Rd.",
    eventStart: "19/04/2025",
    eventEnd: "19/04/2025",
    status: "In progress",
    total: "$6,785",
  };

  return (
    <div className="">
      <SectionTitle title={"Order Details"} />
      <div className="">
        <nav className="text-sm text-gray-500 mb-6">
          <button
            onClick={() => window.history.back()}
            className="hover:text-gray-700 cursor-pointer text-gray-500 hover:underline"
          >
            Order
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
                    <span className="text-sm">{user.joinDate}</span>
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
                  <p className="text-sm text-gray-600">
                    {orderDetails.eventLocation}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Event Start
                  </h3>
                  <p className="text-sm text-gray-600">
                    {orderDetails.eventStart}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Event End
                  </h3>
                  <p className="text-sm text-gray-600">
                    {orderDetails.eventEnd}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Status
                  </h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {orderDetails.status}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Total
                    </h3>
                    <span className="text-lg font-semibold text-gray-900">
                      {orderDetails.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={orderDetails.image}
                alt={orderDetails.title}
                className="w-1/2 h-auto object-cover rounded-2xl"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                {orderDetails.title}
              </h1>
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {orderDetails.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
