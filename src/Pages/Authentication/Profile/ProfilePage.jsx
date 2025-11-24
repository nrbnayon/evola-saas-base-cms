import { useState, useEffect } from "react";
import { Camera, Edit2, Save, X, Mail, Phone, Calendar, Shield } from "lucide-react";
import useMe from "../../../hooks/useMe";
import apiClient from "../../../lib/api-client";

const ProfilePage = () => {
  const { user, loading, refetch } = useMe();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setEditedName(user.full_name || "");
      setProfilePhoto(user.photo || "");
      setCoverPhoto(user.cover_photo || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Check if cover photo loads successfully
  useEffect(() => {
    if (coverPhoto) {
      const img = new Image();
      img.src = coverPhoto;
      img.onload = () => setCoverError(false);
      img.onerror = () => setCoverError(true);
    } else {
      setCoverError(true);
    }
  }, [coverPhoto]);

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleNameChange = (e) => setEditedName(e.target.value);

  const saveName = async () => {
    try {
      await apiClient.put("/user/update", { full_name: editedName });
      setIsEditingName(false);
      refetch();
    } catch (err) {
      setError("Failed to update name.");
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingProfile(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      await apiClient.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refetch();
    } catch (err) {
      setError("Failed to update profile photo.");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingCover(true);
    const formData = new FormData();
    formData.append("cover_photo", file);

    try {
      await apiClient.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refetch();
    } catch (err) {
      setError("Failed to update cover photo.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleBioChange = (e) => setBio(e.target.value);

  const saveBio = async () => {
    try {
      await apiClient.put("/user/update", { bio });
      setIsEditingBio(false);
      refetch();
    } catch (err) {
      setError("Failed to update bio.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden mb-8">
          {/* Cover Photo Section */}
          <div className="relative h-64 sm:h-80">
            <div
              className="w-full h-full transition-all duration-300"
              style={{
                backgroundImage: coverError ? 'none' : `url(${coverPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: coverError ? '#e5e7eb' : 'transparent',
              }}
            >
              {coverError && (
                <div className="flex items-center justify-center h-full">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <label className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105">
              <Camera className="w-5 h-5 text-gray-700" />
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                className="hidden"
                disabled={isUploadingCover}
              />
            </label>

            {isUploadingCover && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              {/* Profile Picture and Name */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt={user?.full_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
                      setProfileError(true);
                    }}
                    onLoad={() => setProfileError(false)}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <label className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                      disabled={isUploadingProfile}
                    />
                  </label>
                  {isUploadingProfile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="sm:mb-4">
                  {isEditingName ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editedName}
                        onChange={handleNameChange}
                        className="text-2xl sm:text-3xl font-bold border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        autoFocus
                      />
                      <button 
                        onClick={saveName} 
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingName(false);
                          setEditedName(user?.full_name);
                        }} 
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {user?.full_name}
                      </h1>
                      <button 
                        onClick={() => setIsEditingName(true)} 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <Shield className="w-4 h-4 mr-1" />
                      {user?.role}
                    </span>
                    {user?.is_active && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-medium">{user?.email_address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm font-medium">{user?.phone_number || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  <p className="text-sm font-medium">{formatDate(user?.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Account Type</p>
                  <p className="text-sm font-medium">{user?.is_individual ? "Individual" : "Business"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">About</h2>
            {isEditingBio ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveBio} 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => {
                    setIsEditingBio(false);
                    setBio(user?.bio || "");
                  }} 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingBio(true)} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
          
          {isEditingBio ? (
            <textarea
              value={bio}
              onChange={handleBioChange}
              className="w-full h-40 border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-700"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {bio || "No bio available. Click edit to add information about yourself."}
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;