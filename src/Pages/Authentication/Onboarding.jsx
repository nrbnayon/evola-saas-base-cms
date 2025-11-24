import { useState } from "react";
import company from "../../assets/icons/company.svg";
import solo from "../../assets/icons/solo.svg";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMe from "../../hooks/useMe";
import apiClient from "../../lib/api-client";
import useCategoriesData from "../../hooks/useCategoriesData";

const Onboarding = () => {
  const { categories, loading: categoriesLoading } = useCategoriesData();
  const { user, loading, error } = useMe();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [teamSize, setTeamSize] = useState(null);
  const [step, setStep] = useState(1);
  const [occupation, setOccupation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "profile") setProfileImage(file);
      else if (type === "cover") setCoverImage(file);
      else if (type === "certificate") setCertificate(file);
    }
  };

  const handleNext = () => {
    if (
      step === 1 &&
      selectedType === "solo" &&
      (!profileImage || !coverImage)
    ) {
      setErrorMessage("Please upload both profile and cover images.");
      return;
    }
    if (
      step === 1 &&
      selectedType === "company" &&
      (!teamSize || !profileImage || !coverImage)
    ) {
      setErrorMessage(
        "Please select team size and upload both profile and cover images."
      );
      return;
    }
    if (step === 2) setStep(3);
    else setStep(2);
    setErrorMessage(""); // Clear error on successful step change
  };

  const handleSkip = () => {
    setStep(3);
    setErrorMessage(""); // Clear error on skip
  };

  const handleFinish = async () => {
    if (!user?.user_id) {
      setErrorMessage("User ID not available. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.user_id);
    formData.append("user_type", selectedType);
    if (teamSize) formData.append("team_size", teamSize);
    if (profileImage) formData.append("photo", profileImage);
    if (coverImage) formData.append("cover_photo", coverImage);
    if (certificate) formData.append("attachments", certificate);
    formData.append(
      "information",
      JSON.stringify({ name: occupation, description: description })
    );
    // formData.append("description", description);
    formData.append(
      "work_details",
      JSON.stringify({ category: category, experience: experience })
    );
    // formData.append("experience", experience);

    console.log("Payload being sent:", Object.fromEntries(formData));

    try {
      const response = await apiClient.post(
        "/seller/profile/complete",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("API Response:", response); // Debug response
      if (response.status === 200 || response.status === 201) {
        navigate("/seller-overview"); // Redirect to seller dashboard
      }
    } catch (error) {
      setErrorMessage("Failed to complete profile. Please try again.");
      console.error(
        "Profile completion failed:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl w-full">
        {step === 1 && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    What type of work are you?
                  </h1>
                  <p className="text-sm text-gray-500">
                    Join now to streamline you
                  </p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Solo Worker */}
              <button
                onClick={() => {
                  setSelectedType("Individual");
                  setIsImageModalOpen(true);
                }}
                className={`p-8 rounded-xl border transition-all hover:shadow-md ${
                  selectedType === "solo"
                    ? "border-blue-400 bg-amber-50"
                    : "border-none bg-amber-50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <img src={solo} alt="Solo Worker" className="w-20 h-20" />
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Solo Worker
                  </span>
                </div>
              </button>

              {/* Company */}
              <button
                onClick={() => {
                  setSelectedType("Company");
                  setIsTeamModalOpen(true);
                }}
                className={`p-8 rounded-xl border transition-all hover:shadow-md ${
                  selectedType === "company"
                    ? "border-blue-400 bg-blue-50"
                    : "border-none bg-blue-50 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <img src={company} alt="Company" className="w-20 h-20" />
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Company
                  </span>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedType}
                className="bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Tell us about yourself
                  </h1>
                  <p className="text-sm text-gray-500">
                    Add some details to complete your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Image Previews
              </h2>
              <div className="flex gap-6">
                <div className="relative">
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : "https://via.placeholder.com/100?text=Profile"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    onClick={() =>
                      document.getElementById("profile-upload").click()
                    }
                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "profile")}
                    className="hidden"
                  />
                </div>
                <div className="relative">
                  <img
                    src={
                      coverImage
                        ? URL.createObjectURL(coverImage)
                        : "https://via.placeholder.com/400x100?text=Cover"
                    }
                    alt="Cover"
                    className="w-96 h-24 object-cover border-2 border-gray-200"
                  />
                  <button
                    onClick={() =>
                      document.getElementById("cover-upload").click()
                    }
                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "cover")}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Occupation and Description */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g., Photographer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Tell us about your work..."
                  rows="4"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Upload Work Details
                  </h1>
                  <p className="text-sm text-gray-500">
                    Add your professional details
                  </p>
                </div>
              </div>
            </div>

            {/* Work Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Type
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled>
                    Select work category
                  </option>
                  {categoriesLoading ? (
                    <option>Loading...</option>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))
                  ) : (
                    <option>No categories available</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience (Years)
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Certificate
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleImageChange(e, "certificate")}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center mt-4">
                {errorMessage}
              </p>
            )}

            {/* Continue Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleFinish}
                className="bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors"
              >
                Finish
              </button>
            </div>
          </>
        )}

        {/* Image Upload Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "profile")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image (4:1 Ratio)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "cover")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsImageModalOpen(false);
                    setStep(2);
                  }}
                  className="bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium px-4 py-2 rounded-full"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Size Modal */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                How Big is Your Team?
              </h2>
              <select
                value={teamSize || ""}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="" disabled>
                  Select team size
                </option>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((size) => (
                  <option key={size} value={size}>
                    {size} Employee{size > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsTeamModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (teamSize) {
                      setIsTeamModalOpen(false);
                      setIsImageModalOpen(true);
                    }
                  }}
                  disabled={!teamSize}
                  className="bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
