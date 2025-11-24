import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Play, Heart, CircleCheckBig, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MobileAppSection from "../HomePage/MobileAppSection/MobileAppSection";
import event from "../../assets/videos/event.mp4";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";
import useSavedList from "../../hooks/useSavedList";
import SimilarServices from "./SimilarServices";
import useMe from "../../hooks/useMe";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [selectedAdditionals, setSelectedAdditionals] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const videoRef = useRef(null);
  const {
    savedServices,
    folders,
    loading: saveLoading,
    error: saveError,
    saveServiceToFolder,
    createFolder,
  } = useSavedList();
  const { user } = useMe();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/site/service/details/${id}`);
        setService(response.data);
        console.log(response.data, "service details-------------------");
        setLoading(false);
        // Initialize booking time to the earliest available time
        if (response.data.time_from) {
          const [hours, minutes] = response.data.time_from.split(":");
          const initialTime = new Date();
          initialTime.setHours(hours, minutes, 0);
          setBookingTime(initialTime);
        }
      } catch (err) {
        setError("Failed to fetch service details", err);
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

  const isServiceSaved = (serviceId) => {
    return savedServices.some((saved) => saved.service.id === serviceId);
  };

  const openSaveModal = (serviceId) => {
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

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleAdditionalToggle = (additionalId) => {
    setSelectedAdditionals((prev) =>
      prev.includes(additionalId)
        ? prev.filter((id) => id !== additionalId)
        : [...prev, additionalId]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(service.price) || 0;
    const additionalPrice = service.additionals
      .filter((additional) => selectedAdditionals.includes(additional.id))
      .reduce((sum, additional) => sum + parseFloat(additional.price || 0), 0);
    return (basePrice + additionalPrice).toFixed(2);
  };

  const handleBookNow = () => {
    let eventLocation;
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (service.service_type === "Event") {
      eventLocation = service.location;
    } else {
      eventLocation = userLocation;
      if (!eventLocation.trim()) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Please enter a location",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        return;
      }
    }

    // Format date to YYYY-MM-DD
    const formattedDate = bookingDate.toISOString().split("T")[0];

    // Format time to HH:mm
    const formattedTime = bookingTime
      ? `${bookingTime.getHours().toString().padStart(2, "0")}:${bookingTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "";

    navigate("/order-preview", {
      state: {
        service: {
          id: service.id,
          title: service.title,
          basePrice: service.price,
          coverPhoto: service.cover_photo,
          description: service.description,
        },
        seller: {
          time_from: service.time_from,
          time_to: service.time_to,
        },
        bookingDetails: {
          service_id: service.id,
          additional_service_ids: selectedAdditionals,
          event_time: formattedTime,
          event_date: formattedDate,
          event_location: eventLocation,
          totalPrice: calculateTotalPrice(),
          additionals: service.additionals
            .filter((add) => selectedAdditionals.includes(add.id))
            .map((add) => ({
              id: add.id,
              title: add.title,
              price: add.price,
            })),
        },
      },
    });
  };

  // Restrict time selection to seller's available time range
  const getTimeConstraints = () => {
    if (!service?.time_from || !service?.time_to) return {};
    const [startHours, startMinutes] = service.time_from.split(":");
    const [endHours, endMinutes] = service.time_to.split(":");
    return {
      minTime: new Date().setHours(startHours, startMinutes, 0),
      maxTime: new Date().setHours(endHours, endMinutes, 0),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!service) return <div>No service found</div>;

  console.log(service, "service details");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto ">
        <div className="px-4 py-8">
          {saveError && (
            <div className="text-red-500 text-center mb-4">{saveError}</div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {service.title}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                onClick={() => openSaveModal(service.id)}
              >
                <Heart
                  className={`w-4 h-4 cursor-pointer transition-colors duration-300 ${
                    saveLoading
                      ? "text-gray-400 animate-pulse"
                      : isServiceSaved(service.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
              <div className="lg:col-span-2 rounded-xl overflow-hidden relative group cursor-pointer">
                {!isPlaying && (
                  <img
                    src={
                      service.cover_photo ||
                      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${
                    !isPlaying ? "hidden" : ""
                  }`}
                  controls={isPlaying}
                >
                  <source
                    src={service.overview_video || event}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                {!isPlaying && (
                  <>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                      <button
                        onClick={handlePlayClick}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                      >
                        <Play
                          className="w-6 h-6 text-purple-600 ml-1"
                          fill="currentColor"
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {service.portfolio_photos?.slice(0, 2).map((photo, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={
                          photo.image ||
                          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                        }
                        alt={`${service.title} ${index + 1}`}
                        className="w-full object-cover rounded-lg h-20 sm:h-44"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {service.portfolio_photos?.slice(2, 4).map((photo, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={
                          photo.image ||
                          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                        }
                        alt={`${service.title} ${index + 1}`}
                        className="w-full object-cover rounded-lg h-20 sm:h-44"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-7">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {service.additionals?.length > 0 && (
                <div>
                  <h1 className="text-xl font-semibold mb-4">Additionals</h1>
                  {service.additionals.map((additional) => (
                    <div
                      key={additional.id}
                      className="flex gap-5 items-center mb-4 border border-gray-100 p-3 shadow-md rounded-xl"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAdditionals.includes(additional.id)}
                        onChange={() => handleAdditionalToggle(additional.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div>
                        <img
                          src={additional?.image}
                          className="w-20 h-20  object-cover rounded-lg"
                          alt={additional.title}
                        />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {additional.title}
                        </p>
                        <p>
                          Price:{" "}
                          <span className="font-semibold">
                            ${additional?.price}
                          </span>
                        </p>
                        <p>{additional.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {service.benefits?.length > 0 && (
                <div>
                  <h1 className="text-xl font-semibold mb-4">Benefits</h1>
                  {service.benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="mb-4 border border-gray-200 rounded-xl shadow-md p-4 flex gap-3"
                    >
                      <CircleCheckBig className="text-green-500" />
                      <div>
                        <p className="text-lg font-semibold">{benefit.title}</p>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {service.reviews?.length > 0 && (
                <>
                  <div className="divider"></div>
                  <h2 className="text-xl font-semibold my-6">Reviews</h2>
                  <div className="space-y-6">
                    {service.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 border border-gray-200"
                      >
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    review.user.photo ||
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                                  }
                                  alt={review.user.full_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {review.user.full_name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {service.location}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-600 mb-3">
                                {review.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={
                      service.seller?.photo ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    }
                    alt={service.seller?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      to={`/seller-profile/${service.seller?.id}`}
                      className="font-medium text-gray-900"
                    >
                      {service.seller?.full_name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Available {service.time_from} - {service.time_to}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {service.average_rating}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-md font-bold text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="flex gap-2">
                    <div className="w-5 pt-1"><MapPin height={18} /></div>
                  <p className="text-sm text-gray-700 flex gap-1">
                    {service?.location}
                  </p>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-md font-bold text-gray-700 mb-2">
                    Service Type
                  </label>
                  <p className="text-sm text-gray-700 flex gap-1">
                    {service?.service_type}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ${calculateTotalPrice()}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Base Price: ${service.price}
                    {selectedAdditionals.length > 0 && (
                      <span>
                        {" + Additional: $" +
                          service.additionals
                            .filter((add) =>
                              selectedAdditionals.includes(add.id)
                            )
                            .reduce(
                              (sum, add) => sum + parseFloat(add.price || 0),
                              0
                            )
                            .toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>

                {selectedAdditionals.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Additional Services
                    </h3>
                    <ul className="text-sm text-gray-600">
                      {service.additionals
                        .filter((add) => selectedAdditionals.includes(add.id))
                        .map((add) => (
                          <li key={add.id} className="">
                            • {add.title} (${add.price})
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Select Date
                        </label>
                        <DatePicker
                          selected={bookingDate}
                          onChange={(date) => setBookingDate(date)}
                          dateFormat="MM/dd/yyyy"
                          minDate={new Date()} // Restrict to future dates
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-sm"
                          placeholderText="Select a date"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Select Time
                        </label>
                        <DatePicker
                          selected={bookingTime}
                          onChange={(time) => setBookingTime(time)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          {...getTimeConstraints()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-sm"
                          placeholderText="Select a time"
                        />
                      </div>
                    </div>
                  </div>

                  {service.service_type === "Service" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Location
                      </label>
                      <input
                        type="text"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-sm"
                        placeholder="Enter your location"
                      />
                    </div>
                  )}

                  <div className="w-full">
                    <button
                      onClick={handleBookNow}
                      className="block w-full bg-[#C8C1F5] hover:shadow-md hover:bg-[#b0a6f3] duration-500 text-gray-700 py-3 rounded-lg font-medium transition-colors text-center"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-10">
          <SimilarServices />
        </div>
      </div>

      <MobileAppSection />

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

export default ServiceDetailPage;