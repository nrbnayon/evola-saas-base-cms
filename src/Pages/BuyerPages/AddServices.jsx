import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const AddServices = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    price: "",
    time: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverType, setCoverType] = useState(null);
  const coverInputRef = useRef(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setCoverType(file.type);
      // For images, check dimensions
      if (file.type.startsWith("image")) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (img.width > 1000 || img.height > 1000) {
            alert("Image dimensions exceed 1000 x 1000 pixels.");
            setCoverPreview(null);
            setCoverType(null);
          }
        };
      }
    }
  };

  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const galleryInputRef = useRef(null);

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (file && galleryPreviews.length < 3) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      const url = URL.createObjectURL(file);
      const newItem = { url, type: file.type };
      setGalleryPreviews((prev) => [...prev, newItem]);
      // For images, check dimensions
      if (file.type.startsWith("image")) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (img.width > 1000 || img.height > 1000) {
            alert("Image dimensions exceed 1000 x 1000 pixels.");
            setGalleryPreviews((prev) => prev.slice(0, -1));
          }
        };
      }
    }
  };

  const showSizeLimits = () => {
    alert("Max size: 10MB\nDimensions: 1000 x 1000 pixels");
  };

  const handlePublish = () => {
    console.log("Publishing service:", formData, coverPreview, galleryPreviews);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-7xl mx-auto mt-30 md:mt-15">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link to="/buyer-overview"
              className="mr-3 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create Your Services
              </h3>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-6">
          {/* Service Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Write service title"
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Service Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none"
              placeholder="Description"
            />
          </div>

          {/* Search Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search Tags{" "}
              <span className="text-gray-500">
                (Enter relevant tags below and enhance)
              </span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="tags"
            />
          </div>

          {/* Base Price and Available Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Base Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="$1,000-1500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Available time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="09:00 AM - 10:00 PM"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="Enter your location"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cover Photo{" "}
              <span className="text-red-500">
                (Image or video{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={showSizeLimits}
                >
                  see size limits
                </span>
                )
              </span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 cursor-pointer"
              onClick={() => coverInputRef.current.click()}
            >
              {coverPreview ? (
                coverType.startsWith("image") ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="max-w-full max-h-40 mx-auto object-contain"
                  />
                ) : (
                  <video
                    src={coverPreview}
                    controls
                    className="max-w-full max-h-40 mx-auto"
                  />
                )
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Image or Video</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              ref={coverInputRef}
              hidden
              onChange={handleCoverUpload}
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gallery{" "}
              <span className="text-red-500">
                (Image or video 1000 x 1000 max size 10MB)
              </span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center bg-gray-50"
                >
                  {galleryPreviews[index] ? (
                    galleryPreviews[index].type.startsWith("image") ? (
                      <img
                        src={galleryPreviews[index].url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={galleryPreviews[index].url}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">
                        Image or Video
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div
                className={`border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 ${
                  galleryPreviews.length >= 3
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  if (galleryPreviews.length < 3) {
                    galleryInputRef.current.click();
                  }
                }}
              >
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              ref={galleryInputRef}
              hidden
              onChange={handleGalleryUpload}
            />
          </div>
          <button
            onClick={handlePublish}
            className="w-full py-3 bg-[#C8C1F5] rounded-md hover:shadow-lg cursor-pointer duration-500"
          >
            Publish Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServices;
