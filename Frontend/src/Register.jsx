import React, { useState } from 'react';
// import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import api from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('http://localhost:3000/api/user/register', {
        name,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      setMessage('Registration successful!');
      setName('');
      setEmail('');
      setPassword('');

      navigate('/create-profile');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          Join SocialSphere
        </h2>

        {message && (
          <div
            className={`mb-5 text-center font-medium ${
              message.includes('successful')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiUser className="absolute top-4 left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FiMail className="absolute top-4 left-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute top-4 left-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
