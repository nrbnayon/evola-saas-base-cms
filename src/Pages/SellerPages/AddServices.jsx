import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../lib/api-client";
import useCategoriesData from "../../hooks/useCategoriesData";
import { X } from "lucide-react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AddServices = () => {
  const { categories } = useCategoriesData();
  console.log(categories);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    category: "",
    place_id: "",
    latitude: "",
    longitude: "",
    price: "",
    timeFrom: "",
    timeTo: "",
    location: "",
  });
  const [coverFile, setCoverFile] = useState(null); // Store cover image file
  const [videoFile, setVideoFile] = useState(null); // Store video file
  const [portfolioFiles, setPortfolioFiles] = useState([]); // Store portfolio image files
  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null); // Ref for video input
  const portfolioInputRef = useRef(null);
  const [additionals, setAdditionals] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [showAdditionalModal, setShowAdditionalModal] = useState(false);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [newAdditional, setNewAdditional] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [newBenefit, setNewBenefit] = useState({ title: "", description: "" });
  const additionalImageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverFile(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handlePortfolioUpload = (e) => {
    const file = e.target.files[0];
    if (file && portfolioFiles.length < 5) {
      setPortfolioFiles((prev) => [...prev, file]);
    }
  };

  const handleRemovePortfolio = (indexToRemove) => {
    setPortfolioFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setNewAdditional((prev) => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (e) => {
    const { name, value } = e.target;
    setNewBenefit((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewAdditional((prev) => ({ ...prev, image: file }));
  };

  const handleRemoveAdditionalImage = () => {
    setNewAdditional((prev) => ({ ...prev, image: null }));
  };

  const addAdditional = () => {
    if (
      typeof newAdditional.title !== "string" ||
      !newAdditional.title.trim() ||
      typeof newAdditional.description !== "string" ||
      !newAdditional.description.trim() ||
      typeof newAdditional.price !== "string" ||
      !newAdditional.price.trim() ||
      !(newAdditional.image instanceof File)
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields (Title, Description, Price, and Image) must be valid for Additional Service.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    console.log("Adding additional:", newAdditional);
    setAdditionals((prev) => [...prev, { ...newAdditional, id: Date.now() }]);
    setNewAdditional({ title: "", description: "", price: "", image: null });
    setShowAdditionalModal(false);
  };

  const addBenefit = () => {
    if (
      typeof newBenefit.title !== "string" ||
      !newBenefit.title.trim() ||
      typeof newBenefit.description !== "string" ||
      !newBenefit.description.trim()
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields (Title and Description) must be valid for Benefit.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    console.log("Adding benefit:", newBenefit);
    setBenefits((prev) => [...prev, { ...newBenefit, id: Date.now() }]);
    setNewBenefit({ title: "", description: "" });
    setShowBenefitModal(false);
  };

  const removeAdditional = (id) => {
    setAdditionals((prev) => prev.filter((item) => item.id !== id));
  };

  const removeBenefit = (id) => {
    setBenefits((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.type ||
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.place_id ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.price ||
      !formData.timeFrom ||
      !formData.timeTo ||
      !formData.location ||
      !coverFile ||
      !videoFile || // Added video validation
      portfolioFiles.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields (Type, Title, Description, Category, Place ID, Latitude, Longitude, Price, Time From, Time To, Location, Cover Photo, Overview Video, and at least one Portfolio image) are required.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate category is a valid integer
    const categoryId = parseInt(formData.category, 10);
    if (isNaN(categoryId)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Category must be a valid integer ID.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate additionals
    if (
      additionals.some(
        (item) =>
          typeof item.title !== "string" ||
          !item.title.trim() ||
          typeof item.description !== "string" ||
          !item.description.trim() ||
          typeof item.price !== "string" ||
          !item.price.trim() ||
          !(item.image instanceof File)
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields (Title, Description, Price, and Image) must be valid strings for each Additional Service.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate benefits
    if (
      benefits.some(
        (item) =>
          typeof item.title !== "string" ||
          !item.title.trim() ||
          typeof item.description !== "string" ||
          !item.description.trim()
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields (Title and Description) must be valid strings for each Benefit.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("type", formData.type);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", categoryId);
    formDataToSend.append("place_id", formData.place_id);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("time_from", formData.timeFrom);
    formDataToSend.append("time_to", formData.timeTo);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("cover_photo", coverFile);
    formDataToSend.append("overview_video", videoFile); // Add video to FormData
    portfolioFiles.forEach((file) => {
      formDataToSend.append("portfolio_photos", file);
    });

    // Append additionals
    additionals.forEach((additional, index) => {
      formDataToSend.append(
        `additionals[${index}].title`,
        String(additional.title)
      );
      formDataToSend.append(
        `additionals[${index}].description`,
        String(additional.description)
      );
      formDataToSend.append(
        `additionals[${index}].price`,
        String(additional.price)
      );
      if (additional.image instanceof File) {
        formDataToSend.append(`additionals[${index}].image`, additional.image);
      } else {
        console.warn(
          `Additional ${index} image is not a File object`,
          additional.image
        );
      }
    });

    // Append benefits
    benefits.forEach((benefit, index) => {
      formDataToSend.append(`benefits[${index}].title`, String(benefit.title));
      formDataToSend.append(
        `benefits[${index}].description`,
        String(benefit.description)
      );
    });

    // Debug FormData
    for (let pair of formDataToSend.entries()) {
      console.log(
        pair[0] + ": " + (pair[1] instanceof File ? "File" : pair[1])
      );
    }

    try {
      const response = await apiClient.post("/service/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        const data = response.data;
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Service created successfully! ID: ${data.id}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        // Clear form
        setFormData({
          type: "",
          title: "",
          description: "",
          category: "",
          place_id: "",
          latitude: "",
          longitude: "",
          price: "",
          timeFrom: "",
          timeTo: "",
          location: "",
        });
        setCoverFile(null);
        setVideoFile(null); // Clear video
        setPortfolioFiles([]);
        setAdditionals([]);
        setBenefits([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create service. Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        location: address,
        place_id: place_id,
      }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto p-6 sm:p-8 transform transition-all duration-300">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/my-services"
              className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Your Service or Event
            </h2>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
              placeholder="Enter your title"
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="service">Service</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
              placeholder="Enter your title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
              placeholder="I will provide..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                placeholder="Select location from map"
                disabled
                required
              />
              <button
                onClick={() => setShowMapModal(true)}
                className="px-4 py-3 bg-indigo-100 text-blue-600 rounded-lg hover:bg-indigo-200 transition-colors duration-200 font-semibold"
              >
                Select on Map
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
              placeholder="$150.00"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time From *
              </label>
              <input
                type="time"
                name="timeFrom"
                value={formData.timeFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                placeholder="14:30:00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time To *
              </label>
              <input
                type="time"
                name="timeTo"
                value={formData.timeTo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                placeholder="20:00:00"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-7">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Photo *
              </label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
                onClick={() => coverInputRef.current.click()}
              >
                {coverFile ? (
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover"
                    className="max-w-full max-h-40 mx-auto object-contain rounded"
                  />
                ) : (
                  <p className="text-gray-500 py-14">
                    Click to upload cover image
                  </p>
                )}
                <input
                  type="file"
                  ref={coverInputRef}
                  hidden
                  onChange={handleCoverUpload}
                  accept="image/*"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Overview Video(optional)
              </label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
                onClick={() => videoInputRef.current.click()}
              >
                {videoFile ? (
                  <video
                    src={URL.createObjectURL(videoFile)}
                    controls
                    className="max-w-full max-h-40 mx-auto object-contain rounded"
                  />
                ) : (
                  <p className="text-gray-500 p-14">
                    Click to upload overview video
                  </p>
                )}
                <input
                  type="file"
                  ref={videoInputRef}
                  hidden
                  onChange={handleVideoUpload}
                  accept="video/*"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Portfolio (Up to 5 images) *
            </label>
            <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
              {portfolioFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleRemovePortfolio(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {portfolioFiles.length < 5 && (
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
                  onClick={() => portfolioInputRef.current.click()}
                >
                  <p className="text-gray-500 text-3xl">+</p>
                  <p className="text-gray-500"> upload image</p>
                  <input
                    type="file"
                    ref={portfolioInputRef}
                    hidden
                    onChange={handlePortfolioUpload}
                    accept="image/*"
                  />
                </div>
              )}
            </div>
          </div>
          {additionals.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Additional Services
              </h4>
              <div className="space-y-3">
                {additionals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.title}
                    </span>
                    <button
                      onClick={() => removeAdditional(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {benefits.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Benefits
              </h4>
              <div className="space-y-3">
                {benefits.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.title}
                    </span>
                    <button
                      onClick={() => removeBenefit(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
  {/* Left Side Buttons */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
    <button
      onClick={() => setShowAdditionalModal(true)}
      className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-100 text-blue-600 rounded-full hover:bg-indigo-200 border border-indigo-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
    >
      + Add Additional
    </button>
    <button
      onClick={() => setShowBenefitModal(true)}
      className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 border border-green-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
    >
      + Add Benefit
    </button>
  </div>

  {/* Submit Button */}
  <button
    onClick={async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await handleSubmit();
      } finally {
        setIsSubmitting(false);
      }
    }}
    disabled={isSubmitting}
    className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#c8c1f5] text-gray-600 rounded-full hover:bg-[#beb6f5] transition-colors duration-200 font-semibold text-sm sm:text-base ${
      isSubmitting ? "opacity-60 cursor-not-allowed" : ""
    }`}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </button>
</div>

        </div>
      </div>

      {showAdditionalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add Additional Service
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={newAdditional.title}
                onChange={handleAdditionalChange}
                placeholder="Title *"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                required
              />
              <textarea
                name="description"
                value={newAdditional.description}
                onChange={handleAdditionalChange}
                placeholder="Description *"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                required
              />
              <input
                type="number"
                name="price"
                value={newAdditional.price}
                onChange={handleAdditionalChange}
                placeholder="Price *"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                required
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image *
                </label>
                <div
                  className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
                  onClick={() => additionalImageRef.current.click()}
                >
                  {newAdditional.image ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(newAdditional.image)}
                        alt="Additional"
                        className="max-w-full max-h-40 mx-auto object-contain rounded"
                      />
                      <button
                        onClick={handleRemoveAdditionalImage}
                        className="absolute top-2 right-2 bg-red-500 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Click to upload image</p>
                  )}
                  <input
                    type="file"
                    ref={additionalImageRef}
                    hidden
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setShowAdditionalModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 "
              >
                Cancel
              </button>
              <button
                onClick={addAdditional}
                className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200 "
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showBenefitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Benefit
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={newBenefit.title}
                onChange={handleBenefitChange}
                placeholder="Title *"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                required
              />
              <textarea
                name="description"
                value={newBenefit.description}
                onChange={handleBenefitChange}
                placeholder="Description *"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                required
              />
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setShowBenefitModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addBenefit}
                className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

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
              center={[0, 0]}
              zoom={2}
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

export default AddServices;




// import { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import apiClient from "../../lib/api-client";
// import useCategoriesData from "../../hooks/useCategoriesData";
// import { X } from "lucide-react";

// const AddServices = () => {
//   const { categories } = useCategoriesData();
//   console.log(categories);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     place_id: "",
//     latitude: "",
//     longitude: "",
//     price: "",
//     timeFrom: "",
//     timeTo: "",
//     location: "",
//   });
//   const [coverFile, setCoverFile] = useState(null); // Store cover image file
//   const [videoFile, setVideoFile] = useState(null); // Store video file
//   const [portfolioFiles, setPortfolioFiles] = useState([]); // Store portfolio image files
//   const coverInputRef = useRef(null);
//   const videoInputRef = useRef(null); // Ref for video input
//   const portfolioInputRef = useRef(null);
//   const [additionals, setAdditionals] = useState([]);
//   const [benefits, setBenefits] = useState([]);
//   const [showAdditionalModal, setShowAdditionalModal] = useState(false);
//   const [showBenefitModal, setShowBenefitModal] = useState(false);
//   const [newAdditional, setNewAdditional] = useState({
//     title: "",
//     description: "",
//     price: "",
//     image: null,
//   });
//   const [newBenefit, setNewBenefit] = useState({ title: "", description: "" });
//   const additionalImageRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCoverUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setCoverFile(file);
//   };

//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setVideoFile(file);
//   };

//   const handlePortfolioUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && portfolioFiles.length < 5) {
//       setPortfolioFiles((prev) => [...prev, file]);
//     }
//   };

//   const handleRemovePortfolio = (indexToRemove) => {
//     setPortfolioFiles((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   const handleAdditionalChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdditional((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBenefitChange = (e) => {
//     const { name, value } = e.target;
//     setNewBenefit((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAdditionalImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setNewAdditional((prev) => ({ ...prev, image: file }));
//   };

//   const handleRemoveAdditionalImage = () => {
//     setNewAdditional((prev) => ({ ...prev, image: null }));
//   };

//   const addAdditional = () => {
//     if (
//       typeof newAdditional.title !== "string" ||
//       !newAdditional.title.trim() ||
//       typeof newAdditional.description !== "string" ||
//       !newAdditional.description.trim() ||
//       typeof newAdditional.price !== "string" ||
//       !newAdditional.price.trim() ||
//       !(newAdditional.image instanceof File)
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title, Description, Price, and Image) must be valid for Additional Service.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }
//     console.log("Adding additional:", newAdditional);
//     setAdditionals((prev) => [...prev, { ...newAdditional, id: Date.now() }]);
//     setNewAdditional({ title: "", description: "", price: "", image: null });
//     setShowAdditionalModal(false);
//   };

//   const addBenefit = () => {
//     if (
//       typeof newBenefit.title !== "string" ||
//       !newBenefit.title.trim() ||
//       typeof newBenefit.description !== "string" ||
//       !newBenefit.description.trim()
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title and Description) must be valid for Benefit.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }
//     console.log("Adding benefit:", newBenefit);
//     setBenefits((prev) => [...prev, { ...newBenefit, id: Date.now() }]);
//     setNewBenefit({ title: "", description: "" });
//     setShowBenefitModal(false);
//   };

//   const removeAdditional = (id) => {
//     setAdditionals((prev) => prev.filter((item) => item.id !== id));
//   };

//   const removeBenefit = (id) => {
//     setBenefits((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.category ||
//       !formData.place_id ||
//       !formData.latitude ||
//       !formData.longitude ||
//       !formData.price ||
//       !formData.timeFrom ||
//       !formData.timeTo ||
//       !formData.location ||
//       !coverFile ||
//       !videoFile || // Added video validation
//       portfolioFiles.length === 0
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title, Description, Category, Place ID, Latitude, Longitude, Price, Time From, Time To, Location, Cover Photo, Overview Video, and at least one Portfolio image) are required.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate category is a valid integer
//     const categoryId = parseInt(formData.category, 10);
//     if (isNaN(categoryId)) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "Category must be a valid integer ID.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate additionals
//     if (
//       additionals.some(
//         (item) =>
//           typeof item.title !== "string" ||
//           !item.title.trim() ||
//           typeof item.description !== "string" ||
//           !item.description.trim() ||
//           typeof item.price !== "string" ||
//           !item.price.trim() ||
//           !(item.image instanceof File)
//       )
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title, Description, Price, and Image) must be valid strings for each Additional Service.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate benefits
//     if (
//       benefits.some(
//         (item) =>
//           typeof item.title !== "string" ||
//           !item.title.trim() ||
//           typeof item.description !== "string" ||
//           !item.description.trim()
//       )
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title and Description) must be valid strings for each Benefit.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("category", categoryId);
//     formDataToSend.append("place_id", formData.place_id);
//     formDataToSend.append("latitude", formData.latitude);
//     formDataToSend.append("longitude", formData.longitude);
//     formDataToSend.append("price", formData.price);
//     formDataToSend.append("time_from", formData.timeFrom);
//     formDataToSend.append("time_to", formData.timeTo);
//     formDataToSend.append("location", formData.location);
//     formDataToSend.append("cover_photo", coverFile);
//     formDataToSend.append("overview_video", videoFile); // Add video to FormData
//     portfolioFiles.forEach((file) => {
//       formDataToSend.append("portfolio_photos", file);
//     });

//     // Append additionals
//     additionals.forEach((additional, index) => {
//       formDataToSend.append(
//         `additionals[${index}].title`,
//         String(additional.title)
//       );
//       formDataToSend.append(
//         `additionals[${index}].description`,
//         String(additional.description)
//       );
//       formDataToSend.append(
//         `additionals[${index}].price`,
//         String(additional.price)
//       );
//       if (additional.image instanceof File) {
//         formDataToSend.append(`additionals[${index}].image`, additional.image);
//       } else {
//         console.warn(
//           `Additional ${index} image is not a File object`,
//           additional.image
//         );
//       }
//     });

//     // Append benefits
//     benefits.forEach((benefit, index) => {
//       formDataToSend.append(`benefits[${index}].title`, String(benefit.title));
//       formDataToSend.append(
//         `benefits[${index}].description`,
//         String(benefit.description)
//       );
//     });

//     // Debug FormData
//     for (let pair of formDataToSend.entries()) {
//       console.log(
//         pair[0] + ": " + (pair[1] instanceof File ? "File" : pair[1])
//       );
//     }

//     try {
//       const response = await apiClient.post("/service/create", formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       if (response.status === 201) {
//         const data = response.data;
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: `Service created successfully! ID: ${data.id}`,
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         // Clear form
//         setFormData({
//           title: "",
//           description: "",
//           category: "",
//           place_id: "",
//           latitude: "",
//           longitude: "",
//           price: "",
//           timeFrom: "",
//           timeTo: "",
//           location: "",
//         });
//         setCoverFile(null);
//         setVideoFile(null); // Clear video
//         setPortfolioFiles([]);
//         setAdditionals([]);
//         setBenefits([]);
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to create service. Please try again.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       console.error(
//         "API Error:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto p-6 sm:p-8 transform transition-all duration-300">
//         <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
//           <div className="flex items-center gap-4">
//             <Link
//               to="/my-services"
//               className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </Link>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Create Your Service or Event
//             </h2>
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Type *
//             </label>
//             <select
//               name="type"
//               value={formData.type}
//               type="text"
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter your title"
//               required
//             >
//               <option value="" disabled>
//                 Select type
//               </option>
//               <option value="service">Service</option>
//               <option value="event">Event</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter your title"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description *
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="I will provide..."
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Category *
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               required
//             >
//               <option value="" disabled>
//                 Select a category
//               </option>
//               {categories && categories.length > 0 ? (
//                 categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.title}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   No categories available
//                 </option>
//               )}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Place ID *
//             </label>
//             <input
//               type="text"
//               name="place_id"
//               value={formData.place_id}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter place ID"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Latitude *
//               </label>
//               <input
//                 type="number"
//                 name="latitude"
//                 value={formData.latitude}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="Enter latitude"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Longitude *
//               </label>
//               <input
//                 type="number"
//                 name="longitude"
//                 value={formData.longitude}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="Enter longitude"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Price *
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="$150.00"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Time From *
//               </label>
//               <input
//                 type="time"
//                 name="timeFrom"
//                 value={formData.timeFrom}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="14:30:00"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Time To *
//               </label>
//               <input
//                 type="time"
//                 name="timeTo"
//                 value={formData.timeTo}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="20:00:00"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Location *
//             </label>
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter your location"
//               required
//             />
//           </div>
//           <div className="grid md:grid-cols-2 gap-7">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cover Photo *
//               </label>
//               <div
//                 className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 onClick={() => coverInputRef.current.click()}
//               >
//                 {coverFile ? (
//                   <img
//                     src={URL.createObjectURL(coverFile)}
//                     alt="Cover"
//                     className="max-w-full max-h-40 mx-auto object-contain rounded"
//                   />
//                 ) : (
//                   <p className="text-gray-500 py-14">
//                     Click to upload cover image
//                   </p>
//                 )}
//                 <input
//                   type="file"
//                   ref={coverInputRef}
//                   hidden
//                   onChange={handleCoverUpload}
//                   accept="image/*"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Overview Video(optional)
//               </label>
//               <div
//                 className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 onClick={() => videoInputRef.current.click()}
//               >
//                 {videoFile ? (
//                   <video
//                     src={URL.createObjectURL(videoFile)}
//                     controls
//                     className="max-w-full max-h-40 mx-auto object-contain rounded"
//                   />
//                 ) : (
//                   <p className="text-gray-500 p-14">
//                     Click to upload overview video
//                   </p>
//                 )}
//                 <input
//                   type="file"
//                   ref={videoInputRef}
//                   hidden
//                   onChange={handleVideoUpload}
//                   accept="video/*"
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Portfolio (Up to 5 images) *
//             </label>
//             <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {portfolioFiles.map((file, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Portfolio ${index + 1}`}
//                     className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
//                   />
//                   <button
//                     onClick={() => handleRemovePortfolio(index)}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                   >
//                     &times;
//                   </button>
//                 </div>
//               ))}
//               {portfolioFiles.length < 5 && (
//                 <div
//                   className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                   onClick={() => portfolioInputRef.current.click()}
//                 >
//                   <p className="text-gray-500 text-3xl">+</p>
//                   <p className="text-gray-500"> upload image</p>
//                   <input
//                     type="file"
//                     ref={portfolioInputRef}
//                     hidden
//                     onChange={handlePortfolioUpload}
//                     accept="image/*"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           {additionals.length > 0 && (
//             <div className="mt-8">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                 Additional Services
//               </h4>
//               <div className="space-y-3">
//                 {additionals.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <span className="text-sm font-medium text-gray-700">
//                       {item.title}
//                     </span>
//                     <button
//                       onClick={() => removeAdditional(item.id)}
//                       className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                     >
//                       <X/>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {benefits.length > 0 && (
//             <div className="mt-8">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                 Benefits
//               </h4>
//               <div className="space-y-3">
//                 {benefits.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <span className="text-sm font-medium text-gray-700">
//                       {item.title}
//                     </span>
//                     <button
//                       onClick={() => removeBenefit(item.id)}
//                       className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                     >
//                       <X/>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
//   {/* Left Side Buttons */}
//   <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
//     <button
//       onClick={() => setShowAdditionalModal(true)}
//       className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-100 text-blue-600 rounded-full hover:bg-indigo-200 border border-indigo-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
//     >
//       + Add Additional
//     </button>
//     <button
//       onClick={() => setShowBenefitModal(true)}
//       className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 border border-green-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
//     >
//       + Add Benefit
//     </button>
//   </div>

//   {/* Submit Button */}
//   <button
//     onClick={async () => {
//       if (isSubmitting) return;
//       setIsSubmitting(true);
//       try {
//         await handleSubmit();
//       } finally {
//         setIsSubmitting(false);
//       }
//     }}
//     disabled={isSubmitting}
//     className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#c8c1f5] text-gray-600 rounded-full hover:bg-[#beb6f5] transition-colors duration-200 font-semibold text-sm sm:text-base ${
//       isSubmitting ? "opacity-60 cursor-not-allowed" : ""
//     }`}
//   >
//     {isSubmitting ? "Submitting..." : "Submit"}
//   </button>
// </div>

//         </div>
//       </div>

//       {showAdditionalModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Add Additional Service
//             </h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 value={newAdditional.title}
//                 onChange={handleAdditionalChange}
//                 placeholder="Title *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <textarea
//                 name="description"
//                 value={newAdditional.description}
//                 onChange={handleAdditionalChange}
//                 placeholder="Description *"
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 value={newAdditional.price}
//                 onChange={handleAdditionalChange}
//                 placeholder="Price *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Image *
//                 </label>
//                 <div
//                   className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                   onClick={() => additionalImageRef.current.click()}
//                 >
//                   {newAdditional.image ? (
//                     <div className="relative">
//                       <img
//                         src={URL.createObjectURL(newAdditional.image)}
//                         alt="Additional"
//                         className="max-w-full max-h-40 mx-auto object-contain rounded"
//                       />
//                       <button
//                         onClick={handleRemoveAdditionalImage}
//                         className="absolute top-2 right-2 bg-red-500 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">Click to upload image</p>
//                   )}
//                   <input
//                     type="file"
//                     ref={additionalImageRef}
//                     hidden
//                     accept="image/*"
//                     onChange={handleAdditionalImageUpload}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6 gap-4">
//               <button
//                 onClick={() => setShowAdditionalModal(false)}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 "
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addAdditional}
//                 className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200 "
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBenefitModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Add Benefit
//             </h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 value={newBenefit.title}
//                 onChange={handleBenefitChange}
//                 placeholder="Title *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <textarea
//                 name="description"
//                 value={newBenefit.description}
//                 onChange={handleBenefitChange}
//                 placeholder="Description *"
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//             </div>
//             <div className="flex justify-end mt-6 gap-4">
//               <button
//                 onClick={() => setShowBenefitModal(false)}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addBenefit}
//                 className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddServices;



// import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import apiClient from "../../lib/api-client";
// import useCategoriesData from "../../hooks/useCategoriesData";
// import { X } from "lucide-react";

// const AddServices = () => {
//   const { categories } = useCategoriesData();
//   console.log(categories);
//   const [formData, setFormData] = useState({
//     type: "",
//     title: "",
//     description: "",
//     category: "",
//     place_id: "",
//     latitude: "",
//     longitude: "",
//     price: "",
//     timeFrom: "",
//     timeTo: "",
//     location: "",
//   });
//   const [coverFile, setCoverFile] = useState(null); // Store cover image file
//   const [videoFile, setVideoFile] = useState(null); // Store video file
//   const [portfolioFiles, setPortfolioFiles] = useState([]); // Store portfolio image files
//   const coverInputRef = useRef(null);
//   const videoInputRef = useRef(null); // Ref for video input
//   const portfolioInputRef = useRef(null);
//   const [additionals, setAdditionals] = useState([]);
//   const [benefits, setBenefits] = useState([]);
//   const [showAdditionalModal, setShowAdditionalModal] = useState(false);
//   const [showBenefitModal, setShowBenefitModal] = useState(false);
//   const [showMapModal, setShowMapModal] = useState(false);
//   const [newAdditional, setNewAdditional] = useState({
//     title: "",
//     description: "",
//     price: "",
//     image: null,
//   });
//   const [newBenefit, setNewBenefit] = useState({ title: "", description: "" });
//   const additionalImageRef = useRef(null);
//   const locationInputRef = useRef(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (window.google && locationInputRef.current) {
//       const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current);
//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();
//         if (place.geometry && place.geometry.location) {
//           setFormData((prev) => ({
//             ...prev,
//             location: place.formatted_address || "",
//             place_id: place.place_id || "",
//             latitude: place.geometry.location.lat() || "",
//             longitude: place.geometry.location.lng() || "",
//           }));
//         }
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (showMapModal && window.google && mapRef.current) {
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: 0, lng: 0 },
//         zoom: 2,
//       });
//       let marker;
//       map.addListener("click", (e) => {
//         if (marker) marker.setMap(null);
//         marker = new window.google.maps.Marker({
//           position: e.latLng,
//           map,
//         });
//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ location: e.latLng }, (results, status) => {
//           if (status === "OK" && results[0]) {
//             setFormData((prev) => ({
//               ...prev,
//               location: results[0].formatted_address,
//               place_id: results[0].place_id || "",
//               latitude: e.latLng.lat(),
//               longitude: e.latLng.lng(),
//             }));
//             setShowMapModal(false); // Auto-close after selection
//           } else {
//             Swal.fire({
//               icon: "error",
//               title: "Geocode Error",
//               text: "Failed to get location details.",
//               toast: true,
//               position: "top-end",
//               showConfirmButton: false,
//               timer: 3000,
//             });
//           }
//         });
//       });
//     }
//   }, [showMapModal]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCoverUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setCoverFile(file);
//   };

//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setVideoFile(file);
//   };

//   const handlePortfolioUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && portfolioFiles.length < 5) {
//       setPortfolioFiles((prev) => [...prev, file]);
//     }
//   };

//   const handleRemovePortfolio = (indexToRemove) => {
//     setPortfolioFiles((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   const handleAdditionalChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdditional((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBenefitChange = (e) => {
//     const { name, value } = e.target;
//     setNewBenefit((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAdditionalImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setNewAdditional((prev) => ({ ...prev, image: file }));
//   };

//   const handleRemoveAdditionalImage = () => {
//     setNewAdditional((prev) => ({ ...prev, image: null }));
//   };

//   const addAdditional = () => {
//     if (
//       typeof newAdditional.title !== "string" ||
//       !newAdditional.title.trim() ||
//       typeof newAdditional.description !== "string" ||
//       !newAdditional.description.trim() ||
//       typeof newAdditional.price !== "string" ||
//       !newAdditional.price.trim() ||
//       !(newAdditional.image instanceof File)
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title, Description, Price, and Image) must be valid for Additional Service.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }
//     console.log("Adding additional:", newAdditional);
//     setAdditionals((prev) => [...prev, { ...newAdditional, id: Date.now() }]);
//     setNewAdditional({ title: "", description: "", price: "", image: null });
//     setShowAdditionalModal(false);
//   };

//   const addBenefit = () => {
//     if (
//       typeof newBenefit.title !== "string" ||
//       !newBenefit.title.trim() ||
//       typeof newBenefit.description !== "string" ||
//       !newBenefit.description.trim()
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title and Description) must be valid for Benefit.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }
//     console.log("Adding benefit:", newBenefit);
//     setBenefits((prev) => [...prev, { ...newBenefit, id: Date.now() }]);
//     setNewBenefit({ title: "", description: "" });
//     setShowBenefitModal(false);
//   };

//   const removeAdditional = (id) => {
//     setAdditionals((prev) => prev.filter((item) => item.id !== id));
//   };

//   const removeBenefit = (id) => {
//     setBenefits((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (
//       !formData.type ||
//       !formData.title ||
//       !formData.description ||
//       !formData.category ||
//       !formData.place_id ||
//       !formData.latitude ||
//       !formData.longitude ||
//       !formData.price ||
//       !formData.timeFrom ||
//       !formData.timeTo ||
//       !formData.location ||
//       !coverFile ||
//       !videoFile || // Added video validation
//       portfolioFiles.length === 0
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Type, Title, Description, Category, Place ID, Latitude, Longitude, Price, Time From, Time To, Location, Cover Photo, Overview Video, and at least one Portfolio image) are required.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate category is a valid integer
//     const categoryId = parseInt(formData.category, 10);
//     if (isNaN(categoryId)) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "Category must be a valid integer ID.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate additionals
//     if (
//       additionals.some(
//         (item) =>
//           typeof item.title !== "string" ||
//           !item.title.trim() ||
//           typeof item.description !== "string" ||
//           !item.description.trim() ||
//           typeof item.price !== "string" ||
//           !item.price.trim() ||
//           !(item.image instanceof File)
//       )
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title, Description, Price, and Image) must be valid strings for each Additional Service.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     // Validate benefits
//     if (
//       benefits.some(
//         (item) =>
//           typeof item.title !== "string" ||
//           !item.title.trim() ||
//           typeof item.description !== "string" ||
//           !item.description.trim()
//       )
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Validation Error",
//         text: "All fields (Title and Description) must be valid strings for each Benefit.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append("type", formData.type);
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("category", categoryId);
//     formDataToSend.append("place_id", formData.place_id);
//     formDataToSend.append("latitude", formData.latitude);
//     formDataToSend.append("longitude", formData.longitude);
//     formDataToSend.append("price", formData.price);
//     formDataToSend.append("time_from", formData.timeFrom);
//     formDataToSend.append("time_to", formData.timeTo);
//     formDataToSend.append("location", formData.location);
//     formDataToSend.append("cover_photo", coverFile);
//     formDataToSend.append("overview_video", videoFile); // Add video to FormData
//     portfolioFiles.forEach((file) => {
//       formDataToSend.append("portfolio_photos", file);
//     });

//     // Append additionals
//     additionals.forEach((additional, index) => {
//       formDataToSend.append(
//         `additionals[${index}].title`,
//         String(additional.title)
//       );
//       formDataToSend.append(
//         `additionals[${index}].description`,
//         String(additional.description)
//       );
//       formDataToSend.append(
//         `additionals[${index}].price`,
//         String(additional.price)
//       );
//       if (additional.image instanceof File) {
//         formDataToSend.append(`additionals[${index}].image`, additional.image);
//       } else {
//         console.warn(
//           `Additional ${index} image is not a File object`,
//           additional.image
//         );
//       }
//     });

//     // Append benefits
//     benefits.forEach((benefit, index) => {
//       formDataToSend.append(`benefits[${index}].title`, String(benefit.title));
//       formDataToSend.append(
//         `benefits[${index}].description`,
//         String(benefit.description)
//       );
//     });

//     // Debug FormData
//     for (let pair of formDataToSend.entries()) {
//       console.log(
//         pair[0] + ": " + (pair[1] instanceof File ? "File" : pair[1])
//       );
//     }

//     try {
//       const response = await apiClient.post("/service/create", formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       if (response.status === 201) {
//         const data = response.data;
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: `Service created successfully! ID: ${data.id}`,
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         // Clear form
//         setFormData({
//           type: "",
//           title: "",
//           description: "",
//           category: "",
//           place_id: "",
//           latitude: "",
//           longitude: "",
//           price: "",
//           timeFrom: "",
//           timeTo: "",
//           location: "",
//         });
//         setCoverFile(null);
//         setVideoFile(null); // Clear video
//         setPortfolioFiles([]);
//         setAdditionals([]);
//         setBenefits([]);
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to create service. Please try again.",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//       });
//       console.error(
//         "API Error:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto p-6 sm:p-8 transform transition-all duration-300">
//         <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
//           <div className="flex items-center gap-4">
//             <Link
//               to="/my-services"
//               className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </Link>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Create Your Service or Event
//             </h2>
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Type *
//             </label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter your title"
//               required
//             >
//               <option value="" disabled>
//                 Select type
//               </option>
//               <option value="service">Service</option>
//               <option value="event">Event</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="Enter your title"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description *
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="I will provide..."
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Category *
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               required
//             >
//               <option value="" disabled>
//                 Select a category
//               </option>
//               {categories && categories.length > 0 ? (
//                 categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.title}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   No categories available
//                 </option>
//               )}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Location *
//             </label>
//             <div className="flex items-center gap-4">
//               <input
//                 type="text"
//                 name="location"
//                 ref={locationInputRef}
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="Search and select location from Google Maps"
//                 required
//               />
//               <button
//                 onClick={() => setShowMapModal(true)}
//                 className="px-4 py-3 bg-indigo-100 text-blue-600 rounded-lg hover:bg-indigo-200 transition-colors duration-200 font-semibold"
//               >
//                 Select on Map
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Price *
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//               placeholder="$150.00"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Time From *
//               </label>
//               <input
//                 type="time"
//                 name="timeFrom"
//                 value={formData.timeFrom}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="14:30:00"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Time To *
//               </label>
//               <input
//                 type="time"
//                 name="timeTo"
//                 value={formData.timeTo}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 placeholder="20:00:00"
//                 required
//               />
//             </div>
//           </div>
//           <div className="grid md:grid-cols-2 gap-7">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cover Photo *
//               </label>
//               <div
//                 className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 onClick={() => coverInputRef.current.click()}
//               >
//                 {coverFile ? (
//                   <img
//                     src={URL.createObjectURL(coverFile)}
//                     alt="Cover"
//                     className="max-w-full max-h-40 mx-auto object-contain rounded"
//                   />
//                 ) : (
//                   <p className="text-gray-500 py-14">
//                     Click to upload cover image
//                   </p>
//                 )}
//                 <input
//                   type="file"
//                   ref={coverInputRef}
//                   hidden
//                   onChange={handleCoverUpload}
//                   accept="image/*"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Overview Video(optional)
//               </label>
//               <div
//                 className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 onClick={() => videoInputRef.current.click()}
//               >
//                 {videoFile ? (
//                   <video
//                     src={URL.createObjectURL(videoFile)}
//                     controls
//                     className="max-w-full max-h-40 mx-auto object-contain rounded"
//                   />
//                 ) : (
//                   <p className="text-gray-500 p-14">
//                     Click to upload overview video
//                   </p>
//                 )}
//                 <input
//                   type="file"
//                   ref={videoInputRef}
//                   hidden
//                   onChange={handleVideoUpload}
//                   accept="video/*"
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Portfolio (Up to 5 images) *
//             </label>
//             <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
//               {portfolioFiles.map((file, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Portfolio ${index + 1}`}
//                     className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
//                   />
//                   <button
//                     onClick={() => handleRemovePortfolio(index)}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                   >
//                     &times;
//                   </button>
//                 </div>
//               ))}
//               {portfolioFiles.length < 5 && (
//                 <div
//                   className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                   onClick={() => portfolioInputRef.current.click()}
//                 >
//                   <p className="text-gray-500 text-3xl">+</p>
//                   <p className="text-gray-500"> upload image</p>
//                   <input
//                     type="file"
//                     ref={portfolioInputRef}
//                     hidden
//                     onChange={handlePortfolioUpload}
//                     accept="image/*"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           {additionals.length > 0 && (
//             <div className="mt-8">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                 Additional Services
//               </h4>
//               <div className="space-y-3">
//                 {additionals.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <span className="text-sm font-medium text-gray-700">
//                       {item.title}
//                     </span>
//                     <button
//                       onClick={() => removeAdditional(item.id)}
//                       className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                     >
//                       <X/>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {benefits.length > 0 && (
//             <div className="mt-8">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                 Benefits
//               </h4>
//               <div className="space-y-3">
//                 {benefits.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <span className="text-sm font-medium text-gray-700">
//                       {item.title}
//                     </span>
//                     <button
//                       onClick={() => removeBenefit(item.id)}
//                       className="text-red-500 hover:text-red-700 transition-colors duration-200"
//                     >
//                       <X/>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
//   {/* Left Side Buttons */}
//   <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
//     <button
//       onClick={() => setShowAdditionalModal(true)}
//       className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-100 text-blue-600 rounded-full hover:bg-indigo-200 border border-indigo-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
//     >
//       + Add Additional
//     </button>
//     <button
//       onClick={() => setShowBenefitModal(true)}
//       className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 border border-green-300 transition-colors duration-200 font-semibold text-sm sm:text-base"
//     >
//       + Add Benefit
//     </button>
//   </div>

//   {/* Submit Button */}
//   <button
//     onClick={async () => {
//       if (isSubmitting) return;
//       setIsSubmitting(true);
//       try {
//         await handleSubmit();
//       } finally {
//         setIsSubmitting(false);
//       }
//     }}
//     disabled={isSubmitting}
//     className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#c8c1f5] text-gray-600 rounded-full hover:bg-[#beb6f5] transition-colors duration-200 font-semibold text-sm sm:text-base ${
//       isSubmitting ? "opacity-60 cursor-not-allowed" : ""
//     }`}
//   >
//     {isSubmitting ? "Submitting..." : "Submit"}
//   </button>
// </div>

//         </div>
//       </div>

//       {showAdditionalModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Add Additional Service
//             </h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 value={newAdditional.title}
//                 onChange={handleAdditionalChange}
//                 placeholder="Title *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <textarea
//                 name="description"
//                 value={newAdditional.description}
//                 onChange={handleAdditionalChange}
//                 placeholder="Description *"
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 value={newAdditional.price}
//                 onChange={handleAdditionalChange}
//                 placeholder="Price *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Image *
//                 </label>
//                 <div
//                   className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                   onClick={() => additionalImageRef.current.click()}
//                 >
//                   {newAdditional.image ? (
//                     <div className="relative">
//                       <img
//                         src={URL.createObjectURL(newAdditional.image)}
//                         alt="Additional"
//                         className="max-w-full max-h-40 mx-auto object-contain rounded"
//                       />
//                       <button
//                         onClick={handleRemoveAdditionalImage}
//                         className="absolute top-2 right-2 bg-red-500 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">Click to upload image</p>
//                   )}
//                   <input
//                     type="file"
//                     ref={additionalImageRef}
//                     hidden
//                     accept="image/*"
//                     onChange={handleAdditionalImageUpload}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6 gap-4">
//               <button
//                 onClick={() => setShowAdditionalModal(false)}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 "
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addAdditional}
//                 className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200 "
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBenefitModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Add Benefit
//             </h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 value={newBenefit.title}
//                 onChange={handleBenefitChange}
//                 placeholder="Title *"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//               <textarea
//                 name="description"
//                 value={newBenefit.description}
//                 onChange={handleBenefitChange}
//                 placeholder="Description *"
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
//                 required
//               />
//             </div>
//             <div className="flex justify-end mt-6 gap-4">
//               <button
//                 onClick={() => setShowBenefitModal(false)}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addBenefit}
//                 className="px-6 py-2 bg-[#c8c1f5] text-gray-700 rounded-full hover:bg-[#b0a8e2] transition-colors duration-200"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showMapModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all duration-300">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Select Location on Map
//             </h3>
//             <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>
//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setShowMapModal(false)}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddServices;





