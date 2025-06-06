import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br to-white-700 flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-xl border border-white/30 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Welcome Back</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center bg-white/90 border border-indigo-400 rounded-full px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
            <FiMail className="text-indigo-700 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent text-indigo-900 placeholder-indigo-600"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input with Show/Hide */}
          <div className="relative">
            <div className="flex items-center bg-white/90 border border-indigo-400 rounded-full px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
              <FiLock className="text-indigo-700 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full outline-none bg-transparent text-indigo-900 placeholder-indigo-600"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="text-indigo-600 cursor-pointer ml-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-blue text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-900 hover:underline font-medium">
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
