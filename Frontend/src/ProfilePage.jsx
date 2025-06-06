import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "axios";

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);


  const [posts, setPosts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile?.image || defaultAvatar);
  // const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await api.get("http://localhost:3000/api/user/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.profile);
      } catch (err) {
        setErrorProfile(err.response?.data?.message || err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await api.get("http://localhost:3000/api/user/profile/post_get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const postsWithExtras = res.data.post.map((post) => ({
          ...post,
          liked: post.liked || false, // Adjust based on backend if needed
          image: post.img?.[0] || defaultAvatar,
          description: post.desc || "",
          hashtags: post.hashtags || "",
          taggedPeople: post.tags || "",
          altText: post.alt || "",
          likes: post.likes || 0,
        }));
        // console.log("Fetched posts:", postsWithExtras);

        setPosts(postsWithExtras);
      } catch (err) {
        setErrorPosts(err.response?.data?.message || err.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setErrorUsers(null);
      return;
    }

    const token = localStorage.getItem("token");
    const delayDebounceFn = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          setLoadingUsers(true);
          setErrorUsers(null);
          const res = await api.get(
            `http://localhost:3000/api/user/profile/search?search=${encodeURIComponent(searchQuery)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSearchResults(res.data || []);
        } catch (err) {
          setErrorUsers(err.response?.data?.message || err.message);
          setSearchResults([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchSearchResults();
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  const handleEditClick = () => {
    navigate("/edit-profile", { state: { profileData: profile } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts.");
      navigate("/login");
      return;
    }

    // Optimistically update the UI
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

    try {
      const res = await api.post(
        `http://localhost:3000/api/user/profile/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("✅ Like/Unlike response:", res.data);

      const updatedLikes = res.data.likes || [];

      // Update with actual server response
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              liked: updatedLikes.includes(profile._id),
              likes: updatedLikes,
            }
            : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to like/unlike post.");

      // Revert the optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              liked: p.liked, // fallback to original state (same value as before)
              likes: p.likes, // fallback to original state
            }
            : p
        )
      );
    }
  };


  const handleComment = async (postId, commentText) => {
    try {
      // console.log("Posting comment:", commentText, "for post:", postId);

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

      // console.log("Comment posted and state updated.");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to comment on post.");
      // console.error("Error commenting on post:", error);
    }
  };


  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`http://localhost:3000/api/user/profile/post_delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
    }
  };
  const handleImageUpload = async () => {
  if (!selectedImage) return alert("Please select an image");

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const res = await api.post(
      "http://localhost:3000/api/user/profile/upload-image", // adjust if your endpoint differs
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Optionally update state with uploaded image URL from backend
    setPreviewImage(res.data.image);
    alert("Profile image uploaded successfully!");
  } catch (error) {
    console.error("Upload error:", error);
    alert(error.response?.data?.message || "Failed to upload image");
  }
};


  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans bg-gradient-to-r via-white min-h-screen">
      {/* Search Section */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="🔍 Search people by name or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-cyan-300 focus:border-cyan-500 focus:ring-cyan-300 rounded-xl shadow-md px-5 py-3 text-gray-700 placeholder-gray-400 transition focus:outline-none"
        />
        {searchQuery && (
          <div className="absolute z-20 left-0 right-0 bg-white rounded-b-xl shadow-lg mt-1 max-h-64 overflow-y-auto border border-t-0 border-cyan-300">
            {loadingUsers ? (
              <p className="p-4 text-center text-cyan-500 font-medium animate-pulse">Loading users...</p>
            ) : errorUsers ? (
              <p className="p-4 text-center text-red-500 font-semibold">{errorUsers}</p>
            ) : searchResults.length === 0 ? (
              <p className="p-4 text-center text-gray-500 italic">No users found.</p>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-4 p-3 border-b border-cyan-100 hover:bg-cyan-50 cursor-pointer transition"
                  onClick={() => navigate(`/public-profile/${user.userId}`)}
                >
                  <img
                    src={user.image || defaultAvatar}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-300"
                  />
                  <div>
                    <p className="font-semibold text-cyan-700">{user.name}</p>
                    <p className="text-sm text-cyan-400">{user.skills?.join(", ")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Profile Info */}
      {loadingProfile ? (
        <p className="text-center text-lg mt-20 text-cyan-500 animate-pulse font-semibold">Loading profile...</p>
      ) : errorProfile ? (
        <p className="text-center text-red-600 mt-20 font-semibold">{errorProfile}</p>
      ) : profile ? (
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 max-w-3xl mx-auto border border-cyan-200">
          <img
            src={profile.image || defaultAvatar}
            alt="Profile"
            className="w-36 h-36 rounded-full border-8 border-cyan-400 shadow-lg object-cover mx-auto"
          />

          
          <h1 className="text-4xl font-extrabold text-cyan-700 tracking-wide">{profile.name}</h1>
          <p className="text-cyan-500 font-medium">{profile.email}</p>
          <p className="text-gray-700 italic max-w-xl mx-auto">{profile.bio || "No bio available."}</p>
          <p className="text-cyan-600 font-semibold">
            <span className="underline">Skills:</span> {profile.skills?.join(", ") || "None"}
          </p>
          {/* <div className="flex justify-center flex-wrap gap-6 mt-4">
            {profile.socialLinks && 
              Object.entries(profile.socialLinks).map(([key, url]) => (
                <a
                  key={key}
                  href={url || "" }
                  // {console.log("Social link:", key, url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:text-cyan-800 transition font-semibold uppercase tracking-wide"
                >
                  {key}
                </a>
              ))}{console.log("Social Links:", profile.socialLinks)}
          </div> */}
          <div className="flex justify-center flex-wrap gap-6 mt-4">
            {profile.socialLinks &&
              Object.entries(profile.socialLinks)
                .filter(([_, url]) => url) // ✅ filters out empty, null, undefined
                .map(([key, url]) => (
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
            {/* {console.log("Social Links:", profile.socialLinks)} */}
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <button
              onClick={handleEditClick}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}

      {/* Posts Section */}
      <section className="mt-12 max-w-4xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-cyan-700 border-b-4 border-cyan-400 pb-2">
          My Posts
        </h2>
        <button
          onClick={() => navigate("/create-post")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition mb-4 ml-[700px]"
        >
          + Create New Post
        </button>

        {loadingPosts ? (
          <p className="text-center text-cyan-500 font-semibold animate-pulse">Loading posts...</p>
        ) : errorPosts ? (
          <p className="text-center text-red-500 font-semibold">{errorPosts}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 italic">No posts yet. Start sharing something!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border border-cyan-100"
            >
              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-cyan-600 text-xl"
                >
                  ⋮
                </button>

                {openMenuId === post._id && (
                  <div className="absolute top-10 right-3 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        navigate(`/edit-post/${post._id}`);
                      }}
                      className="block px-4 py-2 text-sm text-cyan-700 hover:bg-cyan-50 w-full text-left"
                    >
                      ✏️ Edit Post
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 font-semibold text-lg">{post.title}</p>
              <img
                src={post.image || defaultAvatar}
                alt={post.alt || "Post Image"}
                className="w-full h-64 object-cover rounded-xl"
              />
              <p className="text-gray-700">{post.description}</p>
              <p className="text-sm text-cyan-500 font-medium">Location: {post.location || "None"}</p>
              <p className="text-sm text-cyan-500 font-medium">Caption: {post.caption || "None"}</p>
              <p className="text-sm text-cyan-500 font-medium">Hashtags: {post.hashtags || "None"}</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => toggleLike(post._id)}
                  className={`font-bold text-sm transition ${post.liked ? "text-pink-600" : "text-gray-500"
                    }`}
                >
                  {post.liked ? "♥ Liked" : "♡ Like"}
                </button>
                <span className="text-cyan-500 font-medium">
                  {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                </span>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold text-sm px-4 py-2 rounded-full"
                >
                  Delete
                </button>
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
                      if (!comment || typeof comment !== "object") return null;
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

export default ProfilePage;