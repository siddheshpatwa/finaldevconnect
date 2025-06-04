import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "axios";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state?.profileData;

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  });

  useEffect(() => {
    if (passedData) {
      setForm({
        name: passedData.name || "",
        bio: passedData.bio || "",
        skills: passedData.skills || "",
        github: passedData.socialLinks?.github || "",
        linkedin: passedData.socialLinks?.linkedin || "",
        twitter: passedData.socialLinks?.twitter || "",
        portfolio: passedData.socialLinks?.portfolio || "",
      });
    }
  }, [passedData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.put(
        "http://localhost:3000/api/user/profile/update",
        {
          name: form.name,
          bio: form.bio,
          skills: form.skills,
          socialLinks: {
            github: form.github,
            linkedin: form.linkedin,
            twitter: form.twitter,
            portfolio: form.portfolio,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/profile");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Name", name: "name" },
            { label: "Bio", name: "bio" },
            { label: "Skills", name: "skills" },
            { label: "GitHub", name: "github" },
            { label: "LinkedIn", name: "linkedin" },
            { label: "Twitter", name: "twitter" },
            { label: "Portfolio", name: "portfolio" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
