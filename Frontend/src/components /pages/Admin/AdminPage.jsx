import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {
  FiTrash2,
  FiSearch,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLink,
} from "react-icons/fi";
import api from "axios";
import { jwtDecode } from "jwt-decode";

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    // console.log("Component mounted, fetching posts and users...");
    fetchPosts();
    fetchUsers();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [postSearch]);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts from /api/admin/post...");
      const res = await axios.get("http://localhost:3000/api/admin/post");
      const data = res.data;

      console.log("Fetched posts:", data);
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        // console.log("Posts state updated.");
      } else {
        console.warn("Unexpected post data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };


  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/profile");
      const data = res.data;

      // console.log("Fetched profile:", data);

      if (data.posts && Array.isArray(data.posts)) {
        setUsers(data.posts);
        // console.log("Users state updated:", data.posts);
      } else {
        console.warn("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
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
      post.title?.toLowerCase().includes(term) ||
      post.desc?.toLowerCase().includes(term) ||
      post.userId?.name?.toLowerCase().includes(term) ||
      post.userId?.email?.toLowerCase().includes(term);

    if (match)
      //  console.log("Post matched filter:", post.title);
      return match;
  });


  const filteredUsers = users.filter((user) => {
    const term = userSearch.toLowerCase();
    const match =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    if (match)
      // console.log("User matched filter:", user.name);
      return match;
  });
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/admin-login");
  };

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
      console.log(`Making user ${decodedToken.userId} an admin...`);

  const makeAdmin = async (userId) => {
  try {
    const response = await axios.put("http://localhost:3000/api/admin/role", {
      role: "admin",
      userId: decodedToken.userId // Use the userId from the decoded token
    });
    console.log(`User ${userId} promoted to admin:`, response.data);
    // Optionally show a success toast or refresh data
  } catch (error) {
    console.error("Error making user admin:", error);
    // Optionally show error toast
  }
};



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
     <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition text-sm md:text-base"
    >
      <FiLogOut className="text-lg" />
      <span className="hidden sm:inline">Logout</span>
    </button>
      <h1 className="text-4xl font-bold text-center text-indigo-900 mb-10">
        Admin Dashboard
      </h1>


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
                  onClick={() => {
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
            placeholder="Search posts by title, description, or user email ..."
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
                <p className="text-sm text-gray-600 mb-2">
                  {post.userId?.email || "Unknown User"}
                </p>
                {/* {console.log("Post userId:", post)} */}

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
                <p className="text-xs text-gray-400">
                  Comments: {post.comments ? post.comments.length : 0}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No posts found.</p>
        )}
      </section>
      {/* 
      
  <div className="flex justify-center mt-10 px-4 sm:px-0">


 <Stack spacing={2}>
    <Pagination
      count={Math.ceil(filteredPosts.length / postsPerPage)}
      page={currentPage}
      onChange={(event, value) => setCurrentPage(value)}
      color="secondary"
      shape="rounded"
      size="medium"
      sx={{
        '& .MuiPaginationItem-root': {
          borderRadius: '0.75rem',
          fontWeight: 500,
          padding: '6px 12px',
          '&.Mui-selected': {
            backgroundColor: '#6366F1', // Tailwind Indigo-500
            color: 'white',
          },
          '&:hover': {
            backgroundColor: '#4F46E5', // Tailwind Indigo-600
            color: 'white',
          },
        },
      }}
    />
    </div>
  </Stack> */}

    </div>
  );
};

export default AdminPage;
