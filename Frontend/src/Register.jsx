import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false); 
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
//     validationSchema: Yup.object({
//     username: Yup.string()
//   .trim()
//   .matches(/^[a-zA-Z0-9._\-@$#]+$/, 'Username can contain letters, numbers, and _ . - @ $ #')
//   .min(3, 'Username must be at least 3 characters')
//   .required('Username is required'),

//       email: Yup.string()
//         .email('Invalid email address')
//         .required('Email is required'),
//      password: Yup.string()
//     .min(6, 'Password must be at least 6 characters')
//     .matches(
//       /[!@#$%^&*(),.?":{}|<>]/,
//       'Password must contain at least one special character'
//     )
//     .required('Password is required'),
// }),
//     onSubmit: async (values) => {
//       setIsSubmitting(true);
//       try {
//         const response = await axios.post('http://localhost:3000/api/user/register', values);
//         const { token } = response.data;
//         localStorage.setItem('token', token);
//         setMessage('Registration successful!');
//         navigate('/create-profile');
//       } catch (error) {
//         console.error('Registration error:', error);
//         setMessage(error.response?.data?.message || 'Error occurred during registration');
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
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
  console.log("Submitting values:", values); // ✅ Debug log
  try {
    const response = await axios.post('http://localhost:3000/api/user/register', values);
    console.log("Response from server:", response); // ✅ Debug log
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

  }
);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          Join SocialSphere
        </h2>

        {message && (
          <div
            className={`mb-5 text-center font-medium ${
              message.includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <FiUser className="absolute top-4 left-4 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="relative">
            <FiMail className="absolute top-4 left-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.email}</p>
            )}
          </div>

      <div className="relative">
  <FiLock className="absolute top-4 left-4 text-gray-400" />
  <input
    type={showPassword ? 'text' : 'password'} // toggle input type
    name="password"
    placeholder="Password"
    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <span
    className="absolute top-4 right-4 text-gray-400 cursor-pointer"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FiEyeOff /> : <FiEye />}
  </span>
  {formik.touched.password && formik.errors.password && (
    <p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.password}</p>
  )}
</div>


          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
              isSubmitting
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Already a member?{' '}
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
