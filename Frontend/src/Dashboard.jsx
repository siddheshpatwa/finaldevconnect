import React, { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiLink, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProfiles();
    fetchPosts();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("/api/profiles");
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deleteProfile = async (id) => {
    try {
      await axios.delete(`/api/profiles/${id}`);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const getUserName = (userId) => {
    const user = profiles.find((u) => u._id === userId);
    return user ? user.name : "Unknown User";
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">Developer Hub</h1>

      <div className="max-w-7xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search users or posts..."
          className="w-full px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* User Profiles Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">All Users</h2>
          {filteredProfiles.length > 0 ? (
            <div className="space-y-6">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile._id}
                  className="bg-white/90 p-6 rounded-xl shadow-lg border border-gray-200 relative"
                >
                  <button
                    onClick={() => deleteProfile(profile._id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    title="Delete Profile"
                  >
                    <FiTrash2 />
                  </button>

                  <h2 className="text-xl font-bold text-indigo-800">{profile.name}</h2>
                  <p className="text-sm text-gray-700 mb-2">{profile.bio}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Skills:</strong> {profile.skills?.join(", ")}
                  </p>

                  <div className="flex space-x-3 mt-2 text-indigo-600 text-xl">
                    {profile.socialLinks?.github && (
                      <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">
                        <FiGithub />
                      </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                        <FiLinkedin />
                      </a>
                    )}
                    {profile.socialLinks?.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                        <FiTwitter />
                      </a>
                    )}
                    {profile.socialLinks?.portfolio && (
                      <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer">
                        <FiLink />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No users match your search.</p>
          )}
        </div>

        {/* Posts Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">All Posts</h2>
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500"
                >
                  <h3 className="text-lg font-bold text-indigo-700">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>By:</strong> {getUserName(post.userId)}
                  </p>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{post.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No posts match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
