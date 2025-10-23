import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import icon1 from "../../../assets/icons/icon1.png";
import icon2 from "../../../assets/icons/icon2.png";
import icon3 from "../../../assets/icons/icon3.png";
import icon4 from "../../../assets/icons/icon4.png";
import icon5 from "../../../assets/icons/icon5.png";
import icon6 from "../../../assets/icons/icon6.png";

const Categories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const categories = [
    {
      id: 1,
      name: "Event Location",
      icon: icon1,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      name: "Decoration",
      icon: icon2,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: 3,
      name: "Wedding Car",
      icon: icon6,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      name: "Photographer",
      icon: icon3,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 5,
      name: "Catering",
      icon: icon5,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 6,
      name: "DJ",
      icon: icon4,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: 1,
      name: "Event Location",
      icon: icon1,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      name: "Decoration",
      icon: icon2,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: 3,
      name: "Wedding Car",
      icon: icon6,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      name: "Photographer",
      icon: icon3,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 5,
      name: "Catering",
      icon: icon5,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 6,
      name: "DJ",
      icon: icon4,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const visibleCards = 6;

  const maxIndex = Math.max(0, categories.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return maxIndex;
      }
      return prevIndex - 1;
    });
  };

  return (
    <div className="py-7 container mx-auto md:mt-10">
      <div className="px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>

          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-[#C8C1F5] duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-[#C8C1F5] duration-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
              width: `${(categories.length / visibleCards) * 100}%`,
            }}
          >
            {categories.map((category, index) => (
              <div key={`${category.id}-${index}`} className="flex-shrink-0 w-36 md:w-56 px-2">
                <div
                  className={`${category.bgColor} rounded-2xl p-6 h-48 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
                >
                  <div
                    className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-10 h-10"
                    />
                  </div>
                  <h3 className="text-center text-gray-700 font-medium text-sm">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;