import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "axios";

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`http://localhost:3000/api/user/profile/post_view/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setPost(res.data.post);
      } catch (err) {
        console.error(err);
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 text-center mt-20 text-xl font-semibold">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg border border-gray-200">
          {post.img?.length > 0 ? (
            <img
              src={post.img[0]}
              alt={post.alt || "Post image"}
              className="object-cover w-full h-full min-h-[300px] transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">
              No Image Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title || "Untitled Post"}</h1>
            <p className="text-xl text-indigo-600 font-semibold mb-4 italic">{post.caption}</p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">{post.desc}</p>

            {/* Post Metadata */}
            <div className="space-y-3 border-t border-gray-300 pt-4 text-gray-600">
              {post.hashtags && (
                <p>
                  <span className="font-semibold text-gray-800">Hashtags: </span>
                  <span className="text-indigo-500">{post.hashtags}</span>
                </p>
              )}
              {post.tagPeople && (
                <p>
                  <span className="font-semibold text-gray-800">Tagged People: </span>
                  <span className="text-indigo-500">{post.tagPeople}</span>
                </p>
              )}
              {post.location && (
                <p>
                  <span className="font-semibold text-gray-800">Location: </span>
                  <span className="text-indigo-500">{post.location}</span>
                </p>
              )}
              {post.alt && (
                <p>
                  <span className="font-semibold text-gray-800">Alt Text: </span>
                  <span className="text-indigo-500">{post.alt}</span>
                </p>
              )}
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-8 self-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            ← Back to Posts
          </button>
        </div>
      </div>

      {/* Loader styles */}
      <style>{`
        .loader {
          border-top-color: #6366f1; /* Indigo-500 */
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ViewPost;
