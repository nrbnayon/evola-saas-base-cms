import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCategoriesData from "../../../hooks/useCategoriesData";

const Categories = () => {
  const { categories, loading, error } = useCategoriesData([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [dragging, setDragging] = useState(false);

  const colorSchemes = [
    "bg-blue-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-red-100",
  ];

  // Scroll buttons
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.8; // 80% of width
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // --- Mouse drag for desktop ---
  const handlePointerDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollStart.current = container.scrollLeft;
    setDragging(true);
    container.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    const container = scrollRef.current;
    if (!isDragging.current || !container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; // scroll speed
    container.scrollLeft = scrollStart.current - walk;
  };

  const handlePointerUp = () => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = false;
    setDragging(false);
    container.style.cursor = "grab";
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  // --- Loading / Error ---
  if (loading) {
    return (
      <section className="py-7 container mx-auto md:mt-10">
        <div className="text-center text-gray-500">Loading categories...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-7 container mx-auto md:mt-10">
        <div className="text-center text-red-600">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="py-7 container mx-auto md:mt-10">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>

          {/* Desktop arrows */}
          {categories.length > 6 && (
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#C8C1F5] transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#C8C1F5] transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Slider */}
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories available</p>
        ) : (
          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide select-none ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {categories.map((cat, i) => {
              const bgColor = colorSchemes[i % colorSchemes.length];
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="flex-shrink-0 snap-start w-36 sm:w-44 md:w-56"
                >
                  <div
                    className={`${bgColor} rounded-2xl p-6 h-48 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <img
                        src={cat.logo || "https://via.placeholder.com/40?text=?"}
                        alt={cat.title}
                        className="w-10 h-10 object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <h3 className="text-center text-gray-700 font-medium text-sm">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Categories;
