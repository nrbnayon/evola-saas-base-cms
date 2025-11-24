import { Link, useNavigate } from "react-router-dom";
import { RiStarFill } from "react-icons/ri";
import { Heart } from "lucide-react";
import useServicesList from "../../../hooks/useServicesList";
import useSavedList from "../../../hooks/useSavedList";
import Swal from "sweetalert2";
import { useState } from "react";
import useMe from "../../../hooks/useMe";

const PopularServices = () => {
  const { user } = useMe();
  const { services, loading: servicesLoading } = useServicesList([]);
  const {
    savedServices,
    folders,
    loading: saveLoading,
    error: saveError,
    saveServiceToFolder,
    createFolder,
  } = useSavedList();

  console.log(services);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const filteredServices = services.filter((service) => service.service_type === "Service");
  const displayedServices = filteredServices.slice(0, 8);
  const navigate = useNavigate();

  const isServiceSaved = (serviceId) => {
    return savedServices.some((saved) => saved.service.id === serviceId);
  };

  const openSaveModal = (e, serviceId) => {
    e.preventDefault();
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isServiceSaved(serviceId)) {
      Swal.fire({
        icon: "info",
        title: "Already Saved",
        text: "This service is already in your saved list.",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setSelectedServiceId(serviceId);
    setIsModalOpen(true);
  };

  const handleSaveToFolder = async (listTitle) => {
    const success = await saveServiceToFolder(selectedServiceId, listTitle);
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Service added to your list.",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsModalOpen(false);
    }
  };

  const handleCreateAndSave = async () => {
    const { value: folderName } = await Swal.fire({
      title: "Create New List",
      input: "text",
      inputLabel: "List Name",
      inputPlaceholder: "e.g., Photography, Design Ideas",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value?.trim()) return "List name is required!";
      },
    });

    if (folderName) {
      const newFolder = await createFolder(folderName);
      if (newFolder) {
        await handleSaveToFolder(folderName); // Use the title string directly
      }
    }
  };

  if (servicesLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-7 px-4 container mx-auto">
      {saveError && (
        <div className="text-red-500 text-center mb-4">{saveError}</div>
      )}

      <div className="py-5 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-left text-gray-800">
          Popular Services
        </h1>
        <Link
          to="/services"
          className="text-[#1E40AF] underline text-base font-medium hover:text-[#1E3A8A]"
        >
          See All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedServices.map((service) => (
          <Link
            to={`/serviceDetails/${service.id}`}
            key={service.id}
            className="relative border border-gray-200 rounded-xl p-3 bg-white shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur text-black text-sm font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1">
              <RiStarFill className="text-yellow-500" /> {service.average_rating}
            </div>

            <img
              src={service.cover_photo}
              alt={service.title}
              className="w-full h-48 object-cover rounded-lg"
              crossOrigin="anonymous"
            />

            <div className="flex items-center justify-between mt-2 border-b pb-2 border-gray-200">
              <div className="flex items-center gap-2">
                <img
                  src={service?.seller?.photo}
                  className="w-5 h-5 rounded-full object-cover"
                  alt={service.seller.full_name}
                />
                <p className="text-gray-700 font-medium">{service.seller.full_name}</p>
              </div>
            </div>

            <div className="mt-2">
              <p className="font-semibold text-gray-800 line-clamp-2">{service.title}</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-gray-800">${service.price}</span>
              <button
                onClick={(e) => openSaveModal(e, service.id)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    saveLoading
                      ? "text-gray-400 animate-pulse"
                      : isServiceSaved(service.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Save Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Save to List</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleSaveToFolder(folder.title)} // Use title string
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
                    disabled={saveLoading}
                  >
                    <span className="font-medium">{folder.title}</span>
                    {saveLoading && <span className="text-xs text-gray-500">Saving...</span>}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No lists yet. Create one!</p>
              )}
            </div>

            <div className="mt-6 pt-4 ">
              <button
                onClick={handleCreateAndSave}
                className="w-full bg-[#1E40AF] text-white py-2.5 rounded-lg font-medium hover:bg-[#1E3A8A] transition"
                disabled={saveLoading}
              >
                {saveLoading ? "Creating..." : "+ Create New List"}
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-3 w-full text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">Please login first to save this item.</p>
            <button
              onClick={() => navigate("/signin")}
              className="w-full bg-[#1E40AF] text-white py-2.5 rounded-lg font-medium hover:bg-[#1E3A8A] transition"
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="mt-3 w-full text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularServices;