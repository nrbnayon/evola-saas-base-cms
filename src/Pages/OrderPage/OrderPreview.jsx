import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import useModal from '../../components/modal/useModal';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";

const OrderPreview = () => {
  const { isOpen: showBookingModal, openModal: openBookingModal, closeModal: closeBookingModal } = useModal();
  const { isOpen: showConfirmModal, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const { service, bookingDetails, seller } = state || {};
  
  // State for booking details
  const [tempBookingDate, setTempBookingDate] = useState(
    bookingDetails?.event_date ? new Date(bookingDetails.event_date) : new Date()
  );
  const [tempBookingTime, setTempBookingTime] = useState(
    bookingDetails?.event_time 
      ? new Date(`1970-01-01T${bookingDetails.event_time}:00`)
      : null
  );
  const [updatedBookingDetails, setUpdatedBookingDetails] = useState(bookingDetails || {});

  // Format date and time for display
  const formattedDate = updatedBookingDetails?.event_date 
    ? new Date(updatedBookingDetails.event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) 
    : 'N/A';
  const formattedTime = updatedBookingDetails?.event_time 
    ? new Date(`1970-01-01T${updatedBookingDetails.event_time}:00`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }) 
    : 'N/A';

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
    // Initialize booking time if not set
    if (!updatedBookingDetails.event_time && seller?.time_from) {
      const [hours, minutes] = seller.time_from.split(":");
      const initialTime = new Date();
      initialTime.setHours(hours, minutes, 0);
      setTempBookingTime(initialTime);
      setUpdatedBookingDetails((prev) => ({ 
        ...prev, 
        event_time: `${hours}:${minutes}` 
      }));
    }
  }, [seller?.time_from, updatedBookingDetails.event_time]);

  const handleBookService = async () => {
    try {
      const payload = {
        service_id: updatedBookingDetails.service_id,
        additional_service_ids: updatedBookingDetails.additional_service_ids || [],
        event_time: updatedBookingDetails.event_time,
        event_date: updatedBookingDetails.event_date,
        event_location: updatedBookingDetails.event_location,
      };

      const response = await apiClient.post('/user/book-service', payload);
      console.log('Booking successful:', response.data);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking successful!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });

      navigate('/orders', { 
        state: { 
          service, 
          bookingDetails: updatedBookingDetails, 
          seller,
        } 
      });
    } catch (error) {
      console.error('Failed to book service:', error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to book service",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
    closeConfirmModal();
  };

  const handleConfirmOrder = () => {
    openConfirmModal();
  };

  const handleSaveBooking = () => {
    // Format date to YYYY-MM-DD
    const formattedDate = tempBookingDate.toISOString().split('T')[0];
    // Format time to HH:mm
    const formattedTime = tempBookingTime
      ? `${tempBookingTime.getHours().toString().padStart(2, '0')}:${tempBookingTime.getMinutes().toString().padStart(2, '0')}`
      : updatedBookingDetails.event_time;

    setUpdatedBookingDetails((prev) => ({
      ...prev,
      event_date: formattedDate,
      event_time: formattedTime,
    }));
    closeBookingModal();
  };

 

  // Restrict time selection to seller's available time range
  const getTimeConstraints = () => {
    if (!seller?.time_from || !seller?.time_to) return {};
    const [startHours, startMinutes] = seller.time_from.split(":");
    const [endHours, endMinutes] = seller.time_to.split(":");
    return {
      minTime: new Date().setHours(startHours, startMinutes, 0),
      maxTime: new Date().setHours(endHours, endMinutes, 0),
    };
  };

  // Fallback if no service data is available
  if (!service || !updatedBookingDetails) {
    return (
      <div className="min-h-screen py-8 container mx-auto">
        <div className="px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Order Preview
          </h1>
          <p className="text-sm sm:text-base text-gray-600">No booking details available. Please return to the service page to make a booking.</p>
        </div>
      </div>
    );
  }


  console.log(updatedBookingDetails);
  return (
    <div className="min-h-screen py-6 sm:py-8 container mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Order Preview
        </h1>

        <div className="">
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-orange-200 to-orange-300 rounded-2xl">
            <img
              src={service.coverPhoto || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
              alt={service.title || "Service image"}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/20 bg-opacity-20 rounded-2xl"></div>
          </div>

          <div className="mt-6 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {service.title}
            </h2>

            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2 sm:mb-3">
                Descriptions
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                  Booking Info
                </h3>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-800">{formattedDate}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{formattedTime}</p>
                    </div>
                    <button
                      className="text-sm text-black bg-gray-200 py-1 sm:py-2 px-3 sm:px-4 rounded-full font-medium hover:bg-gray-300 transition duration-200"
                      onClick={openBookingModal}
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-1">
                        Event Location
                      </h4>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{updatedBookingDetails.event_location || "No location provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                  Price Breakdown
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">{service.title}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-800">${service.basePrice}</span>
                  </div>

                  {updatedBookingDetails.additionals?.map((add) => (
                    <div key={add.id} className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{add.title}</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-800">${add.price}</span>
                    </div>
                  ))}

                  <hr className="border-gray-300 my-3 sm:my-4" />

                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base font-semibold text-gray-800">Total</span>
                    <span className="text-sm sm:text-base font-bold text-gray-800">${updatedBookingDetails.totalPrice}</span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 w-full">
                  <button
                    className="w-full rounded-full bg-gray-800 hover:bg-gray-900 text-white font-medium px-8 sm:px-12 py-2 sm:py-3 hover:shadow-xl transition duration-200 text-sm sm:text-base"
                    onClick={handleConfirmOrder}
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Info Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Change Booking Details</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Select a new date and time for your booking.</p>
            
            <div className="space-y-4 mb-6 sm:mb-8">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Select Date
                </label>
                <DatePicker
                  selected={tempBookingDate}
                  onChange={(date) => setTempBookingDate(date)}
                  dateFormat="MM/dd/yyyy"
                  minDate={new Date()} // Restrict to future dates
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-xs sm:text-sm"
                  placeholderText="Select a date"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Select Time
                </label>
                <DatePicker
                  selected={tempBookingTime}
                  onChange={(time) => setTempBookingTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  {...getTimeConstraints()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-xs sm:text-sm"
                  placeholderText="Select a time"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 sm:space-x-4">
              <button 
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition duration-200 text-xs sm:text-sm"
                onClick={closeBookingModal}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-medium transition duration-200 text-xs sm:text-sm"
                onClick={handleSaveBooking}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Confirm Your Order</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Are you sure you want to confirm this order?</p>
            
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Service:</strong> {service.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Date:</strong> {formattedDate}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Time:</strong> {formattedTime}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Location:</strong> {updatedBookingDetails.event_location || "No location provided"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Total Price:</strong> ${updatedBookingDetails.totalPrice}
              </p>
            </div>
            
            <div className="flex space-x-3 sm:space-x-4">
              <button 
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition duration-200 text-xs sm:text-sm"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-medium transition duration-200 text-xs sm:text-sm"
                onClick={handleBookService}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPreview;