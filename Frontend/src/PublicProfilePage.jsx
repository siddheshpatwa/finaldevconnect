import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure you use axios directly for consistent API calls
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- REQUIRED: Import jwtDecode

// --- Icon Imports ---
import { FiHeart, FiChevronDown, FiChevronUp } from "react-icons/fi"; // Feather icons
import { FaHeart } from "react-icons/fa"; // Font Awesome filled heart

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

const PublicProfilePage = () => {
  const { userId: publicProfileOwnerId } = useParams(); // Renamed for clarity: this is the ID of the profile being viewed
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({}); // State to manage visibility of comments for each post

  // Loading/Error states for the profile itself
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  // Loading/Error states specifically for the posts section
  const [loadingPosts, setLoadingPosts] = useState(false); // Initial state can be false as it will be set true in useEffect
  const [errorPosts, setErrorPosts] = useState(null);

  const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(null); // To store the ID of the user currently logged in

  // --- useEffect to fetch profile and posts ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setCurrentLoggedInUserId(decoded.id); // Set the ID of the logged-in user
    } catch (e) {
      console.error("Failed to decode token:", e);
      // If token is invalid, clear it and redirect
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const fetchPublicProfileAndPosts = async () => {
      setLoadingProfile(true);
      setLoadingPosts(true);
      setErrorProfile(null);
      setErrorPosts(null);

      try {
        const res = await axios.get( // Using axios directly for consistency
          `http://localhost:3000/api/user/profile/public-profile/${publicProfileOwnerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedProfileData = res.data.profile?.[0]; // Assuming backend returns an array
        setProfile(fetchedProfileData);

        // Process posts data from the backend
        const processedPosts = (res.data.posts || []).map((post) => {
          const likesArray = Array.isArray(post.likes) ? post.likes : []; // Ensure likes is an array of user IDs
          const likedByCurrentUser = likesArray.includes(currentLoggedInUserId); // Check if *current logged-in user* liked it

          return {
            ...post,
            // Ensure post.image is always available (either from img[0] or default)
            image: post.img?.[0] || defaultAvatar,
            // Ensure description is from 'desc' field
            description: post.desc || "",
            // Ensure comments is an array
            comments: Array.isArray(post.comments) ? post.comments : [],
            // Add a 'liked' boolean flag for easy UI rendering
            liked: likedByCurrentUser,
            // likes property already contains the array of user IDs from backend
          };
        });
        setPosts(processedPosts);

      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load profile or posts.";
        setErrorProfile(msg);
        setErrorPosts(msg); // Set error for posts section as well
        console.error("Error fetching public profile:", err);
      } finally {
        setLoadingProfile(false);
        setLoadingPosts(false);
      }
    };

    if (currentLoggedInUserId) { // Only fetch if we have the current user's ID
        fetchPublicProfileAndPosts();
    }
  }, [publicProfileOwnerId, navigate, currentLoggedInUserId]); // Add currentLoggedInUserId to dependencies

  // --- Like/Comment Functions ---

  const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token || !currentLoggedInUserId) { // Ensure logged-in user ID is available
      alert("Please login to like posts.");
      navigate("/login");
      return;
    }

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id === postId) {
          const isCurrentlyLiked = p.likes.includes(currentLoggedInUserId);
          const newLikesArray = isCurrentlyLiked
            ? p.likes.filter((id) => id !== currentLoggedInUserId)
            : [...p.likes, currentLoggedInUserId];
          return {
            ...p,
            likes: newLikesArray, // Update the array of user IDs
            liked: !isCurrentlyLiked, // Toggle the boolean flag
          };
        }
        return p;
      })
    );

    try {
      const res = await axios.post( // Use axios directly
        `http://localhost:3000/api/user/profile/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedLikesFromServer = res.data.likes || []; // Backend should return the *array* of user IDs who liked it

      // Revert/confirm with actual server response
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: updatedLikesFromServer,
                liked: updatedLikesFromServer.includes(currentLoggedInUserId),
              }
            : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to like/unlike post.");
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            // Revert likes based on the state *before* the failed optimistic update
            const wasLiked = p.likes.includes(currentLoggedInUserId); // This 'p.likes' already reflects the optimistic update
            const revertedLikes = wasLiked
              ? p.likes.filter((id) => id !== currentLoggedInUserId)
              : [...p.likes, currentLoggedInUserId];
            return {
              ...p,
              likes: revertedLikes,
              liked: !wasLiked, // Revert the boolean flag
            };
          }
          return p;
        })
      );
    }
  };

  const toggleComments = (postId) => { // Renamed param to postId for clarity
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to comment.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/profile/comment/${postId}`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming backend returns the *updated comments array* for that post
      const updatedComments = response.data.comments;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" })); // Clear the input field
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert(error.response?.data?.message || "Failed to post comment.");
    }
  };

  // --- Render Logic ---

  if (loadingProfile) {
    return (
      <p className="text-center mt-20 font-semibold text-cyan-500 animate-pulse">
        Loading public profile...
      </p>
    );
  }

  if (errorProfile) {
    return <p className="text-center mt-20 font-semibold text-red-600">{errorProfile}</p>;
  }

  if (!profile) {
    return (
      <p className="text-center mt-20 italic text-gray-500">No profile found for this user.</p>
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
            Object.entries(profile.socialLinks)
              .filter(([_, url]) => url?.trim())
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:text-cyan-800 transition font-semibold uppercase tracking-wide"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ))}
        </div>
      </div>

      {/* Button to view current logged-in user's profile */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/profile")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-200"
        >
          View My Profile
        </button>
      </div>

      {/* --- Posts Section --- */}
      <section className="mt-12 max-w-4xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-cyan-700 border-b-4 border-cyan-400 pb-2">
          {profile.name}'s Posts
        </h2>

        {loadingPosts ? (
          <p className="text-center text-cyan-500 font-semibold animate-pulse">Loading posts...</p>
        ) : errorPosts ? (
          <p className="text-center text-red-500 font-semibold">{errorPosts}</p>
        ) : posts.length === 0 ? (
          <p className="italic text-gray-500 text-center">This user has no posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-cyan-100"
            >
              <p className="text-gray-700 font-semibold text-lg">{post.title}</p>
              <img
                src={post.image} 
                alt={post.alt || "Post Image"}
                className="w-full h-64 object-cover rounded-xl"
              />
              <p className="text-gray-700">{post.description}</p> {/* Use post.description */}

              {post.location && (
                <p className="text-sm text-cyan-500 font-medium">Location: {post.location}</p>
              )}
              {post.caption && (
                <p className="text-sm text-cyan-500 font-medium">Caption: {post.caption}</p>
              )}
              {post.hashtags && (
                <p className="text-sm text-cyan-500 font-medium">
                  Hashtags:{" "}
                  {post.hashtags.split(",").map((tag, index) => (
                    <span key={index} className="inline-block bg-cyan-100 rounded-full px-2 py-0.5 text-xs mr-1">
                      #{tag.trim()}
                    </span>
                  ))}
                </p>
              )}
           


              <div className="flex items-center justify-between mt-4 border-t pt-4 border-cyan-100 flex-wrap gap-y-4">
                {/* Like Button and Count */}
                <div
                  className="flex items-center space-x-2 cursor-pointer select-none group"
                  onClick={() => toggleLike(post._id)}
                >
                  {post.liked ? ( // Use 'post.liked' for visual state
                    <FiHeart className="text-pink-600 text-2xl transition-transform group-hover:scale-110" />
                  ) : (
                    <FiHeart className="text-gray-500 text-2xl group-hover:text-pink-600 transition-transform group-hover:scale-110" />
                  )}
                  <span
                    className={`font-semibold text-lg ${
                      post.liked ? "text-pink-600" : "text-gray-600"
                    }`}
                  >
                    {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                  </span>
                </div>

                {/* Comment Toggle and Count */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 font-semibold transition"
                  >
                    Comments ({post.comments.length}){" "}
                    {showComments[post._id] ? (
                      <FiChevronUp className="text-xl" />
                    ) : (
                      <FiChevronDown className="text-xl" />
                    )}
                  </button>
                </div>
                {/* Removed delete button */}
              </div>

              {/* Expanded Comments Section */}
              {showComments[post._id] && (
                <div className="comments-section mt-4 pt-4 border-t border-gray-100">
                  {post.comments.length === 0 ? (
                    <p className="text-gray-500 italic mb-4 text-center">No comments yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="comment bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="font-semibold text-gray-800 flex items-center">
                            {/* Ensure comment.user.name or comment.name is available */}
                            {/* <img
                              src={comment.user?.avatar || defaultAvatar} // Assuming comment has a 'user' object with 'avatar'
                              alt="Commenter Avatar"
                              className="w-8 h-8 rounded-full mr-2 object-cover"
                            /> */}
                            {comment.user?.name || comment.name || "Anonymous"}
                          </p>
                          <p className="text-gray-700 mt-1">{comment.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input Form */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    className="flex space-x-3 mt-5"
                  >
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="flex-grow border border-cyan-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-700 placeholder-gray-400"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post._id]?.trim()}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-5 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default PublicProfilePage;