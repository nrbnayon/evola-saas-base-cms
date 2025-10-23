import { useState } from "react";
import { X, Calendar, Mail, MapPin, Check } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";

const RequestDetails = () => {
  const [certifications, setCertifications] = useState([
    { id: 1, name: "Business licence.pdf", url: "#" },
    { id: 2, name: "Work Certificate.pdf", url: "#" },
  ]);

  const [pendingServices, setPendingServices] = useState([
    {
      id: 1,
      name: "Catering services for home event",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=300&fit=crop",
      status: "pending",
    },
    {
      id: 2,
      name: "Outdoor party catering services",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop",
      status: "pending",
    },
  ]);

  const [providedServices] = useState([
    {
      id: 3,
      name: "Floral Arrangements",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Outdoor party catering",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop",
    },
  ]);

  const removeCertification = (id) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  const approveService = (id) => {
    setPendingServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: "approved" } : service
      )
    );
  };

  const declineService = (id) => {
    setPendingServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: "declined" } : service
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionTitle title={"Request Details"} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Section */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-100"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                Danial Smith
              </h3>
              <div className="space-y-1 mt-2">
                <p className="text-gray-600 flex items-center">
                  <Mail size={14} className="mr-2" />
                  danial@gmail.com
                </p>
                <p className="text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-2" />
                  Overland Park, KS
                </p>
                <p className="text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Joined: 6 Jan, 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Section */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Certifications
          </h3>
          {certifications.length > 0 ? (
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      📄
                    </div>
                    <span className="text-gray-700 font-medium">
                      {cert.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    title="Remove certificate"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              No certifications available
            </p>
          )}
          <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-colors">
            + Add Certification
          </button>
        </div>

        {/* Service Pending Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            Pending Services
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pendingServices.filter((s) => s.status === "pending").length}
            </span>
          </h3>
          <div className="space-y-4">
            {pendingServices.map((service) => (
              <div
                key={service.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium block">
                      {service.name}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status.charAt(0).toUpperCase() +
                        service.status.slice(1)}
                    </span>
                  </div>
                </div>
                {service.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveService(service.id)}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineService(service.id)}
                      className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Provided Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            Services Provided
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {providedServices.length}
            </span>
          </h3>
          <div className="space-y-4">
            {providedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-100"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <span className="text-gray-700 font-medium">
                    {service.name}
                  </span>
                  <div className="flex items-center mt-1">
                    <Check size={14} className="text-green-600 mr-1" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Add New Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
