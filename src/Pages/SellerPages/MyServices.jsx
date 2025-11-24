import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, X, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useSellerServices from "../../hooks/useSellerServices";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Modal hook for managing open/close state
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, openModal, closeModal };
};

// Service Row Component
const ServiceRow = ({ service, onEdit, onDelete, onBoost }) => (
  <div className="sm:grid sm:grid-cols-16 sm:gap-2 sm:p-3 sm:items-center sm:hover:bg-gray-50 sm:transition-colors sm:duration-300 flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-3 sm:m-0 sm:shadow-none sm:border-0 sm:bg-transparent transition-all duration-200">
    {/* Service Info (Image, Title, Location) */}
    <div className="sm:col-span-4 flex items-start space-x-3 sm:items-center">
      <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={service.cover_photo}
          alt={service.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-3">
          {service.title}
        </h3>
        <span className="text-sm text-gray-500 block">{service.type}</span>
        <div className="flex items-center text-gray-500 mt-1.5">
          <div className="w-5">
            <svg
            className="w-4 h-4 mr-1.5"
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
          <span className="text-xs sm:text-sm line-clamp-1">
            {service.location}
          </span>
        </div>
      </div>
    </div>

    {/* Active Orders */}
    <div className="sm:col-span-2 mt-4 sm:mt-0 sm:text-center">
      <span className="text-gray-600 text-xs sm:text-sm md:hidden flex font-semibold">
        Service Type
      </span>
      <span className="text-sm text-gray-500 block">{service.type}</span>
    </div>
    {/* Active Orders */}
    <div className="sm:col-span-2 mt-4 sm:mt-0 sm:text-center">
      <span className="text-gray-600 text-xs sm:text-sm md:hidden flex font-semibold">
        Active Orders
      </span>
      <div className="text-gray-600 text-xs sm:text-sm">
        {service.status === "Pending" || service.status === "Declined"
          ? "-"
          : service.active_orders}
      </div>
    </div>

    {/* Completed Orders */}
    <div className="sm:col-span-2 mt-4 sm:mt-0 sm:text-center">
      <span className="text-gray-600 text-xs sm:text-sm md:hidden flex font-semibold">
        Completed Orders
      </span>
      <div className="text-gray-600 text-xs sm:text-sm">
        {service.status === "Pending" || service.status === "Declined"
          ? "-"
          : service.completed_orders}
      </div>
    </div>

    {/* Available Time */}
    <div className="sm:col-span-2 mt-4 sm:mt-0 sm:text-center">
      <span className="text-gray-600 text-xs sm:text-sm md:hidden flex font-semibold">
        Available Time
      </span>
      <div className="text-gray-600 text-xs sm:text-sm">{`${service.time_from}-${service.time_to}`}</div>
    </div>

    {/* Price */}
    <div className="sm:col-span-1 mt-4 sm:mt-0 sm:text-center">
      <span className="text-gray-600 text-xs sm:text-sm md:hidden flex font-semibold">
        Price
      </span>
      <div className="text-gray-600 text-xs sm:text-sm">{service.price}</div>
    </div>

    {/* Actions */}
    <div className="sm:col-span-2 mt-4 sm:mt-0 sm:text-center">
      {service.status === "Declined" ? (
        <p className="text-red-500">Your service is not approved</p>
      ) : (
        <div className="flex items-center justify-start sm:justify-center space-x-3">
          <button
            onClick={() => onEdit(service)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onDelete(service)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
    </div>

    {/* Actions */}
<div className="sm:col-span-1 mt-4 sm:mt-0 sm:text-center">
  {service.status === "Active" ? (
    <div className="flex items-center justify-start sm:justify-center space-x-3">

      {/* Boost off → show Boost button */}
      {!(service?.is_boosted === false) ? (
        <button
          onClick={() => onBoost(service)}
          className="py-1 px-3 text-white bg-purple-500 rounded-full cursor-pointer"
        >
          Boost
        </button>
      ) : (
        /* Boost on → show Boosting Running */
        <button
          className="py-1 px-3 text-white bg-green-500 rounded-full cursor-default"
        >
          Boosted
        </button>
      )}

    </div>
  ) : null}
</div>



  </div>
);

ServiceRow.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    active_orders: PropTypes.number.isRequired,
    completed_orders: PropTypes.number.isRequired,
    time_from: PropTypes.string.isRequired,
    time_to: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    cover_photo: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onBoost: PropTypes.func.isRequired,
};

// Additional Item Component
const AdditionalItem = ({
  additional,
  index,
  onChange,
  onImageChange,
  onDelete,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="border border-gray-200 p-4 rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800 text-sm">
          Additional Service {index + 1}
        </h4>
        <button
          onClick={() => onDelete(index)}
          className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={additional.title}
          onChange={(e) => onChange(index, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={additional.description}
          onChange={(e) => onChange(index, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm h-20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="text"
          name="price"
          value={additional.price}
          onChange={(e) => onChange(index, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <div className="relative inline-block">
          <img
            src={additional.image}
            alt="Additional Image"
            className="w-48 h-32 object-cover rounded-lg"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-white"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={(e) => onImageChange(index, e.target.files[0])}
        />
      </div>
    </div>
  );
};

AdditionalItem.propTypes = {
  additional: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Benefit Item Component
const BenefitItem = ({ benefit, index, onChange, onDelete }) => (
  <div className="border border-gray-200 p-4 rounded-md space-y-3">
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-gray-800 text-sm">Benefit {index + 1}</h4>
      <button
        onClick={() => onDelete(index)}
        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Title
      </label>
      <input
        type="text"
        name="title"
        value={benefit.title}
        onChange={(e) => onChange(index, e)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        name="description"
        value={benefit.description}
        onChange={(e) => onChange(index, e)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm h-20"
      />
    </div>
  </div>
);

BenefitItem.propTypes = {
  benefit: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Edit Modal Component
const EditModal = ({
  isOpen,
  closeModal,
  service,
  onSave,
  onChange,
  coverPreview,
  setCoverPreview,
  setNewVideo,
  setNewCoverPhoto,
  videoPreview,
  setVideoPreview,
  updatedPortfolio,
  setUpdatedPortfolio,
  updatedBenefits,
  updatedAdditionals,
  handleAdditionalChange,
  handleAdditionalImageChange,
  handleAdditionalDelete,
  handleBenefitChange,
  handleBenefitDelete,
}) => {
  const coverFileInput = useRef(null);
  const videoFileInput = useRef(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef();

  const MapClickHandler = ({ onClick }) => {
    useMapEvents({
      click: (e) => onClick(e.latlng),
    });
    return null;
  };

  const handleMapClick = async (latlng) => {
    const { lat, lng } = latlng;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || "";
      const place_id = data.place_id || "";
      onChange({ target: { name: "latitude", value: lat } });
      onChange({ target: { name: "longitude", value: lng } });
      onChange({ target: { name: "location", value: address } });
      onChange({ target: { name: "place_id", value: place_id } });
      setShowMapModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Geocode Error",
        text: "Failed to get location details.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (mapRef.current) {
          mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 13);
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "No Results",
          text: "No location found for the search query.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Search Error",
        text: "Failed to search location.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  // const addNewAdditional = () => {
  //   setUpdatedAdditionals((prev) => [
  //     ...prev,
  //     {
  //       title: "",
  //       description: "",
  //       price: "$0.00",
  //       image: "https://via.placeholder.com/150",
  //       newImage: null,
  //     },
  //   ]);
  // };

  // const addNewBenefit = () => {
  //   setUpdatedBenefits((prev) => [
  //     ...prev,
  //     {
  //       title: "",
  //       description: "",
  //     },
  //   ]);
  // };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-2 transform transition-all duration-300 ease-in-out border border-gray-100 shadow-lg overflow-y-auto max-h-[90vh] ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Edit Service
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {service && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="text-sm text-gray-600">{service.category.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={service.type}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
              >
                <option value="Service">Service</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={service.title}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={service.description}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="location"
                  value={service.location}
                  onChange={onChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
                  placeholder="Select location from map"
                  disabled
                />
                <button
                  onClick={() => setShowMapModal(true)}
                  className="px-4 py-2 bg-indigo-100 text-blue-600 rounded-md hover:bg-indigo-200 transition-colors duration-200 font-semibold text-sm"
                >
                  Select on Map
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place ID
              </label>
              <input
                type="text"
                name="place_id"
                value={service.place_id}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={service.latitude}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={service.longitude}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time From
                </label>
                <input
                  type="time"
                  name="time_from"
                  value={service.time_from}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time To
                </label>
                <input
                  type="time"
                  name="time_to"
                  value={service.time_to}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={service.price}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={service.status}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
              </label>
              <div className="relative inline-block">
                <img
                  src={coverPreview}
                  alt="Cover Photo"
                  className="w-48 h-32 object-cover rounded-lg"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => coverFileInput.current.click()}
                    className="text-white"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={coverFileInput}
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewCoverPhoto(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overview Video
              </label>
              <div className="relative inline-block">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="w-64 h-36 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-36 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-sm text-gray-500">No video</p>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => videoFileInput.current.click()}
                    className="text-white"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={videoFileInput}
                hidden
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewVideo(file);
                    setVideoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Photos
              </label>
              <div className="grid grid-cols-4 gap-4">
                {updatedPortfolio.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.image}
                      alt="Portfolio"
                      className="h-24 w-full object-cover rounded"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUpdatedPortfolio((prev) =>
                          prev.filter((p) => p.id !== photo.id)
                        )
                      }
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add New Portfolio Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewPortfolioFiles([...e.target.files])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Services
              </label>
              <div className="space-y-4">
                {updatedAdditionals.map((additional, index) => (
                  <AdditionalItem
                    key={index}
                    additional={additional}
                    index={index}
                    onChange={handleAdditionalChange}
                    onImageChange={handleAdditionalImageChange}
                    onDelete={handleAdditionalDelete}
                  />
                ))}
              </div>
              {/* <button
                onClick={addNewAdditional}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
              >
                Add New Additional Service
              </button> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <div className="space-y-4">
                {updatedBenefits.map((benefit, index) => (
                  <BenefitItem
                    key={index}
                    benefit={benefit}
                    index={index}
                    onChange={handleBenefitChange}
                    onDelete={handleBenefitDelete}
                  />
                ))}
              </div>
              {/* <button
                onClick={addNewBenefit}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
              >
                Add New Benefit
              </button> */}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Select Location on Map
            </h3>
            <div className="flex mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            <MapContainer
              ref={mapRef}
              center={[service.latitude || 0, service.longitude || 0]}
              zoom={service.latitude ? 13 : 2}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler onClick={handleMapClick} />
            </MapContainer>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowMapModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.object,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    place_id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    time_from: PropTypes.string,
    time_to: PropTypes.string,
    price: PropTypes.string,
    status: PropTypes.string,
    cover_photo: PropTypes.string,
    overview_video: PropTypes.string,
    portfolio_photos: PropTypes.array,
    additionals: PropTypes.array,
    benefits: PropTypes.array,
  }),
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  coverPreview: PropTypes.string.isRequired,
  setCoverPreview: PropTypes.func.isRequired,
  newCoverPhoto: PropTypes.any,
  setNewCoverPhoto: PropTypes.func.isRequired,
  videoPreview: PropTypes.string.isRequired,
  setVideoPreview: PropTypes.func.isRequired,
  newVideo: PropTypes.any,
  setNewVideo: PropTypes.func.isRequired,
  updatedPortfolio: PropTypes.array.isRequired,
  setUpdatedPortfolio: PropTypes.func.isRequired,
  newPortfolioFiles: PropTypes.array.isRequired,
  setNewPortfolioFiles: PropTypes.func.isRequired,
  updatedAdditionals: PropTypes.array.isRequired,
  setUpdatedAdditionals: PropTypes.func.isRequired,
  updatedBenefits: PropTypes.array.isRequired,
  setUpdatedBenefits: PropTypes.func.isRequired,
  handleAdditionalChange: PropTypes.func.isRequired,
  handleAdditionalImageChange: PropTypes.func.isRequired,
  handleAdditionalDelete: PropTypes.func.isRequired,
  handleBenefitChange: PropTypes.func.isRequired,
  handleBenefitDelete: PropTypes.func.isRequired,
};

// Delete Modal Component
const DeleteModal = ({ isOpen, closeModal, service, onDelete }) => (
  <div
    className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div
      className={`bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2 transform transition-all duration-300 ease-in-out border border-gray-100 shadow-lg ${
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Delete Service
        </h3>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete {service?.title}? This action cannot
          be undone.
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
        >
          Delete Service
        </button>
      </div>
    </div>
  </div>
);

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};

// Tabs Component
const Tabs = ({ activeTab, setActiveTab, setCurrentPage, counts }) => (
  <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 border-b border-gray-200">
    {[
      { label: `Active (${counts.active})`, value: "Active" },
      { label: `Pending (${counts.pending})`, value: "Pending" },
      { label: `Suspended (${counts.suspended})`, value: "Suspended" },
      { label: `Declined (${counts.declined})`, value: "Declined" },
    ].map((tab) => (
      <button
        key={tab.value}
        onClick={() => {
          setActiveTab(tab.value);
          setCurrentPage(1);
        }}
        className={`pb-2 font-medium text-xs sm:text-sm ${
          activeTab === tab.value
            ? "text-purple-600 border-b-2 border-purple-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    active: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    suspended: PropTypes.number.isRequired,
    declined: PropTypes.number.isRequired,
  }).isRequired,
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-purple-100 transition-colors duration-200 text-xs sm:text-sm"
    >
      &lt;
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
          currentPage === page
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-purple-100"
        }`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 py-1 h-9 w-9 sm:px-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-purple-100 transition-colors duration-200 text-xs sm:text-sm"
    >
      &gt;
    </button>
  </div>
);

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Main Component
export default function MyServices() {
  const { service: serviceData, loading, refetch } = useSellerServices();
  console.log(serviceData);
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedService, setSelectedService] = useState(null);
  const [editedService, setEditedService] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coverPreview, setCoverPreview] = useState("");
  const [newCoverPhoto, setNewCoverPhoto] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [newVideo, setNewVideo] = useState(null);
  const [updatedPortfolio, setUpdatedPortfolio] = useState([]);
  const [newPortfolioFiles, setNewPortfolioFiles] = useState([]);
  const [updatedAdditionals, setUpdatedAdditionals] = useState([]);
  const [updatedBenefits, setUpdatedBenefits] = useState([]);
  const [services, setServices] = useState([]);
  const itemsPerPage = 10;
  const editModal = useModal();
  const deleteModal = useModal();
  const navigate = useNavigate();

  // Sync local services with serviceData
  useEffect(() => {
    if (Array.isArray(serviceData)) {
      setServices(
        serviceData.map((s) => ({
          id: s.id,
          category: s.category,
          type: s.service_type,
          title: s.title,
          description: s.description,
          location: s.location,
          place_id: s.place_id,
          latitude: s.latitude,
          longitude: s.longitude,
          time_from: s.time_from.slice(0, 5),
          time_to: s.time_to.slice(0, 5),
          cover_photo: s.cover_photo || "https://via.placeholder.com/150",
          overview_video: s.overview_video || "",
          price: `$${parseFloat(s.price).toFixed(2)}`,
          status: s.status === "Approved" ? "Active" : s.status,
          portfolio_photos: s.portfolio_photos || [],
          active_orders: s.active_orders || 0,
          completed_orders: s.completed_orders || 0,
        }))
      );
    } else {
      setServices([]);
    }
  }, [serviceData]);

  // Filter services and compute counts
  const filteredServices = services.filter((s) => s.status === activeTab);
  const counts = {
    active: services.filter((s) => s.status === "Active").length,
    pending: services.filter((s) => s.status === "Pending").length,
    suspended: services.filter((s) => s.status === "Suspended").length,
    declined: services.filter((s) => s.status === "Declined").length,
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = async (service) => {
    try {
      const response = await apiClient.get(`/service/retrieve/${service.id}`);
      const fullService = response.data;
      setSelectedService({
        ...fullService,
        type: fullService.service_type,
        time_from: fullService.time_from.slice(0, 5),
        time_to: fullService.time_to.slice(0, 5),
        price: `$${parseFloat(fullService.price).toFixed(2)}`,
        status:
          fullService.status === "Approved" ? "Active" : fullService.status,
        additionals: fullService.additionals
          ? fullService.additionals.map((a) => ({
              ...a,
              price: `$${parseFloat(a.price).toFixed(2)}`,
            }))
          : [],
        benefits: fullService.benefits || [],
      });
      editModal.openModal();
    } catch (error) {
      setErrorMessage("Failed to fetch service details.");
      console.error(error);
    }
  };

  // Handle main edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  // Handle additional changes
  const handleAdditionalChange = (index, e) => {
    const { name, value } = e.target;
    setUpdatedAdditionals((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleAdditionalImageChange = (index, file) => {
    if (file) {
      setUpdatedAdditionals((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, newImage: file, image: URL.createObjectURL(file) }
            : item
        )
      );
    }
  };

  const handleAdditionalDelete = (index) => {
    setUpdatedAdditionals((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle benefit changes
  const handleBenefitChange = (index, e) => {
    const { name, value } = e.target;
    setUpdatedBenefits((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleBenefitDelete = (index) => {
    setUpdatedBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle save edit with API call and refresh local services
  const handleSaveEdit = async () => {
    if (!editedService) return;
    try {
      const formData = new FormData();
      formData.append("type", editedService.type);
      formData.append("category", editedService.category.id);
      formData.append("title", editedService.title);
      formData.append("description", editedService.description);
      formData.append("location", editedService.location);
      formData.append("place_id", editedService.place_id);
      formData.append("latitude", editedService.latitude);
      formData.append("longitude", editedService.longitude);
      formData.append("time_from", `${editedService.time_from}:00`);
      formData.append("time_to", `${editedService.time_to}:00`);
      formData.append(
        "price",
        parseFloat(editedService.price.replace("$", ""))
      );
      formData.append(
        "status",
        editedService.status === "Active" ? "Approved" : editedService.status
      );

      if (newCoverPhoto) formData.append("cover_photo", newCoverPhoto);
      if (newVideo) formData.append("overview_video", newVideo);

      // Portfolio
      const deletedPortfolioIds = selectedService.portfolio_photos
        .filter((p) => !updatedPortfolio.some((up) => up.id === p.id))
        .map((p) => p.id)
        .join(",");
      if (deletedPortfolioIds)
        formData.append("deleted_portfolio_ids", deletedPortfolioIds);

      newPortfolioFiles.forEach((file) => {
        formData.append("portfolio_photos[]", file);
      });

      // Additionals
      let deletedAdditionalIds = selectedService.additionals
        .filter((p) => !updatedAdditionals.some((up) => up.id === p.id))
        .map((p) => p.id);

      const emptyExistingAdditionals = updatedAdditionals
        .filter((add) => add.id && add.title.trim() === "")
        .map((add) => add.id);

      deletedAdditionalIds = [
        ...new Set([...deletedAdditionalIds, ...emptyExistingAdditionals]),
      ];

      const filteredAdditionals = updatedAdditionals.filter(
        (add) => add.title.trim() !== ""
      );

      if (deletedAdditionalIds.length)
        formData.append(
          "deleted_additional_ids",
          deletedAdditionalIds.join(",")
        );

      filteredAdditionals.forEach((add, index) => {
        if (add.id) formData.append(`additionals[${index}].id`, add.id);
        formData.append(`additionals[${index}].title`, add.title);
        formData.append(`additionals[${index}].description`, add.description);
        formData.append(
          `additionals[${index}].price`,
          parseFloat(add.price.replace("$", "")) || 0
        );
        if (add.newImage)
          formData.append(`additionals[${index}].image`, add.newImage);
      });

      // Benefits
      let deletedBenefitIds = selectedService.benefits
        .filter((p) => !updatedBenefits.some((up) => up.id === p.id))
        .map((p) => p.id);

      const emptyExistingBenefits = updatedBenefits
        .filter((ben) => ben.id && ben.title.trim() === "")
        .map((ben) => ben.id);

      deletedBenefitIds = [
        ...new Set([...deletedBenefitIds, ...emptyExistingBenefits]),
      ];

      const filteredBenefits = updatedBenefits.filter(
        (ben) => ben.title.trim() !== ""
      );

      if (deletedBenefitIds.length)
        formData.append("deleted_benefit_ids", deletedBenefitIds.join(","));

      filteredBenefits.forEach((benefit, index) => {
        if (benefit.id) formData.append(`benefits[${index}].id`, benefit.id);
        formData.append(`benefits[${index}].title`, benefit.title);
        formData.append(`benefits[${index}].description`, benefit.description);
      });

      const response = await apiClient.put(
        `/service/update/${editedService.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local services with the new data from response
      const updatedServiceFromApi = response.data;
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.id === updatedServiceFromApi.id
            ? {
                ...s,
                type: updatedServiceFromApi.service_type,
                title: updatedServiceFromApi.title,
                description: updatedServiceFromApi.description,
                location: updatedServiceFromApi.location,
                place_id: updatedServiceFromApi.place_id,
                latitude: updatedServiceFromApi.latitude,
                longitude: updatedServiceFromApi.longitude,
                time_from: updatedServiceFromApi.time_from.slice(0, 5),
                time_to: updatedServiceFromApi.time_to.slice(0, 5),
                cover_photo:
                  updatedServiceFromApi.cover_photo ||
                  "https://via.placeholder.com/150",
                overview_video: updatedServiceFromApi.overview_video || "",
                price: `$${parseFloat(updatedServiceFromApi.price).toFixed(2)}`,
                status:
                  updatedServiceFromApi.status === "Approved"
                    ? "Active"
                    : updatedServiceFromApi.status,
                // Assuming API returns updated portfolio, additionals, benefits, but not updating active/completed here
              }
            : s
        )
      );

      editModal.closeModal();
      setErrorMessage("");
      refetch();
      Swal.fire({
        icon: "success",
        title: "Service updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update service. Please try again."
      );
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  // Handle delete with API call and refresh local services
  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await apiClient.delete(`/service/delete/${selectedService.id}`);
      // Remove from local services
      setServices((prevServices) =>
        prevServices.filter((s) => s.id !== selectedService.id)
      );
      deleteModal.closeModal();
      setErrorMessage("");
      refetch();
      Swal.fire({
        icon: "success",
        title: "Service deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete service. Please try again."
      );
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  const handleBoost = (service) => {
    navigate(`/boosting/${service.id}`);
  };

  // Sync editedService with selectedService
  useEffect(() => {
    if (selectedService) {
      setEditedService({ ...selectedService });
      setCoverPreview(selectedService.cover_photo);
      setVideoPreview(selectedService.overview_video);
      setNewCoverPhoto(null);
      setNewVideo(null);
      setUpdatedPortfolio(selectedService.portfolio_photos);
      setNewPortfolioFiles([]);
      setUpdatedAdditionals(
        selectedService.additionals?.map((a) => ({ ...a, newImage: null })) ?? []
      );
      setUpdatedBenefits(
        selectedService.benefits?.map((b) => ({ ...b })) ?? []
      );
    }
  }, [selectedService]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div>
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            My Services
          </h1>
          <Link
            to="/create-service"
            className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors duration-300 text-xs sm:text-sm font-medium"
          >
            + Create New Service
          </Link>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Tabs */}
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
          counts={counts}
        />

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-md sm:bg-transparent sm:shadow-none sm:border-0">
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-16 sm:gap-2 sm:p-3 sm:border-b sm:border-gray-100 sm:bg-gray-50 sm:text-sm sm:font-semibold sm:text-gray-600">
            <div className="sm:col-span-4">Service</div>
            <div className="sm:col-span-2 sm:text-center">Service Type</div>
            <div className="sm:col-span-2 sm:text-center">Active Orders</div>
            <div className="sm:col-span-2 sm:text-center">Completed Orders</div>
            <div className="sm:col-span-2 sm:text-center">Available Time</div>
            <div className="sm:col-span-1 sm:text-center">Price</div>
            <div className="sm:col-span-2 sm:text-center">Action</div>
            <div className="sm:col-span-1 sm:text-center">Boost</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 sm:divide-y-0">
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  onEdit={() => handleEdit(service)}
                  onDelete={(s) => {
                    setSelectedService(s);
                    deleteModal.openModal();
                  }}
                  onBoost={handleBoost}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No {activeTab.toLowerCase()} services found
              </div>
            )}
          </div>
        </div>

        {/* Pagination (shown if filteredServices.length > 10) */}
        {filteredServices.length > 10 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Modals */}
        <EditModal
          isOpen={editModal.isOpen}
          closeModal={editModal.closeModal}
          service={editedService}
          onSave={handleSaveEdit}
          onChange={handleEditChange}
          coverPreview={coverPreview}
          setCoverPreview={setCoverPreview}
          newCoverPhoto={newCoverPhoto}
          setNewCoverPhoto={setNewCoverPhoto}
          videoPreview={videoPreview}
          setVideoPreview={setVideoPreview}
          newVideo={newVideo}
          setNewVideo={setNewVideo}
          updatedPortfolio={updatedPortfolio}
          setUpdatedPortfolio={setUpdatedPortfolio}
          newPortfolioFiles={newPortfolioFiles}
          setNewPortfolioFiles={setNewPortfolioFiles}
          updatedAdditionals={updatedAdditionals}
          setUpdatedAdditionals={setUpdatedAdditionals}
          updatedBenefits={updatedBenefits}
          setUpdatedBenefits={setUpdatedBenefits}
          handleAdditionalChange={handleAdditionalChange}
          handleAdditionalImageChange={handleAdditionalImageChange}
          handleAdditionalDelete={handleAdditionalDelete}
          handleBenefitChange={handleBenefitChange}
          handleBenefitDelete={handleBenefitDelete}
        />
        <DeleteModal
          isOpen={deleteModal.isOpen}
          closeModal={deleteModal.closeModal}
          service={selectedService}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}