import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useTheme } from "@/Context/ThemeContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-[#111827] to-[#1f2937]" : "bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]"}`}>
      <div className="backdrop-blur-lg bg-white/30 dark:bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-500 dark:text-cyan-400">Welcome Back</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center bg-white/90 dark:bg-gray-800 border border-indigo-400 rounded-full px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
            <FiMail className="text-indigo-700 dark:text-cyan-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-300"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="flex items-center bg-white/90 dark:bg-gray-800 border border-indigo-400 rounded-full px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
              <FiLock className="text-indigo-700 dark:text-cyan-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-300"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="text-indigo-600 dark:text-cyan-300 cursor-pointer ml-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-700 dark:text-cyan-300 hover:underline font-medium">
            Register
          </a>
        </p>

        <button
          onClick={() => navigate("/Admin")}
          className="w-full mt-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Go to Admin Page
        </button>
      </div>
    </div>
  );
};

export default Login;

/*
I'm designing a modern social media web app. Please use the following consistent color palette and styling guidelines for all UI elements:

🎨 Color Palette:
- Primary: #6366F1 (Indigo-500)
- Accent: #06B6D4 (Cyan-500)
- Text: #1F2937 (Gray-800) on light mode, #F9FAFB (Gray-100) on dark mode
- Background Gradient:
  - Light: from-[#f0f4ff] to-[#ffffff]
  - Dark: from-[#111827] to-[#1f2937]

🖌️ UI Style:
- Use rounded corners (rounded-xl or rounded-full)
- Clean and minimal layout
- Responsive design using Tailwind CSS
- Support dark/light mode switch with proper contrast
- Include hover, focus, and transition states for interactivity

📦 Components:
- Use cards for posts with shadow-lg and padding
- Like button turns **red** if the user has liked the post
- Expandable details ("Show More"/"Show Less")
- Comment section with input and animated list display

Whenever I ask for a new component/page, please apply these design rules and this color palette.


I'm designing a modern social media web app. Please use the following consistent color palette and styling guidelines for all UI elements:

🎨 Color Palette:
- Primary: #6366F1 (Indigo-500)
- Accent: #06B6D4 (Cyan-500)
- Text: #1F2937 (Gray-800) on light mode, #F9FAFB (Gray-100) on dark mode
- Background Gradient:
  - Light: from-[#f0f4ff] to-[#ffffff]
  - Dark: from-[#111827] to-[#1f2937]

🖌️ UI Style:
- Use rounded corners (rounded-xl or rounded-full)
- Clean and minimal layout
- Responsive design using Tailwind CSS
- Support dark/light mode switch with proper contrast
- Include hover, focus, and transition states for interactivity

📦 Components:
- Use cards for posts with shadow-lg and padding
- Like button turns **red** if the user has liked the post
- Expandable details ("Show More"/"Show Less")
- Comment section with input and animated list display

Whenever I ask for a new component/page, please apply these design rules and this color palette.


*/