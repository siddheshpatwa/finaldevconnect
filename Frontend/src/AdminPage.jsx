import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FiTrash2,
  FiSearch,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLink,
} from "react-icons/fi";
import api from "axios";

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    // console.log("Component mounted, fetching posts and users...");
    fetchPosts();
    fetchUsers();
  }, []);
  const navigate = useNavigate();



  const fetchPosts = async () => {
    try {
      console.log("Fetching posts from /api/admin/post...");
      const res = await fetch("http://localhost:3000/api/admin/post");
      const data = await res.json();
      // console.log("Fetched posts:", data);
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        // console.log("Posts state updated.");
      } else {
        // console.warn("Unexpected post data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      // console.log("Fetching users from /api/admin/profile...");
      const res = await fetch("http://localhost:3000/api/admin/profile");
      const data = await res.json();
      console.log("Fetched profile:", data);
     if (data.posts && Array.isArray(data.posts)) {
  setUsers(data.posts);

        // console.log("Users state updated 1:", data.users);
        // console.log("Users state updated.");
      } else {
        // console.warn("Unexpected user data structure:", data);
      }
    } catch (error) {
      // console.error("Error fetching users:", error);
    }
  };
const deletePost = async (postId) => {
  try {
    const response = await api.delete(`http://localhost:3000/api/admin/deletePost/${postId}`);

    if (response.status === 200 || response.status === 204) {
      // console.log(`Post ${postId} deleted successfully.`);

      // Remove post from state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } else {
      // console.error("Failed to delete post:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
  }
};
  // const deletePost = (postId) => {
  //   console.log(`Attempting to delete post with ID: ${postId}`);
  //   if (!window.confirm("Are you sure you want to delete this post?")) {
  //     console.log("Post deletion cancelled.");
  //     return;
  //   }
  //   setPosts((prev) => {
  //     const updated = prev.filter((post) => post._id !== postId);
  //     console.log("Post deleted. Updated posts:", updated);
  //     return updated;
  //   });
  // };

  // const deleteUser = async(userId) => {
        // const response = await axios.delete(`http://localhost:3000/api/admin/deleteProfile/${userId}`);
  //   console.log(`Attempting to delete user with ID: ${userId}`);
  //   if (!window.confirm("Are you sure you want to delete this user?")) {
  //     console.log("User deletion cancelled.");
  //     return;
  //   }
  //   setUsers((prev) => {
  //     const updated = prev.filter((user) => user._id !== userId);
  //     console.log("User deleted. Updated users:", updated);
  //     return updated;
  //   });
  // };


//  const deleteUser = async (userId) => {
//   try {
//     console.log(`Attempting to delete user with userId: ${userId}`);

//     const response = await axios.delete(`http://localhost:3000/api/admin/deleteProfile/${userId}`);

//     if (response.status === 200 || response.status === 204) {
//       console.log(`User ${userId} deleted successfully.`);
//       setUsers((prevUsers) => prevUsers.filter((user) => user.userId._id !== userId));
//     } else {
//       console.error("Failed to delete user:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error.response?.data || error.message);
//   }
// };


// const deleteUser = async (userId) => {
//   if (!window.confirm("Are you sure you want to delete this user and all their posts?")) {
//     return;
//   }
//   try {
//     const response = await api.delete(`http://localhost:3000/api/admin/deleteProfile/${userId}`);
//     if (response.status === 200 || response.status === 204) {
//       console.log(`User ${userId} deleted successfully.`);
//       // fetchPosts();
//       // fetchUsers();

//     }
//   } catch (error) {
//     console.error("Error deleting user:", error.response?.data || error.message);
//   }
// };

const deleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user and all their posts?")) {
    return;
  }

  try {
    const response = await api.delete(`http://localhost:3000/api/admin/deleteProfile/${userId}`);

    if (response.status === 200 || response.status === 204) {
      console.log(`User ${userId} deleted successfully.`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId._id !== userId));

    }

  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
  }
};





  const filteredPosts = posts.filter((post) => {
    const term = postSearch.toLowerCase();
    const match =
      post.title.toLowerCase().includes(term) ||
      post.desc.toLowerCase().includes(term) ||
      post.userId?.name.toLowerCase().includes(term);
    if (match) console.log("Post matched filter:", post.title);
    return match;
  });

  const filteredUsers = users.filter((user) => {
    const term = userSearch.toLowerCase();
    const match =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    if (match) console.log("User matched filter:", user.name);
    return match;
  });  
  

  useEffect(() => {
    // console.log("Post search term changed:", postSearch);
  }, [postSearch]);

  useEffect(() => {
    // console.log("User search term changed:", userSearch);
  }, [userSearch]);

  useEffect(() => {
    // console.log("Filtered posts:", filteredPosts);
  }, [filteredPosts]);

  useEffect(() => {
    // console.log("Filtered users:", filteredUsers);
  }, [filteredUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-indigo-900 mb-10">
        Admin Dashboard
      </h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition ml-[80em]"
        >
          Login
        </button>

      {/* Users Section */}
   <section className="max-w-6xl mx-auto mb-20">
  <h2 className="text-3xl font-semibold mb-6 text-indigo-800">Profile</h2>

  <div className="flex items-center max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-8">
    <FiSearch className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search users by name or email..."
      value={userSearch}
      onChange={(e) => {
        setUserSearch(e.target.value);
        // console.log("User search input:", e.target.value);
      }}
      className="w-full outline-none text-sm bg-transparent"
    />
  </div>

  {filteredUsers.length === 0 ? (
    <p className="text-center text-gray-600 text-lg">No profile found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 relative"
        >
          <button
            onClick={() =>{
               deleteUser(user.userId._id)
               console.log(`User ${user.userId._id} deleted successfully.`)
            }
              }
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            title="Delete User"
          >
            <FiTrash2 />
          </button>

          <h3 className="text-lg font-bold text-indigo-700">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm italic text-gray-700 mt-2">
            {user.bio || "No bio available."}
          </p>

          <p className="mt-2 text-sm">
            <strong>Skills:</strong>{" "}
            {user.skills && user.skills.length > 0
              ? user.skills.join(", ")
              : "None"}
          </p>

          <div className="mt-3 flex space-x-4 text-gray-500 text-xl">
            {user.socialLinks?.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
              >
                <FiGithub />
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <FiLinkedin />
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter"
              >
                <FiTwitter />
              </a>
            )}
            {user.socialLinks?.portfolio && (
              <a
                href={user.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                title="Portfolio"
              >
                <FiLink />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      {/* Posts Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-800">Posts</h2>

        <div className="flex items-center max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-8">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search posts by title, description, or user..."
            value={postSearch}
            onChange={(e) => {
              setPostSearch(e.target.value);
              console.log("Post search input:", e.target.value);
            }}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 relative"
              >
                <button
                  onClick={() => deletePost(post._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Delete Post"
                >
                  <FiTrash2 />
                </button>

                <h3 className="text-lg font-bold text-indigo-700">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>By:</strong> {post.userId?.name || "Unknown User"}
                </p>

                {post.img && post.img.length > 0 && (
                  <img
                    src={post.img[0]}
                    alt={post.alt || "Post image"}
                    className="w-full max-h-[250px] object-cover rounded-lg mb-3"
                  />
                )}

                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {post.desc.trim()}
                </p>

                {post.caption && (
                  <p className="text-indigo-600 font-semibold mt-2">
                    Caption: {post.caption}
                  </p>
                )}

                {post.hashtags && (
                  <p className="text-sm text-indigo-500 mt-1">
                    Hashtags:{" "}
                    {post.hashtags.split(",").map((tag, i) => (
                      <span key={i} className="mr-2">
                        #{tag.trim()}
                      </span>
                    ))}
                  </p>
                )}

          

                {post.location && (
                  <p className="text-sm italic text-gray-600 mt-1">
                    Location: {post.location}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  Posted on: {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  Likes: {post.likes ? post.likes.length : 0}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No posts found.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
