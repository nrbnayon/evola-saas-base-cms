import {
  MessageSquare,
  BookmarkPlus,
  Star,
  ThumbsUp,
  Reply,
  Play,
} from "lucide-react";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import event from "../../assets/videos/event.mp4";
import "react-datepicker/dist/react-datepicker.css";
import MobileAppSection from "../HomePage/MobileAppSection/MobileAppSection";
import ServicesPackages from "../HomePage/ServicesPackages/ServicesPackages";
import { Link } from "react-router-dom";

const ServiceDetailPage = () => {
  const [bookingDate, setBookingDate] = useState(new Date("2025-09-05"));
  const [bookingTime, setBookingTime] = useState(new Date("2025-09-05T09:00"));
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto mt-30 md:mt-15">
        <div className="px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Wedding Photography
            </h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <BookmarkPlus className="w-4 h-4" />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
              <div className="lg:col-span-2 rounded-xl overflow-hidden relative group cursor-pointer">
                {!isPlaying && (
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Wedding photography main"
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
                  <source src={event} type="video/mp4" />
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
                  <div className="rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Wedding decor"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: "180px" }}
                    />
                  </div>

                  <div className="rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Wedding table setup"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: "180px" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Wedding venue"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: "180px" }}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Wedding reception"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: "180px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-7">
            <div className="lg:col-span-2 space-y-8">
              <div className="">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  Capture the magic of your special day with our professional
                  wedding photography services. We focus on every detail to
                  create timeless memories.
                </p>
                <h2 className="text-xl font-semibold my-5">What Included</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• Full-day coverage (up to 8 hours)</li>
                  <li>• High-resolution edited photos</li>
                  <li>• Private online gallery</li>
                  <li>• Optional: Engagement shoot, photo album</li>
                  <li>• Professional lighting and equipment</li>
                </ul>
                <h2 className="text-xl font-semibold my-5">Why Choose Us</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• Experienced wedding photographers</li>
                  <li>• Personalized approach to your vision</li>
                  <li>• High-quality, professional-grade equipment</li>
                  <li>• Fast delivery of edited photos</li>
                  <li>• 100% satisfaction guarantee</li>
                </ul>
                <h2 className="text-xl font-semibold my-5">Ideal For</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• Weddings and receptions</li>
                  <li>• Engagement sessions</li>
                  <li>• Bridal portraits</li>
                  <li>• Special events and ceremonies</li>
                </ul>
              </div>

              <div className="divider"></div>
              <h2 className="text-xl font-semibold my-6">Reviews</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="space-y-6">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                            alt="Robert Carlone"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Robert Carlone
                            </h4>
                            <p className="text-sm text-gray-500">
                              2017 Washington Ave, Manchester, Kentucky 39495
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2"></div>
                        <p className="text-gray-600 mb-3">
                          This was our first time working together, and I am
                          already looking forward to the next. Great
                          communication, friendly vibes, and awesome work!
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-900">
                              $1000-1500
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span>25</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <MessageSquare className="w-4 h-4" />
                              <span>25</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <Reply className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="space-y-6">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                            alt="Robert Carlone"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Robert Carlone
                            </h4>
                            <p className="text-sm text-gray-500">
                              2017 Washington Ave, Manchester, Kentucky 39495
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2"></div>
                        <p className="text-gray-600 mb-3">
                          This was our first time working together, and I am
                          already looking forward to the next. Great
                          communication, friendly vibes, and awesome work!
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-900">
                              $1000-1500
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span>25</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <MessageSquare className="w-4 h-4" />
                              <span>25</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <Reply className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Robert Carlone"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      to="/seller-profile"
                      className="font-medium text-gray-900"
                    >
                      Robert Carlone
                    </Link>
                    <p className="text-sm text-gray-500">
                      Available 9:00 AM - 10:00 PM
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>

                <div className=" mb-6">
                  <span className="text-2xl font-bold text-gray-900">$75</span>
                  <span className="text-sm text-gray-500">/hr</span>
                </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] text-sm"
                          placeholderText="Select a time"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <p className="text-sm text-gray-600">
                      Overland Park, KS Overland Park, KS Overland Park, KS
                    </p>
                  </div>
                  <div className="w-full">
                    <Link
                      to="/order-preview"
                      className="block w-full bg-[#C8C1F5] hover:shadow-md hover:bg-[#b0a6f3] duration-500 text-white py-3 rounded-lg font-medium transition-colors text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10">
          <ServicesPackages />
        </div>
      </div>

      <MobileAppSection />
    </div>
  );
};

export default ServiceDetailPage;
