import { useState } from "react";

export default function PrivacyPolicyUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) {
      return;
    }
    // Add your submission logic here (e.g., API call)
    console.log("Submitted:", { title, description, file });
    alert("Privacy policy uploaded successfully!");
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Upload Privacy Policy
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Policy Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter policy title"
            required
          />
        </div>

        {/* Description with Textarea */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter a detailed description"
            rows="8"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="py-2 px-4 bg-purple-200 text-black rounded-lg hover:shadow-xl"
          >
            Upload Policy
          </button>
        </div>
      </form>
    </div>
  );
}
