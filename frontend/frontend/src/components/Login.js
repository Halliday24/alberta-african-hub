// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../services/useAuth';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react'; // Importing icons from lucide-react

// Login component
/**
 * This handle the user login functionality.
 * It allows users to enter their email and password to sign in to their account.
 * It uses the `useAuth` hook to access the authentication service.
 * @param {Function} onClose - CallbackFunction to close the login modal  
 * @param {Function} switchToRegister - Callback Function to switch to the registration modal
 * @returns 
 */
const Login = ({ onClose, switchToRegister }) => {
  const { login } = useAuth(); // useAuth hook to access the login function from the authentication service
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); // form data state to hold the email and password entered by the user
  // password will be shown or hidden based on this state, set to false initially
  const [showPassword, setShowPassword] = useState(false); 
  // loading state to show a loading spinner while the user is signing in
  const [loading, setLoading] = useState(false); // set to false initially
  // error state to show an error message set to an empty string initially
  const [error, setError] = useState('');


  // callback function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show the loading spinner
    setError(''); // clear any previous error messages

    try {
      await login(formData); // call the login function with the form data
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // no loading until submit is clicked
    }
  };

  // callback function to handle input changes
  const handleChange = (e) => {
    setFormData({
      // spread the existing form data and update the value of the 
      // input field that triggered the change
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // render the login form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 relative">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* show the error message if there is one */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* email input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          {/* password input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // toggle the showPassword state
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {/* toggle password visibility */}
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing In...' : 'Sign In'} {/* toggle button based on loading state */}
          </button>
        </form>
        {/* show the register button if the user is not logged in */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={switchToRegister}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* close button for the login modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Login;

