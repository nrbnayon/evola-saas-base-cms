import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

export default function MyServices() {
  const [activeTab, setActiveTab] = useState("Active");
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Wedding Photography",
      location: "Overland Park, KS",
      orders: 5,
      time: "09:00AM-10:00PM",
      price: "$1000-$1500",
      status: "Active",
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      title: "Portrait Sessions",
      location: "Kansas City, MO",
      orders: 3,
      time: "10:00AM-06:00PM",
      price: "$200-$500",
      status: "Pending",
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      title: "Event Coverage",
      location: "Topeka, KS",
      orders: 4,
      time: "08:00AM-11:00PM",
      price: "$800-$1200",
      status: "Suspended",
      image: "/api/placeholder/80/80",
    },
    {
      id: 4,
      title: "Product Photography",
      location: "Lawrence, KS",
      orders: 2,
      time: "09:00AM-05:00PM",
      price: "$300-$600",
      status: "Active",
      image: "/api/placeholder/80/80",
    },
    {
      id: 5,
      title: "Landscape Photography",
      location: "Wichita, KS",
      orders: 1,
      time: "07:00AM-07:00PM",
      price: "$400-$800",
      status: "Suspended",
      image: "/api/placeholder/80/80",
    },
  ]);

  const [selectedService, setSelectedService] = useState(null);
  const [editedService, setEditedService] = useState(null);
  const editModal = useModal();
  const deleteModal = useModal();

  // Filter services based on active tab
  const filteredServices = services.filter(
    (service) => service.status === activeTab
  );
  const activeCount = services.filter(
    (service) => service.status === "Active"
  ).length;
  const pendingCount = services.filter(
    (service) => service.status === "Pending"
  ).length;
  const suspendedCount = services.filter(
    (service) => service.status === "Suspended"
  ).length;
  const totalOrders = services.reduce(
    (sum, service) => sum + service.orders,
    0
  );

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

 

  const saveEdit = () => {
    setServices(
      services.map((s) => (s.id === editedService.id ? editedService : s))
    );
    editModal.closeModal();
  };


  useEffect(() => {
    if (selectedService) {
      setEditedService({ ...selectedService });
    }
  }, [selectedService]);

  return (
    <div className="min-h-screen container mx-auto mt-30 md:mt-15">
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <Link
            to='/add-services'
            className="px-4 py-2 bg-[#C8C1F5] rounded-full hover:shadow-lg cursor-pointer"
          >
            Create New Services
          </Link>
        </div>
        {/* Tabs */}
        <div className="flex space-x-8 mb-6">
          <button
            onClick={() => setActiveTab("Active")}
            className={`pb-2 font-medium ${
              activeTab === "Active"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`pb-2 font-medium ${
              activeTab === "Pending"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("Suspended")}
            className={`pb-2 font-medium ${
              activeTab === "Suspended"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Suspended ({suspendedCount})
          </button>
        </div>
        {/* Services Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-base-300 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-4">Service</div>
            <div className="col-span-2 text-center">Order ({totalOrders})</div>
            <div className="col-span-2 text-center">Available Time</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                {/* Service Column */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded opacity-20"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {service.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <div className="w-4 h-4 mr-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {service.location}
                    </div>
                  </div>
                </div>

                {/* Order Column */}
                <div className="col-span-2 text-center">
                  <span className="text-gray-900">{service.orders}</span>
                </div>

                {/* Available Time Column */}
                <div className="col-span-2 text-center">
                  <span className="text-gray-600">{service.time}</span>
                </div>

                {/* Price Column */}
                <div className="col-span-2 text-center">
                  <span className="text-gray-900">{service.price}</span>
                </div>

                {/* Action Column */}
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        editModal.openModal();
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        deleteModal.openModal();
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredServices.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No {activeTab.toLowerCase()} services found
              </div>
            )}
          </div>
        </div>
        {/* Edit Modal */}
        {selectedService && (
          <div
            className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${
              editModal.isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${
                editModal.isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Service
                </h3>
                <button
                  onClick={editModal.closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {editedService && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editedService.title}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editedService.location}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={editedService.time}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={editedService.price}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editedService.status}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={editModal.closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {selectedService && (
          <div
            className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${
              deleteModal.isOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${
                deleteModal.isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Service
                </h3>
                <button
                  onClick={deleteModal.closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete {selectedService.title}? This
                  action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={deleteModal.closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setServices(
                      services.filter((s) => s.id !== selectedService.id)
                    );
                    deleteModal.closeModal();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
