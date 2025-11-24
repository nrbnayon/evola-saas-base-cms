// src/pages/admin/ContentPage.jsx
import { X, Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import SectionTitle from "../../../components/SectionTitle";
import apiClient from "../../../lib/api-client";
import Swal from "sweetalert2";

const ContentPage = () => {
  // Form State
  const [bannerImage, setBannerImage] = useState(null);
  const [videoImage, setVideoImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetched Content
  const [contents, setContents] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // Fetch content safely
  const fetchContent = async () => {
    try {
      setLoadingContent(true);
      const res = await apiClient.get("/site/content");
      console.log("Raw API Response:", res.data);

      // Extract array from any possible structure
      let contentArray = [];

      if (Array.isArray(res.data)) {
        contentArray = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        contentArray = res.data.data;
      } else if (res.data?.content && Array.isArray(res.data.content)) {
        contentArray = res.data.content;
      } else if (res.data?.contents && Array.isArray(res.data.contents)) {
        contentArray = res.data.contents;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        contentArray = res.data.results;
      }

      setContents(contentArray);
    } catch (err) {
      console.error("Fetch error:", err);
      setContents([]);
      Swal.fire("Error", "Failed to load content.", "error");
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // File handler
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const fileSizeMB = file.size / (1024 * 1024);

    if (type === "banner" && !file.type.startsWith("image/")) {
      setError("Banner must be an image!");
      setIsUploading(false);
      return;
    }

    if (type === "video" && !file.type.match(/^(image|video)\//)) {
      setError("Please upload image or video!");
      setIsUploading(false);
      return;
    }

    if (fileSizeMB > 5) {
      setError("Image size must be less than 5MB!");
      setIsUploading(false);
      return;
    }

    if (type === "video" && file.type.startsWith("video/") && fileSizeMB > 50) {
      setError("Video size must be less than 50MB!");
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      type === "banner" ? setBannerImage(e.target.result) : setVideoImage(e.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError("Error reading file!");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (type) => {
    type === "banner" ? setBannerImage(null) : setVideoImage(null);
  };

  // Upload content
  const handlePublish = async () => {
    if (!description.trim()) {
      setError("Description is required!");
      return;
    }
    if (!bannerImage && !videoImage) {
      setError("Upload at least one banner or video/image!");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());

      if (bannerImage && bannerImage.startsWith("data:")) {
        const bannerBlob = await (await fetch(bannerImage)).blob();
        formData.append("banner", bannerBlob, "banner.jpg");
      }

      if (videoImage && videoImage.startsWith("data:")) {
        const videoBlob = await (await fetch(videoImage)).blob();
        const ext = videoImage.includes("video") ? "mp4" : "jpg";
        formData.append("media", videoBlob, `media.${ext}`);
      }

      await apiClient.post("/administration/site/content/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Published!",
        text: "Content uploaded successfully.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });

      // Reset
      setBannerImage(null);
      setVideoImage(null);
      setDescription("");
      fetchContent();
    } catch (err) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.message || "Upload failed.";
      setError(msg);
      Swal.fire("Error", msg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete content
  const handleDeleteContent = async (id) => {
    const result = await Swal.fire({
      title: "Delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/administration/site/content/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchContent();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  return (
    <div>
      <SectionTitle title="Upload Content" />

      {/* Upload Form */}
      <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 mb-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}
        {isUploading && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm">
            Uploading...
          </div>
        )}

        {/* Banner */}
        <div className="mb-8">
          <label className="text-gray-700 font-medium mb-2 block">
            Banner Image <span className="text-gray-400 text-sm">(Max 5MB)</span>
          </label>
          {bannerImage ? (
            <div className="relative w-full sm:w-2/3 h-48 border border-gray-300 rounded-lg overflow-hidden group">
              <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete("banner")}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="w-full sm:w-2/3 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
              <Upload className="w-10 h-10 mb-2 text-gray-400" />
              <span className="text-sm">Click to upload banner</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "banner")}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        {/* Video/Image */}
        <div className="mb-8">
          <label className="text-gray-700 font-medium mb-2 block">
            Video / Image <span className="text-gray-400 text-sm">(Image less than 5MB, Video less than 50MB)</span>
          </label>
          {videoImage ? (
            <div className="relative w-48 h-48 border border-gray-300 rounded-lg overflow-hidden group">
              {videoImage.startsWith("data:video") ? (
                <video controls className="w-full h-full object-cover">
                  <source src={videoImage} />
                </video>
              ) : (
                <img src={videoImage} alt="Media" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => handleDelete("video")}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
              <Upload className="w-10 h-10 mb-2 text-gray-400" />
              <span className="text-sm">Upload file</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-y"
            placeholder="Write a detailed description..."
            rows={6}
            disabled={isUploading}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            disabled={isUploading}
            className={`py-2 px-6 font-semibold rounded-lg transition-all ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
            }`}
          >
            {isUploading ? "Publishing..." : "Publish Content"}
          </button>
        </div>
      </div>

      {/* Display Uploaded Content */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Content</h2>

        {loadingContent ? (
          <p className="text-gray-500">Loading content...</p>
        ) : !Array.isArray(contents) || contents.length === 0 ? (
          <p className="text-gray-500">No content uploaded yet.</p>
        ) : (
          <div className="space-y-6">
            {contents.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm text-gray-600">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : "No date"}
                  </p>
                  <button
                    onClick={() => handleDeleteContent(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {item.banner_url && (
                  <img
                    src={item.banner_url}
                    alt="Banner"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                {item.media_url && (
                  <div className="mb-3">
                    {item.media_url.includes("video") || item.media_url.endsWith(".mp4") ? (
                      <video controls className="w-full h-48 rounded-lg object-cover">
                        <source src={item.media_url} />
                      </video>
                    ) : (
                      <img src={item.media_url} alt="Media" className="w-full h-48 object-cover rounded-lg" />
                    )}
                  </div>
                )}

                <p className="text-gray-700">{item.description || "No description"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;