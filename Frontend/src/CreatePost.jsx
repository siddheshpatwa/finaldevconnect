import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
    caption: "",
    hashtags: "",
    location: "",
  });

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      setError("You can upload up to 10 photos or videos only.");
      return;
    }
    setError("");
    setFiles(selectedFiles);
  };

  const isValidText = (text) => /^[A-Za-z\s]+$/.test(text.trim());
  const isValidHashtags = (text) => /^#\w+( #\w+)*$/.test(text.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return setError("User not authenticated");
    }

    // Field validations
    let hasError = false;
    const newErrors = {};

    if (!isValidText(title)) {
      newErrors.title = "Only letters and spaces are allowed.";
      hasError = true;
    }
    if (!isValidText(description)) {
      newErrors.description = "Only letters and spaces are allowed.";
      hasError = true;
    }
    if (!isValidText(caption)) {
      newErrors.caption = "Only letters and spaces are allowed.";
      hasError = true;
    }
    if (location && !isValidText(location)) {
      newErrors.location = "Only letters and spaces are allowed.";
      hasError = true;
    }
    if (hashtags && !isValidHashtags(hashtags)) {
      newErrors.hashtags = "Hashtags must start with # and be space-separated.";
      hasError = true;
    }

    setFieldErrors(newErrors);
    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", description);
      formData.append("caption", caption);
      files.forEach((file) => formData.append("files", file));
      formData.append("hashtags", hashtags);
      formData.append("location", location);

      const res = await axios.post(
        "http://localhost:3000/api/user/profile/post_create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("✅ Post created successfully!");
      setLoading(false);

      setTimeout(() => {
        setSuccess("");
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error creating post:", err);
      setLoading(false);
      setError(err.response?.data?.message || "❌ Failed to create post");
    }
  };

  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Create New Post</h1>

        {error && (
          <div className="mb-4 text-center text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-center text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded">
            {success}
          </div>
        )}
        {loading && (
          <div className="flex justify-center mb-4 items-center">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="ml-2 text-blue-600 font-medium">Creating post...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                const val = e.target.value;
                setTitle(val);
                setFieldErrors((prev) => ({
                  ...prev,
                  title: !isValidText(val) ? "Only letters and spaces are allowed." : "",
                }));
              }}
              required
              placeholder="My Trip to the Mountains"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.title ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {fieldErrors.title && <p className="text-red-600 text-sm mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                const val = e.target.value;
                setDescription(val);
                setFieldErrors((prev) => ({
                  ...prev,
                  description: !isValidText(val) ? "Only letters and spaces are allowed." : "",
                }));
              }}
              required
              placeholder="Write a detailed description of your post"
              className={`w-full border rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 ${
                fieldErrors.description ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {fieldErrors.description && <p className="text-red-600 text-sm mt-1">{fieldErrors.description}</p>}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => {
                const val = e.target.value;
                setCaption(val);
                setFieldErrors((prev) => ({
                  ...prev,
                  caption: !isValidText(val) ? "Only letters and spaces are allowed." : "",
                }));
              }}
              required
              placeholder="e.g. Sunset vibes from hike!"
              className={`w-full border rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 ${
                fieldErrors.caption ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {fieldErrors.caption && <p className="text-red-600 text-sm mt-1">{fieldErrors.caption}</p>}
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photos/Videos <span className="text-xs text-gray-500">(Max: 10)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => {
                const val = e.target.value;
                setHashtags(val);
                setFieldErrors((prev) => ({
                  ...prev,
                  hashtags:
                    val && !isValidHashtags(val)
                      ? "Hashtags must start with # and be space-separated."
                      : "",
                }));
              }}
              placeholder="#sunset #nature"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.hashtags ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {fieldErrors.hashtags && <p className="text-red-600 text-sm mt-1">{fieldErrors.hashtags}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                const val = e.target.value;
                setLocation(val);
                setFieldErrors((prev) => ({
                  ...prev,
                  location: val && !isValidText(val) ? "Only letters and spaces are allowed." : "",
                }));
              }}
              placeholder="Western Ghats"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                fieldErrors.location ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {fieldErrors.location && <p className="text-red-600 text-sm mt-1">{fieldErrors.location}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-lg transition`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
