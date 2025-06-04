import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "axios";

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts.");
      navigate("/login");
      return;
    }

    try {
      // Optimistic UI update (optional)
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              }
            : p
        )
      );
    

      // Call backend API
      const res = await api.post(
        `http://localhost:3000/api/user/profile/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Like/Unlike response:", res.data);

      const updatedLikes = res.data.likes || [];

      // Update posts state with fresh data
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const userLiked = updatedLikes.includes(profile._id);
            return {
              ...p,
              liked: userLiked,
              likes: updatedLikes.length,
            };
          }
          return p;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to like/unlike post.");
      // Revert optimistic UI update if needed
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                liked: p.liked,
                likes: p.likes,
              }
            : p
        )
      );
    }
  };

  const handleComment = async (postId, commentText) => {
  try {
    console.log("Posting comment:", commentText, "for post:", postId);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to comment on posts.");
      navigate("/login");
      return;
    }

    const res = await api.post(
      `http://localhost:3000/api/user/profile/comment/${postId}`,
      { comment: commentText },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const newComment = res.data.comment; // Ensure backend sends back the created comment

    // 🔄 Update state locally
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );

    console.log("Comment posted and state updated.");

  } catch (error) {
    alert(error.response?.data?.message || "Failed to comment on post.");
    console.error("Error commenting on post:", error);
  }
};

  useEffect(() => {
    console.log("[useEffect] userId param changed:", userId);

    const fetchPublicProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("[fetchPublicProfile] Retrieved token:", token);

      if (!token) {
        console.warn("[fetchPublicProfile] No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        console.log("[fetchPublicProfile] Fetching profile for userId:", userId);

        const res = await api.get(
          `http://localhost:3000/api/user/profile/public-profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Full API Response:", res.data);

        const fetchedUser = res.data.user;
        const userIdFromResponse = fetchedUser?._id;

        setProfile(fetchedUser);

        setPosts(
          (res.data.posts || []).map((post) => ({
            ...post,
            likes: Array.isArray(post.likes) ? post.likes.length : post.likes,
            liked:
              userIdFromResponse && Array.isArray(post.likes)
                ? post.likes.includes(userIdFromResponse)
                : post.liked || false,
          }))
        );

        console.log("👤 Profile set:", fetchedUser);
        console.log("📝 Posts set:", res.data.posts);
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        console.error("❌ Error fetching profile:", msg);
        setError(msg);
      } finally {
        setLoading(false);
        console.log("[fetchPublicProfile] Loading complete");
      }
    };

    fetchPublicProfile();
  }, [userId, navigate]);

  console.log("[Render] loading:", loading);
  console.log("[Render] error:", error);
  console.log("[Render] profile:", profile);
  console.log("[Render] posts:", posts);

  if (loading) {
    return (
      <p className="text-center mt-20 font-semibold text-cyan-500 animate-pulse">
        Loading public profile...
      </p>
    );
  }

  if (error) {
    return <p className="text-center mt-20 font-semibold text-red-600">{error}</p>;
  }

  if (!profile) {
    return (
      <p className="text-center mt-20 italic text-gray-500">No profile found.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans bg-gradient-to-r via-white min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 max-w-3xl mx-auto border border-cyan-200">
        <img
          src={profile.image || defaultAvatar}
          alt={`${profile.name || "User"}'s profile`}
          className="w-36 h-36 rounded-full border-8 border-cyan-400 shadow-lg object-cover mx-auto"
        />
        <h1 className="text-4xl font-extrabold text-cyan-700 tracking-wide">
          {profile.name}
        </h1>
        <p className="text-cyan-500 font-medium">{profile.email}</p>
        <p className="text-gray-700 italic max-w-xl mx-auto">
          {profile.bio || "No bio available."}
        </p>
        <p className="text-cyan-600 font-semibold">
          <span className="underline">Skills:</span>{" "}
          {profile.skills?.length > 0 ? profile.skills.join(", ") : "None"}
        </p>
        <div className="flex justify-center flex-wrap gap-6 mt-4">
          {profile.socialLinks &&
            Object.entries(profile.socialLinks).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-800 transition font-semibold uppercase tracking-wide"
              >
                {key}
              </a>
            ))}
        </div>
      </div>
      <div className="text-center mt-6">
  <button
    onClick={() => navigate("/profile")}
    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200"
  >
    View My Profile
  </button>
</div>

    <section className="mt-12 max-w-4xl mx-auto space-y-10">
  <h2 className="text-3xl font-bold text-cyan-700 border-b-4 border-cyan-400 pb-2">
    {profile.name}'s Posts
  </h2>

  {posts.length === 0 ? (
    <p className="italic text-gray-500 text-center">No posts available.</p>
  ) : (
    posts.map((post) => (
      <div
        key={post._id}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-cyan-100"
      >
                      <p className="text-gray-700">{post.title}</p>
        <img
          src={post.img?.[0] || defaultAvatar}
          alt={post.alt || "Post Image"}
          className="w-full h-64 object-cover rounded-xl"
        />
                  <p className="text-gray-700">{post.desc || ""}</p>

   <p className="text-sm text-cyan-500 font-medium">
                Location: {post.location || "None"}
              </p>
               <p className="text-sm text-cyan-500 font-medium">
                Caption: {post.caption || "None"}
              </p>
        <p className="text-sm text-cyan-500 font-medium">
          Hashtags: {post.hashtags || "None"}
        </p>
        <p className="text-sm text-cyan-400 italic">
          Tagged: {post.tags || "None"}
        </p>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => toggleLike(post._id)}
            className={`font-bold text-sm transition ${
              post.liked ? "text-pink-600" : "text-gray-500"
            }`}
          >
            {post.liked ? "♥ Liked" : "♡ Like"}
          </button>
          <span className="text-cyan-500 font-medium">
            {post.likes} {post.likes === 1 ? "like" : "likes"}
          </span>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
  <h3 className="text-cyan-700 font-semibold mb-2">
    Comments ({post.comments?.length || 0})
  </h3>

  {/* Existing Comments */}
  {post.comments && post.comments.length > 0 ? (
    <ul className="max-h-40 overflow-y-auto space-y-3 mb-4">
      {post.comments.map((comment, index) => {
        if (!comment || typeof comment !=="object") return null;
        return (
          <li
            key={comment._id || comment.createdAt || index}
            className="border rounded-lg p-3 bg-cyan-50"
          >
            <p className="text-sm font-medium text-cyan-700">{comment.name}</p>
            <p className="text-gray-700">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </li>
        );
})}
    </ul>
  ) : (
    <p className="text-gray-400 italic mb-4">
      No comments yet. Be the first to comment!
    </p>
  )}

  {/* Add Comment Input */}
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      console.log("Submitting comment for post:");
      const commentText = commentInputs[post._id]?.trim();
      if (!commentText) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to comment.");
        navigate("/login");
        return;
      }

      try {
        const res = await api.post(
          `http://localhost:3000/api/user/profile/comment/${post._id}`,
          { comment: commentText },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newComment = res.data.comment; // Adjust if your API returns differently

        // Immediately update the local post state with the new comment
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? { ...p, comments: [...p.comments, newComment] }
              : p
          )
        );

        // Clear the input
        setCommentInputs((prev) => ({ ...prev, [post._id]: "" }));
      } catch (error) {
        alert(error.response?.data?.message || "Failed to comment.");
        console.error(error);
      }
    }}
    className="flex space-x-3"
  >
    <input
      type="text"
      placeholder="Add a comment..."
      value={commentInputs[post._id] || ""}
      onChange={(e) =>
        setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
      }
      className="flex-grow border border-cyan-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      required
    />
    <button
      type="submit"
      className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-5 py-2 font-semibold transition"
    >
      Post
    </button>
  </form>
</div>

      </div>
    ))
  )}
</section>

    </div>
  );
};

export default PublicProfilePage;