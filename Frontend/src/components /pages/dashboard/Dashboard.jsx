  import { useState, useEffect } from "react";
  import {
    FiHeart,
    FiMessageCircle,
    FiChevronDown,
    FiChevronUp,
    FiSun,
    FiMoon,
  } from "react-icons/fi";
  import * as React from "react";
  import Pagination from "@mui/material/Pagination";
  import Stack from "@mui/material/Stack";
  import "./dashboard.css";
  import { useTheme } from "@/Context/ThemeContext";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { jwtDecode } from "jwt-decode";

  export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("images");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [showComments, setShowComments] = useState({});
    const [posts, setPosts] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
      const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("none"); // none | likes | comments
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");

    const token2 = localStorage.getItem("token");
    const decoded = token2 ? jwtDecode(token2) : null;
    const userId = decoded?.id;

  const sortPosts = (list) => {
    if (filter === "liked") {
      return [...list].sort((a, b) => b.likes.length - a.likes.length);
    } else if (filter === "commented") {
      return [...list].sort((a, b) => b.comments.length - a.comments.length);
    }
    return list;
  };
  

    const imagePosts = posts.filter((post) => post.image);
    const thoughtPosts = posts.filter((post) => !post.image);
    const postsPerPage = 4;

    const getFilteredPosts = () => {
      let basePosts =
        activeSection === "images" ? [...imagePosts] : [...thoughtPosts];

      if (filter === "likes") {
        basePosts.sort((a, b) => b.likes.length - a.likes.length);
      } else if (filter === "comments") {
        basePosts.sort((a, b) => b.comments.length - a.comments.length);
      }

      return basePosts;
    };

    const currentPosts = getFilteredPosts().slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    );

    useEffect(() => {
      document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const toggleLike = async (postId) => {
      if (!token) {
        alert("Please login to like posts.");
        navigate("/login");
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
            : post
        )
      );

      try {
        const res = await axios.post(
          `http://localhost:3000/api/user/profile/like/${postId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedLikes = res.data.likes;

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: updatedLikes } : post
          )
        );
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to like/unlike post.");
      }
    };

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/user/profile/getAllPost",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const rawPosts = response.data.posts;

          const transformed = rawPosts.map((post) => ({
            id: post._id,
            username: post.userId?.name || "Unknown",
            title: post.title,
            image: post.img?.[0] || "",
            description: post.desc,
            location: post.location,
            caption: post.caption,
            hashtags: post.hashtags,
            timestamp: new Date(post.createdAt).toLocaleString(),
            likes: post.likes || [],
            comments: post.comments || [],
          }));

          setPosts(transformed);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }, [token]);

    const handleDeletePost = (id) => {
      setPosts((prev) => prev.filter((post) => post.id !== id));
      setOpenMenuId(null);
    };

    const toggleComments = (id) => {
      setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCommentSubmit = async (e, postId) => {
      e.preventDefault();
      const commentText = commentInputs[postId]?.trim();
      if (!commentText) return;

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

        const updatedComments = response.data.comments;

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, comments: updatedComments } : post
          )
        );

        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      } catch (error) {
        console.error("Failed to post comment:", error);
        alert(error.response?.data?.message || "Failed to post comment.");
      }
    };

    const renderPostCard = (post, index) => (
     <div
  key={post.id}
  className="post-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
>

        <div className="post-header">
          <div className="flex items-center gap-3">
            <div>
              <p className="post-username">{post.username}</p>
              <p className="post-time">{post.timestamp}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
              className="text-xl text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
            >
              ⋮
            </button>
            {openMenuId === post.id && (
              <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md w-32 z-10">
                <button
                  onClick={() => alert("Edit coming soon")}
                  className="block w-full px-4 py-2 text-sm text-indigo-500 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  ✏️ Edit Post
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="post-title">{post.title}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            onError={(e) => (e.target.src = "/default-image.jpg")}
            className="w-full h-64 object-cover rounded-xl mt-2"
          />
        )}
        <p className="post-description">{post.description}</p>

        {expandedPostId === post.id ? (
          <>
            <p className="extra-info">📍 {post.location}</p>
            <p className="extra-info">📝 {post.caption}</p>
            <p className="extra-info">🏷️ {post.hashtags}</p>
            <div className="toggle-info-btn" onClick={() => setExpandedPostId(null)}>
              Show Less
            </div>
          </>
        ) : (
          <div className="toggle-info-btn" onClick={() => setExpandedPostId(post.id)}>
            Show More
          </div>
        )}

        <div className="action-row">
          <div
            className={`like-btn ${post.likes.includes(userId) ? "liked" : ""}`}
            onClick={() => toggleLike(post.id)}
          >
            <FiHeart />
            {post.likes.includes(userId) ? "Liked" : "Like"}
          </div>
          <span className="likes-count">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </span>
        </div>

        <div className="comments-section">
          <div className="flex justify-between items-center">
            <h3 className="text-indigo-500 dark:text-indigo-300 font-semibold">
              Comments ({post.comments.length})
            </h3>
            <button
              onClick={() => toggleComments(post.id)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              {showComments[post.id] ? (
                <>
                  <FiChevronUp /> Hide
                </>
              ) : (
                <>
                  <FiChevronDown /> Show
                </>
              )}
            </button>
          </div>

          {showComments[post.id] && (
            <>
              {post.comments.length === 0 ? (
                <p className="text-gray-500 italic mb-4 dark:text-gray-400">
                  No comments yet.
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment._id} className="comment mt-3">
                    <p className="comment-name">{comment.name}</p>
                    <p className="comment-text">{comment.text}</p>
                    <p className="comment-meta">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}

              <form
                onSubmit={(e) => handleCommentSubmit(e, post.id)}
                className="flex space-x-3 mt-2"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  className="flex-grow border border-cyan-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
                <button
                  type="submit"
                  disabled={!commentInputs[post.id]?.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-5 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );

    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button className="toggle-mode-btn" onClick={toggleTheme}>
            {darkMode ? (
              <>
                <FiSun /> <span>Light Mode</span>
              </>
            ) : (
              <>
                <FiMoon /> <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="section-tabs">
          <button
            className={activeSection === "images" ? "active-tab" : ""}
            onClick={() => {
              setActiveSection("images");
              setCurrentPage(1);
            }}
          >
            📸 Image Posts
          </button>
          {thoughtPosts.length > 0 && (
            <button
              className={activeSection === "thoughts" ? "active-tab" : ""}
              onClick={() => {
                setActiveSection("thoughts");
                setCurrentPage(1);
              }}
            >
              💭 Thoughts
            </button>
          )}
        </div>

    <div className="relative flex justify-center my-4 bottom-0 ml-[725px]">
  <button
    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
    className="px-4 py-2 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition"
  >
    Filter Posts ▾
  </button>
  {filterDropdownOpen && (
    <div className="absolute top-12 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg w-48 z-20">
      <button
        className={`w-full px-4 py-2 text-left hover:bg-indigo-100 dark:hover:bg-gray-700 ${
          filter === "none" ? "text-indigo-600 font-semibold" : ""
        }`}
        onClick={() => {
          setFilter("none");
          setCurrentPage(1);
          setFilterDropdownOpen(false);
        }}
      >
        🆕 Recent
      </button>
      <button
        className={`w-full px-4 py-2 text-left hover:bg-indigo-100 dark:hover:bg-gray-700 ${
          filter === "likes" ? "text-indigo-600 font-semibold" : ""
        }`}
        onClick={() => {
          setFilter("likes");
          setCurrentPage(1);
          setFilterDropdownOpen(false);
        }}
      >
        ❤️ Most Liked
      </button>
      <button
        className={`w-full px-4 py-2 text-left hover:bg-indigo-100 dark:hover:bg-gray-700 ${
          filter === "comments" ? "text-indigo-600 font-semibold" : ""
        }`}
        onClick={() => {
          setFilter("comments");
          setCurrentPage(1);
          setFilterDropdownOpen(false);
        }}
      >
        💬 Most Commented
      </button>
    </div>
  )}
</div>

        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading posts...</p>
        ) : currentPosts.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-10">No posts to show.</p>
        ) : (
          <>
            {currentPosts.map(renderPostCard)}

            {getFilteredPosts().length > postsPerPage && (
              <Stack spacing={2} className="mt-6 items-center justify-center">
                <Pagination
                  count={Math.ceil(getFilteredPosts().length / postsPerPage)}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="secondary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: darkMode ? '#E0E0E0' : '#333',
                      backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
                      border: '1px solid',
                      borderColor: darkMode ? '#374151' : '#cbd5e1',
                    },
                    '& .Mui-selected': {
                      backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: darkMode ? '#2563eb' : '#1d4ed8',
                      },
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: darkMode ? '#374151' : '#e2e8f0',
                    },
                  }}
                />
              </Stack>
            )}
          </>
        )}
      </div>
    );
  }
