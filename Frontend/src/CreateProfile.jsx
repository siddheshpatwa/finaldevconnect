import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiBookOpen,
  FiTag,
} from "react-icons/fi";
import api from "axios";

const CreateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      name: form.name,
      bio: form.bio,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
      socialLinks: {
        github: normalizeUrl(form.github),
        linkedin: normalizeUrl(form.linkedin),
        twitter: normalizeUrl(form.twitter),
        portfolio: normalizeUrl(form.portfolio),
      },
    };

    try {
      const response = await api.post(
        "http://localhost:3000/api/user/profile/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Profile
        </h2>
        {error && (
          <p className="mb-4 text-center text-red-600 font-medium animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputWithIcon
            icon={<FiUser className="text-gray-400" />}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <InputWithIcon
            icon={<FiBookOpen className="text-gray-400" />}
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
          />
          <InputWithIcon
            icon={<FiTag className="text-gray-400" />}
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
          />
          <InputWithIcon
            icon={<FiGithub className="text-gray-400" />}
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            type="url"
          />
          <InputWithIcon
            icon={<FiLinkedin className="text-gray-400" />}
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            type="url"
          />
          <InputWithIcon
            icon={<FiTwitter className="text-gray-400" />}
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
            type="url"
          />
          <InputWithIcon
            icon={<FiLink className="text-gray-400" />}
            name="portfolio"
            value={form.portfolio}
            onChange={handleChange}
            placeholder="Portfolio URL"
            type="url"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const InputWithIcon = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="relative">
    <span className="absolute top-3 left-4">{icon}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder-gray-400"
    />
  </div>
);

export default CreateProfile;
