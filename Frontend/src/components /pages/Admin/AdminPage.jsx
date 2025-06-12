import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiLogOut,
  FiTrash2,
  FiSearch,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiEdit,
  FiX, // Make sure to import FiX for the modal close button
  FiUserCheck // Assuming you want this icon for 'Make Admin' functionality
} from "react-icons/fi";

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // States for the SINGLE "Edit User Role" modal
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Stores the user object being edited
  const [selectedRole, setSelectedRole] = useState(""); // Stores the selected role in the dropdown

  const navigate = useNavigate();

  // --- Current Admin ID from Token ---
  // This extracts the admin's own ID from the JWT token
  let currentAdminId = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      // Use the key that holds the user ID in your JWT payload (e.g., 'id', 'userId', or '_id')
      currentAdminId = decodedToken.id || decodedToken.userId || decodedToken._id;
    } catch (e) {
      console.error("Error decoding token or token invalid:", e);
      // If token is invalid, clear it and redirect to login
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []); // Empty dependency array means this runs once on component mount

  // --- Data Fetching Functions ---
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token for auth
      if (!token) {
        navigate("/admin-login");
        return;
      }
      const res = await axios.get("http://localhost:3000/api/admin/post", {
        headers: { Authorization: `Bearer ${token}` }, // Add auth header
      });
      const data = res.data;

      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        console.warn("Unexpected post data structure:", data);
        setPosts([]); // Ensure state is cleared if structure is wrong
      }
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token for auth
      if (!token) {
        navigate("/admin-login");
        return;
      }
      const res = await axios.get("http://localhost:3000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` }, // Add auth header
      });
      const data = res.data;

      // IMPORTANT: Based on your console log, your backend sends user profiles under 'data.posts'.
      // If it should be 'data.profiles' (which is more semantic), you need to change your backend.
      // For now, I'm using 'data.posts' to match your current backend output.
      if (data.posts && Array.isArray(data.posts)) {
        setUsers(data.posts);
      } else {
        console.warn("Unexpected user data structure. Expected 'posts' array for profiles:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  };

  // --- Delete Functions ---
  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      navigate("/admin-login");
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        alert("Post deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete post.");
    }
  };

  const deleteUser = async (userIdToDelete) => {
    if (!window.confirm("Are you sure you want to delete this user and all their posts?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      navigate("/admin-login");
      return;
    }

    // Prevent deleting self
    if (userIdToDelete === currentAdminId) {
        alert("You cannot delete your own admin account.");
        return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/deleteProfile/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.userId?._id !== userIdToDelete));
        setPosts((prevPosts) => prevPosts.filter((post) => post.userId?._id !== userIdToDelete)); // Also remove their posts
        alert("User and their posts deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };

  // --- Search Filtering ---
  const filteredPosts = posts.filter((post) => {
    const term = postSearch.toLowerCase();
    return (
      post.title?.toLowerCase().includes(term) ||
      post.desc?.toLowerCase().includes(term) ||
      post.userId?.name?.toLowerCase().includes(term) ||
      post.userId?.email?.toLowerCase().includes(term) ||
      post.location?.toLowerCase().includes(term) ||
      post.caption?.toLowerCase().includes(term) ||
      post.hashtags?.toLowerCase().includes(term)
    );
  });

  const filteredUsers = users.filter((user) => {
    const term = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.bio?.toLowerCase().includes(term) ||
      user.skills?.some(skill => skill.toLowerCase().includes(term))
    );
  });

  // --- Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/admin-login");
  };

  // --- Make Admin Function (for direct button, if you choose to keep it) ---
  const makeAdmin = async (userIdToPromote) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      navigate("/admin-login");
      return;
    }

    // Prevent an admin from changing their own role
    if (userIdToPromote === currentAdminId) {
        alert("You cannot change your own role.");
        return;
    }

    if (!window.confirm(`Are you sure you want to make this user an admin?`)) {
        return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/api/admin/role",
        {
          role: "admin",
          id: userIdToPromote, // Ensure your backend expects 'id'
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${response.data.message || 'User role updated to admin successfully!'}`);
      fetchUsers(); // Refresh the user list to show updated roles
    } catch (error) {
      console.error("Error making user admin:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to make user admin.");
    }
  };


  // --- Edit User Modal Functions ---
  const handleEditUser = (user) => {
    setEditingUser(user);
    // Pre-populate with current role, default to 'user' if not found or undefined
    setSelectedRole(user.userId?.role || "user");
    setShowEditUserModal(true); // Open the modal
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUser(null);
    setSelectedRole(""); // Reset selected role when closing
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!editingUser || !selectedRole) {
      alert("No user selected or role not chosen.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      navigate("/admin-login");
      return;
    }

    // Prevent an admin from changing their own role
    if (editingUser.userId?._id === currentAdminId) {
        alert("You cannot change your own role.");
        return;
    }

    if (!window.confirm(`Are you sure you want to change ${editingUser.name}'s role to '${selectedRole}'?`)) {
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/api/admin/role",
        {
          role: selectedRole,
          id: editingUser.userId._id, // Send the user's actual ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("User role updated successfully!");
        fetchUsers(); // Refresh the user list
        closeEditUserModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating user role:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update user role.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-6 py-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition text-sm md:text-base"
        >
          <FiLogOut className="text-lg" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center text-indigo-900 mb-10">
        Admin Dashboard
      </h1>

      {/* --- Users Section --- */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-800">User Profiles</h2>

        <div className="flex items-center max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-8">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users by name, email, bio, or skills..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No users found in the system.</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No profiles match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 relative"
              >
                {/* Action Buttons Container */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  {/* Edit User Button: Calls handleEditUser to open the proper modal */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user); // Calls the main edit function
                    }}
                    className="text-indigo-500 hover:text-indigo-700"
                    title="Edit User"
                  >
                    <FiEdit />
                  </button>

                  {/* Make Admin Button (Only if not already an admin and not self) */}
                  {user.userId?.role !== 'admin' && user.userId?._id !== currentAdminId && (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            makeAdmin(user.userId._id);
                          }}
                          className="text-green-500 hover:text-green-700"
                          title="Make Admin"
                      >
                          <FiUserCheck />
                      </button>
                  )}

                  {/* Delete User Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(user.userId._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete User"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* User Details */}
                <div>
                  <h3 className="text-lg font-bold text-indigo-700">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm italic text-gray-700 mt-2">
                    {user.bio || "No bio available."}
                  </p>

                  <p className="mt-2 text-sm">
                    <strong>Role:</strong> {user.userId?.role || "N/A"}
                  </p> {/* Display user's role */}
                  <p className="mt-2 text-sm">
                    <strong>Skills:</strong>{" "}
                    {user.skills && user.skills.length > 0
                      ? user.skills.join(", ")
                      : "None"}
                  </p>

                  <div className="mt-3 flex space-x-4 text-gray-500 text-xl">
                    {user.socialLinks?.github && (
                      <a href={user.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub" onClick={(e) => e.stopPropagation()}>
                        <FiGithub />
                      </a>
                    )}
                    {user.socialLinks?.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" onClick={(e) => e.stopPropagation()}>
                        <FiLinkedin />
                      </a>
                    )}
                    {user.socialLinks?.twitter && (
                      <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter" onClick={(e) => e.stopPropagation()}>
                        <FiTwitter />
                      </a>
                    )}
                    {user.socialLinks?.portfolio && (
                      <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" title="Portfolio" onClick={(e) => e.stopPropagation()}>
                        <FiLink />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Posts Section --- */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-800">Posts</h2>

        <div className="flex items-center max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-8">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search posts by title, description, or user email ..."
            value={postSearch}
            onChange={(e) => setPostSearch(e.target.value)}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts found in the system.</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-600 text-center">No posts match your search.</p>
        ) : (
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

                <h3 className="text-lg font-bold text-indigo-700">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>By:</strong> {post.userId?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {post.userId?.email || "Unknown User"}
                </p>

                {post.img && post.img.length > 0 && (
                  <img
                    src={post.img[0]}
                    alt={post.alt || "Post image"}
                    className="w-full max-h-[250px] object-cover rounded-lg mb-3"
                  />
                )}

                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {post.desc?.trim()}
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
                      <span key={i} className="mr-2">#{tag.trim()}</span>
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
        )}
      </section>

      {/* --- The SINGLE "Edit User Role" Modal (Rendered conditionally) --- */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              onClick={closeEditUserModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              title="Close"
            >
              <FiX />
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-6">
              Edit User Role
            </h3>

            <form onSubmit={handleRoleUpdate} className="space-y-4">
              <div>
                <label htmlFor="editName" className="block text-gray-700 text-sm font-bold mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editingUser.name || ''}
                  disabled // Disable editing
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="editEmail" className="block text-gray-700 text-sm font-bold mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  id="editEmail"
                  value={editingUser.email || ''}
                  disabled // Disable editing
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="editRole" className="block text-gray-700 text-sm font-bold mb-1">
                  Role:
                </label>
                <select
                  id="editRole"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditUserModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md shadow-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;