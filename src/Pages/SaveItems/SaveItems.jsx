import { Link } from "react-router-dom";
import { RiHeartFill, RiStarFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import useSavedList from "../../hooks/useSavedList";
import Swal from "sweetalert2";
import { ChevronDown, ChevronUp } from "lucide-react";

const SaveItems = () => {
  const { savedServices, loading, error, removeSavedService, refetch } = useSavedList();
  console.log(savedServices, "savedServices");

  const [openCategories, setOpenCategories] = useState({});

  // Group services by listing.title
  const groupedServices = savedServices.reduce((acc, saved) => {
    const title = saved.listing?.title || "Uncategorized";
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(saved);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices).sort();

  useEffect(() => {
    const initialOpens = {};
    categories.forEach((category) => {
      initialOpens[category] = false;
    });
    setOpenCategories(initialOpens);
  }, [categories.length]);  

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleUnsaveService = async (savedId) => {
    console.log(`Unsaving saved ID: ${savedId}`);
    const success = await removeSavedService(savedId);
    if (success) {
      console.log("Service unsaved successfully");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Service unsaved successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      refetch(); // Refetch to update the list
    } else {
      console.error("Failed to unsave service");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center h-40">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-5">
        Error: {error}
      </div>
    );
  }

  if (savedServices.length === 0) {
    return (
      <div className="text-gray-600 text-center min-h-screen flex flex-col items-center justify-center py-5">
        <h1>No saved services found.</h1>
        <Link
          to="/services"
          className="mt-4 py-2 px-6 bg-[#c8c1f5] text-gray-600 rounded-full hover:bg-[#b0a8e2] transition-colors duration-300"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  console.log("Grouped services:", groupedServices);

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
      </div>

      <div>
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <div
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {category} ({groupedServices[category].length})
              </h2>
              {openCategories[category] ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
            {openCategories[category] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {groupedServices[category].map((saved) => (
                  <Link
                    to={`/serviceDetails/${saved.service?.id}`}
                    key={saved.id}
                    className="relative border border-gray-200 rounded-xl hover:shadow-2xl transform duration-500 p-3"
                  >
                    <div className="absolute top-3 left-3 bg-white/40 text-black text-sm font-semibold px-3 py-2 rounded-br-xl flex items-center gap-1">
                      <RiStarFill className="inline text-yellow-400" />
                      {saved.average_rating}
                    </div>
                    <img
                      src={saved.service?.cover_photo}
                      alt={saved.service?.title || "Service"}
                      className="w-full h-48 object-cover rounded-lg"
                      crossOrigin="anonymous"
                    />
                    <div className="flex items-center justify-between mt-2 border-b pb-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <img
                          src={saved.service?.seller?.photo}
                          className="w-5 h-5 rounded-full object-cover"
                          alt={saved.service?.seller?.full_name || "Seller"}
                        />
                        <p>{saved.service?.seller?.full_name || "Unknown Seller"}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-semibold">{saved.service?.title || "Untitled Service"}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-baseline">
                        <p className="font-semibold">${saved.service?.price || "N/A"}</p>
                      </span>
                      <span className="bg-gray-100 p-2 rounded-full hover:shadow transition-shadow duration-300">
                        <RiHeartFill
                          className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${
                            loading ? "text-gray-400 animate-pulse" : "text-red-500 fill-red-500"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnsaveService(saved.id);
                          }}
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaveItems;