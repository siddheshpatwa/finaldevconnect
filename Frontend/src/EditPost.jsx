import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    desc: "",
    caption: "",
    hashtags: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const token = localStorage.getItem("token");

  const isValidText = (text) => /^[A-Za-z\s]+$/.test(text);
  const isValidHashtags = (text) => /^#([A-Za-z]+)( #[A-Za-z]+)*$/.test(text);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(
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
          image: data.img?.[0] ?? "",
        });
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const textFields = ["title", "desc", "caption", "location"];
    if (textFields.includes(name)) {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }
    if (name === "hashtags") {
      if (!/^#([A-Za-z]+)?( #[A-Za-z]+)*$/.test(value) && value !== "") return;
    }

    setPost((prevPost) => ({ ...prevPost, [name]: value }));
    if (formErrors[name]) setFormErrors((fe) => ({ ...fe, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPost((prevPost) => ({ ...prevPost, image: file }));
  };

  const validateForm = () => {
    const errors = {};
    if (!post.title.trim()) {
      errors.title = "Title is required.";
    } else if (!isValidText(post.title)) {
      errors.title = "Title must contain only letters and spaces.";
    }

    if (!post.desc.trim()) {
      errors.desc = "Description is required.";
    } else if (!isValidText(post.desc)) {
      errors.desc = "Description must contain only letters and spaces.";
    }

    if (post.caption && !isValidText(post.caption)) {
      errors.caption = "Caption must contain only letters and spaces.";
    }

    if (post.location && !isValidText(post.location)) {
      errors.location = "Location must contain only letters and spaces.";
    }

    if (post.hashtags && !isValidHashtags(post.hashtags)) {
      errors.hashtags = "Hashtags must start with # and contain only letters.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("title", post.title ?? "");
    formData.append("desc", post.desc ?? "");
    formData.append("caption", post.caption ?? "");
    formData.append("hashtags", post.hashtags ?? "");
    formData.append("location", post.location ?? "");

    if (post.image && typeof post.image !== "string") {
      formData.append("image", post.image);
    }

    try {
      await api.put(
        `http://localhost:3000/api/user/profile/post_u/${id}`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Post updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Error updating post");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-lg font-medium">Loading post...</p>;
  if (error)
    return <p className="text-center mt-8 text-red-600 font-semibold">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        {[
          { label: "Title", name: "title", multiline: false },
          { label: "Description", name: "desc", multiline: true },
          { label: "Caption", name: "caption", multiline: true },
          { label: "Hashtags", name: "hashtags", multiline: false },
          { label: "Location", name: "location", multiline: false },
        ].map(({ label, name, multiline }) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-1 font-semibold text-gray-800">
              {label}
            </label>
            {multiline ? (
              <textarea
                id={name}
                name={name}
                rows={3}
                value={post[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  formErrors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
            ) : (
              <input
                type="text"
                id={name}
                name={name}
                value={post[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  formErrors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {formErrors[name] && (
              <p className="text-red-600 text-sm mt-1">{formErrors[name]}</p>
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block mb-1 font-semibold text-gray-800">
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {post.image && (
            <div className="relative mt-4 inline-block rounded-lg overflow-hidden shadow-lg group cursor-pointer max-w-[160px]">
              <img
                src={
                  typeof post.image === "string"
                    ? post.image
                    : URL.createObjectURL(post.image)
                }
                alt="Preview"
                className="object-cover w-full h-32 group-hover:scale-110 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={() => setPost((prev) => ({ ...prev, image: "" }))}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md hover:bg-red-700 transition"
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitLoading}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            submitLoading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition`}
        >
          {submitLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
