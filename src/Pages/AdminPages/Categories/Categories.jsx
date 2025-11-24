import useCategory from "../../../dashboardHook/useCategory";
import { useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../lib/api-client";

const Categories = () => {
  const { categories, loading } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 added for search

  const colors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-pink-50",
    "bg-purple-50",
    "bg-indigo-50",
    "bg-red-50",
    "bg-teal-50",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        if (img.width > 512 || img.height > 512) {
          Swal.fire({
            icon: "error",
            title: "Image must be 512x512 or smaller",
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
          });
          setLogoFile(null);
          setPreview(null);
          URL.revokeObjectURL(objectUrl);
        } else {
          setLogoFile(file);
          setPreview(objectUrl);
        }
      };

      img.onerror = () => {
        Swal.fire({
          icon: "error",
          title: "Invalid image file",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.title || !logoFile) {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("logo", logoFile);

      await apiClient.post("/administration/category/create", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Category created successfully",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setPreview(null);
      window.location.reload();
    } catch (err) {
      console.error("Create category error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to create category",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 👇 filter categories by title or slug
  const filteredCategories = categories.filter((cat) =>
    [cat.title, cat.slug]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* 🔍 Search Box */}
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E40AF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1E3A8A] transition"
          >
            + Create New
          </button>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filteredCategories.map((cat, index) => {
            const bgColor = colors[index % colors.length];
            return (
              <div
                key={cat.id}
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
                <p className="text-center text-gray-400 text-xs mt-1">Services: 0</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No categories found.</p>
      )}

      {/* Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Category</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                />
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPreview(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
