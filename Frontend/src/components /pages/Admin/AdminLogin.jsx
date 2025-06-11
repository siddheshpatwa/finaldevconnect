// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUser, FiKey, FiMoon, FiSun } from "react-icons/fi";
// import { useTheme } from "@/Context/ThemeContext";

// const AdminLogin = () => {
//   const [form, setForm] = useState({ username: "", secret: "" });
//   const [error, setError] = useState("");
//   const { darkMode, toggleDarkMode } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");

//     const { username, secret } = form;

//     if (username === "Admin" && secret === "root") {
//       alert("Admin Login Successful");
//       navigate("/Admin");
//     } else {
//       setError("Invalid credentials. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#ffffff] dark:from-[#111827] dark:to-[#1f2937] flex items-center justify-center px-4">
//       <div className="backdrop-blur-md bg-white/30 dark:bg-white/10 p-8 rounded-2xl shadow-xl border border-white/30 w-full max-w-md">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-cyan-400">
//             Admin Login
//           </h2>
//           <button
//             onClick={toggleDarkMode}
//             className="text-sm font-medium text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
//           >
//             {darkMode ? <FiSun /> : <FiMoon />}
//             {darkMode ? "Light" : "Dark"}
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center dark:bg-red-200/20 dark:text-red-400">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Username */}
//           <div className="flex items-center bg-white/90 dark:bg-white/20 border border-indigo-400 rounded-full px-4 py-3 shadow-sm">
//             <FiUser className="text-indigo-700 dark:text-cyan-400 mr-3" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-400"
//               value={form.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Secret Key */}
//           <div className="flex items-center bg-white/90 dark:bg-white/20 border border-indigo-400 rounded-full px-4 py-3 shadow-sm">
//             <FiKey className="text-indigo-700 dark:text-cyan-400 mr-3" />
//             <input
//               type="text"
//               name="secret"
//               placeholder="Secret Key"
//               className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-400"
//               value={form.secret}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useTheme } from "@/Context/ThemeContext";
import axios from "axios";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        email: form.email,
        password: form.password,
      });

    localStorage.setItem("token", response.data.token); 
      alert("Login Successful");
      navigate("/Admin");
      if(!token) {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-[#111827] to-[#1f2937]" : "bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]"}`}>
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white/30 dark:bg-white/10 border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-500 dark:text-cyan-400">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 text-center text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex items-center px-4 py-3 rounded-full bg-white/90 dark:bg-gray-800 border border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-300">
            <FiMail className="text-indigo-700 dark:text-cyan-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-300"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="flex items-center px-4 py-3 rounded-full bg-white/90 dark:bg-gray-800 border border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-300">
              <FiLock className="text-indigo-700 dark:text-cyan-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-indigo-600 dark:placeholder-cyan-300"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full font-semibold text-white transition duration-300 ${isSubmitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90"
              }`}
          >
            {isSubmitting ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
