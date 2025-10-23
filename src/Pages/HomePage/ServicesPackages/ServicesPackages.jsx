import { Link } from "react-router-dom";
import image1 from "../../../assets/images/cardImage1.png";
import image2 from "../../../assets/images/cardImage2.png";
import image3 from "../../../assets/images/cardImage3.png";
import image4 from "../../../assets/images/cardImage4.png";
import { RiStarFill } from "react-icons/ri";
import { Heart } from "lucide-react";

const ServicesPackages = () => {
  const packages = [
    {
      id: 1,
      thumbnail: image1,
      title: "Wedding Photography",
      rating: 4.8,
      image: image1,
      name: "Robart Carlose",
      price: 19.99,
      distance: "4 km",
    },
    {
      id: 2,
      thumbnail: image2,
      title: "Event Decoration",
      rating: 4.6,
      image: image2,
      name: "Samantha Ray",
      price: 25.0,
      distance: "2.5 km",
    },
    {
      id: 3,
      thumbnail: image3,
      title: "DJ Party Setup",
      rating: 4.7,
      image: image3,
      name: "John Mixwell",
      price: 30.0,
      distance: "3 km",
    },
    {
      id: 4,
      thumbnail: image4,
      title: "Catering Service",
      rating: 4.9,
      image: image4,
      name: "Emily Foods",
      price: 15.5,
      distance: "1.8 km",
    },
  ];

  return (
    <div className="py-10 px-4 container mx-auto">
      <div className="pb-5 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-left">
          Services Packages
        </h1>
        <Link to="/" className="text-[#1E40AF] underline text-base">
          See All
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pack) => (
            <Link
              to={`/serviceDetails/${pack.id}`}
              key={pack.id}
              className="relative border border-gray-200 rounded-xl p-3 bg-white shadow-md hover:shadow-2xl transform transition-all duration-300 ease-in-out"
            >
              <div className="absolute top-3 left-3 bg-white/80 text-black text-sm font-semibold px-3 py-2 rounded-br-xl flex items-center gap-1 transition-all duration-300 hover:bg-white">
                <RiStarFill className="text-yellow-500" /> {pack.rating}
              </div>
              <img
                src={pack.thumbnail}
                alt={pack.title}
                className="w-full h-48 object-cover rounded-lg "
              />
              <div className="flex items-center justify-between mt-2 border-b pb-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <img
                    src={pack.image}
                    className="w-5 h-5 rounded-full object-cover"
                    alt={pack.name}
                  />
                  <p className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-300">
                    {pack.name}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-gray-800 hover:text-[#1E40AF] transition-colors duration-300">
                  {pack.title}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-baseline">
                  <p className="font-semibold text-gray-800">${pack.price}</p>
                  <span className="text-gray-400 text-xs font-light">/hr</span>
                </span>
                <span className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPackages;
