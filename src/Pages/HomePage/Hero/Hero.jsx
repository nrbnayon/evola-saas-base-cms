import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../../assets/images/banner.png";

const Hero = () => {
  const [formData, setFormData] = useState({
    location: "",
    service: "",
    date: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      location: formData.location,
      service: formData.service,
      date: formData.date,
    }).toString();
    navigate(`/services?${queryParams}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-white text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
            Present up Event Management Specialists
          </p>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight mb-6 sm:mb-10">
            Choose Your Nearby Event <br className="hidden sm:block" />
            Management Services
          </h1>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-3xl md:rounded-full shadow-2xl mx-auto overflow-hidden w-full">
          <div className="flex flex-col md:flex-row flex-wrap">
            <div className="flex-1 px-4 sm:px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
              <p className="text-left text-sm font-medium text-gray-700 mb-1 ms-1">
                Where
              </p>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-transparent border-0 text-gray-700 focus:outline-none text-sm"
                required
              >
                <option value="" disabled>
                  Select Location
                </option>
                <option value="dhaka">Dhaka</option>
                <option value="chattogram">Chattogram</option>
                <option value="rajshahi">Rajshahi</option>
                <option value="khulna">Khulna</option>
              </select>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-left text-sm font-medium text-gray-700 mb-1 block">
                Services
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full bg-transparent border-0 text-gray-700 focus:outline-none text-sm"
                required
              >
                <option value="" disabled>
                  Select Services
                </option>
                <option value="wedding">Wedding Planning</option>
                <option value="corporate">Corporate Events</option>
                <option value="birthday">Birthday Parties</option>
                <option value="concert">Concerts</option>
              </select>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-4 border-b md:border-b-0 border-gray-200">
              <label className="text-left text-sm font-medium text-gray-700 mb-1 block">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-transparent border-0 text-gray-700 focus:outline-none text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-center p-3 sm:p-4 w-full md:w-auto">
              <button
                type="submit"
                className="bg-[#C8C1F5] text-black w-full md:w-14 h-12 sm:h-14 rounded-2xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="block md:hidden text-sm font-medium">
                  Search
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .relative.min-h-screen::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 400px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
          pointer-events: none;
          z-index: 5;
        }
      `}</style>
    </div>
  );
};

export default Hero;