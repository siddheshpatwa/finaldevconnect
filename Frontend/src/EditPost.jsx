import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineImageNotSupported } from "react-icons/md"; // For image preview placeholder

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    desc: "",
    caption: "",
    hashtags: "",
    location: "",
    image: null, // Stores File object or URL string
    originalImageUrl: null, // Stores original URL for existing image
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/profile/post_get/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        const data = res.data.post;
        setPost({
          title: data.title ?? "",
          desc: data.desc ?? "",
          caption: data.caption ?? "",
          hashtags: data.hashtags ?? "",
          location: data.location ?? "",
          image: data.img?.[0] || null,
          originalImageUrl: data.img?.[0] || null,
        });
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost((prevPost) => ({ ...prevPost, image: file }));
    } else {
      // If user cancels file selection, revert to original image if it exists
      setPost((prevPost) => ({ ...prevPost, image: post.originalImageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setPost((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("desc", post.desc);
    formData.append("caption", post.caption);
    formData.append("hashtags", post.hashtags);
    formData.append("location", post.location);

    if (post.image && typeof post.image !== "string") {
      // If a new file was selected
      formData.append("image", post.image);
    } else if (post.image === null && post.originalImageUrl) {
      // If image was explicitly removed by the user
      formData.append("removeImage", "true");
    }

    try {
      await axios.put(
        `http://localhost:3000/api/user/profile/post_u/${id}`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Post updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating post:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error updating post. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-center text-xl font-medium text-indigo-500 animate-pulse">Loading post...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-center text-xl font-semibold text-red-600">{error}</p>
      </div>
    );

  const currentImageSrc = post.image
    ? typeof post.image === "string"
      ? post.image
      : URL.createObjectURL(post.image)
    : null;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 mb-10 border border-indigo-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        {[
          { label: "Title", name: "title", multiline: false },
          { label: "Description", name: "desc", multiline: true },
          { label: "Caption", name: "caption", multiline: true },
          { label: "Hashtags (e.g., #react #webdev)", name: "hashtags", multiline: false },
          { label: "Location", name: "location", multiline: false },
        ].map(({ label, name, multiline, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 font-semibold text-gray-800">
              {label}
            </label>
            {multiline ? (
              <textarea
                id={name}
                name={name}
                rows={3}
                value={post[name]}
                onChange={handleChange}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out border-gray-300"
              />
            ) : (
              <input
                type="text"
                id={name}
                name={name}
                value={post[name]}
                onChange={handleChange}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out border-gray-300"
              />
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block mb-2 font-semibold text-gray-800">
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200 ease-in-out"
          />

          {currentImageSrc && (
            <div className="relative mt-4 inline-block rounded-lg overflow-hidden shadow-lg group cursor-pointer max-w-[200px] w-full">
              <img
                src={currentImageSrc}
                alt="Post Preview"
                className="object-cover w-full h-32 md:h-48 group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold shadow-md hover:bg-red-700 transition opacity-80 hover:opacity-100"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}

          {!currentImageSrc && (
            <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 flex flex-col items-center justify-center">
              <MdOutlineImageNotSupported className="text-5xl mb-2" />
              <span>No image selected</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitLoading}
          className={`w-full py-3 rounded-md text-white font-semibold flex items-center justify-center gap-2 ${
            submitLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition duration-200 ease-in-out`}
        >
          {submitLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {submitLoading ? "Updating..." : "Update Post"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="w-full py-3 rounded-md text-indigo-700 border border-indigo-600 font-semibold mt-4 hover:bg-indigo-50 transition duration-200 ease-in-out"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditPost;