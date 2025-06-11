import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@/Context/ThemeContext';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { darkMode } = useTheme();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .matches(
          /^[a-zA-Z0-9._\-@$#]+$/,
          'Username can contain letters, numbers, and _ . - @ $ #'
        )
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character'
        )
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post('http://localhost:3000/api/user/register', values);
        const { token } = response.data;
        localStorage.setItem('token', token);
        setMessage('Registration successful!');
        navigate('/create-profile');
      } catch (error) {
        console.error('Registration error:', error);
        setMessage(error.response?.data?.message || 'Error occurred during registration');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-[#111827] to-[#1f2937]' : 'bg-gradient-to-br from-[#f0f4ff] to-[#ffffff]'}`}>
      <div className="max-w-md w-full p-10 rounded-2xl shadow-xl backdrop-blur-md bg-white/30 dark:bg-white/10 border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-500 dark:text-cyan-400">
          Join SocialSphere
        </h2>

        {message && (
          <div className={`mb-5 text-center font-medium text-sm ${message.includes('successful') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <FiUser className="absolute top-4 left-4 text-indigo-500 dark:text-cyan-300" />
            <input
              type="text"
              name="name"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 dark:bg-gray-800 border border-indigo-400 text-gray-800 dark:text-gray-100 placeholder-indigo-400 dark:placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-4 left-4 text-indigo-500 dark:text-cyan-300" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 dark:bg-gray-800 border border-indigo-400 text-gray-800 dark:text-gray-100 placeholder-indigo-400 dark:placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute top-4 left-4 text-indigo-500 dark:text-cyan-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 rounded-full bg-white/90 dark:bg-gray-800 border border-indigo-400 text-gray-800 dark:text-gray-100 placeholder-indigo-400 dark:placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className="absolute top-4 right-4 text-indigo-500 dark:text-cyan-300 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full font-semibold text-white transition duration-300 ${isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90'}`}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already a member?{" "}
          <Link to="/" className="text-indigo-700 dark:text-cyan-300 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
