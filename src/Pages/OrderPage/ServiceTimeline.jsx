import { MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Check from '../../assets/icons/Vector.svg';
import question from '../../assets/icons/question.svg';

export default function ServiceTimeline() {
  const userRole = localStorage.getItem("userRole");
  const [showTaskCompleteModal, setShowTaskCompleteModal] = useState(false);

  const handleTaskComplete = () => {
    setShowTaskCompleteModal(false);
  };

  return (
    <div className="min-h-screen py-8 container mx-auto mt-30 md:mt-15">
      <div className=" px-4">
        <h1 className="text-3xl font-bold text-gray-800  mb-8">
          Service Timeline
        </h1>
        
        <div className="relative h-64 mb-8">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Wedding venue with elegant floral decorations and warm lighting"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/20 bg-opacity-20 rounded-2xl"></div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Destination engagement and wedding hall, california
        </h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Descriptions</h3>
          <p className="text-gray-600 leading-relaxed">
            California offers stunning destination engagement and wedding venues, from oceanfront resorts and lush vineyards to historic estates 
            and garden courtyards. Couples can enjoy picturesque backdrops, luxury amenities, and customizable packages for an unforgettable 
            celebration.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-6">Included Services</h3>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Dining area"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Dinning Area and location</h4>
                    <p className="text-gray-600 text-sm">200+ People capacity • Photography</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-6">Booking info</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Event Location</h4>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>775 Rolling Green Rd.</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Event Start</h4>
                  <p className="text-gray-600">19/04/2025</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Event End</h4>
                  <p className="text-gray-600">19/04/2025</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Price</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Location</span>
                  <span className="font-medium text-gray-800">$5,500</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Photographer x2</span>
                  <span className="font-medium text-gray-800">$289</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Catering Package</span>
                  <span className="font-medium text-gray-800">$1,522</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Catering Package</span>
                  <span className="font-medium text-gray-800">$1,522</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Catering Package</span>
                  <span className="font-medium text-gray-800">$1,522</span>
                </div>
                
                <hr className="border-gray-300 my-4" />
                
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">$6,785</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 bg-amber-50 p-4">
                <span className="text-gray-700 font-medium">Time Left</span>
                <span className="text-orange-500 font-semibold">20 Days</span>
              </div>
              <div className="flex space-x-3">
                {userRole === "seller" ? (
                  <button 
                    onClick={() => setShowTaskCompleteModal(true)}
                    className="flex-1 bg-[#C8C1F5] font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition hover:shadow-lg duration-300 cursor-pointer"
                  >
                    <img src={Check} alt="" className='w-4 h-4'/>
                    <span>Task complete request</span>
                  </button>
                ) : (
                  <Link to="/conversation" className="flex-1 bg-[#C8C1F5] font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition hover:shadow-lg duration-300 cursor-pointer">
                    <MessageCircle className="w-4 h-4 text-gray-700" />
                    <span>Send Message</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showTaskCompleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className='flex justify-center items-center py-5'>
              <img src={question} alt="" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Are you sure you want to mark this task as complete?</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTaskCompleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleTaskComplete();
                }}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}