import image1 from "../../assets/images/cardImage1.png";
import image2 from "../../assets/images/cardImage2.png";
import image3 from "../../assets/images/cardImage3.png";
import image4 from "../../assets/images/cardImage4.png";
import { RiStarFill } from "react-icons/ri";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AllServices = () => {
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
      category: "Photography",
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
      category: "Decoration",
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
      category: "Entertainment",
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
      category: "Catering",
    },
  ];

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 50], // [min, max]
    rating: 0,
    distance: 0,
  });

  // Handle clearing the search field
  const handleClearSearch = () => {
    setSearchTerm(""); // Reset search term to empty
  };

  // Filter packages based on all criteria
  const filteredPackages = packages.filter((pack) => {
    const matchesSearch =
      pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filters.category.length === 0 || filters.category.includes(pack.category);
    const matchesPrice =
      pack.price >= filters.priceRange[0] &&
      pack.price <= filters.priceRange[1];
    const matchesRating = filters.rating === 0 || pack.rating >= filters.rating;
    const matchesDistance =
      filters.distance === 0 || parseFloat(pack.distance) <= filters.distance;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesDistance
    );
  });

  // Handle filter changes
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      category: checked
        ? [...prev.category, value]
        : prev.category.filter((cat) => cat !== value),
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [
        prev.priceRange[0],
        value <= prev.priceRange[0] ? prev.priceRange[0] : value,
      ],
    }));
  };

  const handleMinPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [
        value >= prev.priceRange[1] ? prev.priceRange[1] : value,
        prev.priceRange[1],
      ],
    }));
  };

  const handleRatingChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilters((prev) => ({ ...prev, rating: value }));
  };

  return (
    <div className="py-6 px-4 min-h-screen container mx-auto mt-30 md:mt-15">
      <div className="flex gap-6">
        {/* Sidebar (Visible only on large screens) */}
        <div className="hidden lg:block lg:w-1/4 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
            <div className="space-y-2">
              {["Photography", "Decoration", "Entertainment", "Catering"].map(
                (cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <input
                      type="checkbox"
                      value={cat}
                      checked={filters.category.includes(cat)}
                      onChange={handleCategoryChange}
                      className="h-4 w-4 text-[#D7D4EE] "
                    />
                    {cat}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6 border border-gray-200 bg-[#D7D4EE] rounded-xl">
            <div className="px-4 pt-3 pb-1">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Price Range
              </h4>
            </div>
            <div className="flex items-center gap-2 bg-white p-5 border border-gray-200 rounded-xl">
              <input
                type="range"
                min="0"
                max="50"
                value={filters.priceRange[0]}
                onChange={handleMinPriceChange}
                className="w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C8C1F5]"
              />
              <span className="text-sm text-gray-600">
                ${filters.priceRange[0]}
              </span>
              <span className="text-sm text-gray-600">-</span>
              <input
                type="range"
                min="0"
                max="50"
                value={filters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C8C1F5]"
              />
              <span className="text-sm text-gray-600">
                ${filters.priceRange[1]}
              </span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6 border border-gray-200 bg-[#D7D4EE] rounded-xl">
            <div className="px-4 pt-3 pb-1">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
            </div>
            <div className="flex items-center gap-2 bg-white p-5 border border-gray-200 rounded-xl">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.rating}
                onChange={handleRatingChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C8C1F5]"
              />
              <span className="text-sm text-gray-600">
                {filters.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search services or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-4 pl-10 pr-10 text-sm border border-gray-200 rounded-xl shadow-lg"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <button
              onClick={handleClearSearch} // Add onClick handler to clear search
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Packages Grid */}
          <div className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPackages.map((pack) => (
                <Link
              to={`/serviceDetails/${pack.id}`}
                  key={pack.id}
                  className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="absolute top-3 left-3 bg-white/70 text-black text-xs font-semibold px-2 py-1 rounded-br-md flex items-center gap-1">
                    <RiStarFill className="inline text-yellow-500 w-4 h-4" />{" "}
                    {pack.rating}
                  </div>
                  <img
                    src={pack.thumbnail}
                    alt={pack.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between mt-3 border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={pack.image}
                        className="w-6 h-6 rounded-full object-cover"
                        alt=""
                      />
                      <p className="text-sm text-gray-700">{pack.name}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-900 text-base">
                      {pack.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-baseline">
                      <p className="text-lg font-bold text-gray-900">
                        ${pack.price}
                      </p>
                      <span className="text-gray-500 text-xs font-light">
                        /hr
                      </span>
                    </span>
                    <span className="bg-gray-100 p-2 rounded-full hover:shadow transition-shadow duration-300">
                      <Heart className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-300" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllServices;