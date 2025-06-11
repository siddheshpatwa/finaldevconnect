import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPostAdmin = () => {
  const { postId } = useParams();
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/admin/post/${postId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        const data = res.data.post;
        setPost({
          title: data.title || "",
          desc: data.desc || "",
          caption: data.caption || "",
          hashtags: data.hashtags || "",
          location: data.location || "",
          image: data.img?.[0] || "",
        });
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPost((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("desc", post.desc);
    formData.append("caption", post.caption);
    formData.append("hashtags", post.hashtags);
    formData.append("location", post.location);
    if (post.image && typeof post.image !== "string") {
      formData.append("image", post.image);
    }
    console.log("Form Data:", formData);
    setSubmitLoading(true);

    try {
      await axios.put(
        `http://localhost:3000/api/admin/editPost/${postId}`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Post updated successfully.");
      navigate("/admin");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update post.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading post...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Edit Admin Post</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Title", name: "title" },
          { label: "Description", name: "desc" },
          { label: "Caption", name: "caption" },
          { label: "Hashtags", name: "hashtags" },
          { label: "Location", name: "location" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={post[name]}
              onChange={handleChange}
              placeholder={`Enter ${label}`}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors[name] && (
              <p className="text-red-600 text-sm">{formErrors[name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 rounded-md"
          />

          {post.image && (
            <div className="mt-4 relative max-w-[160px] rounded overflow-hidden">
              <img
                src={
                  typeof post.image === "string"
                    ? post.image
                    : URL.createObjectURL(post.image)
                }
                alt="preview"
                className="w-full h-32 object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={() => setPost((prev) => ({ ...prev, image: "" }))}
                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold ${
            submitLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPostAdmin;
