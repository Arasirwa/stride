import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to your backend
      // For demo purposes we're just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating successful login
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("user", JSON.stringify({ email: formData.email }));
      
      // Navigate to dashboard or home page
      navigate("/");
    } catch (error) {
      setErrors({
        general: "Login failed. Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-product p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 font-heading">
            Welcome Back
          </h1>
          <p className="text-secondary-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {errors.general && (
          <div className="bg-danger-100 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                <Mail size={20} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg ${
                  errors.email
                    ? "border-danger-500 focus:ring-danger-500"
                    : "border-secondary-300 focus:ring-primary-500"
                } focus:border-primary-500 focus:ring-2 transition`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-danger-600 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg ${
                  errors.password
                    ? "border-danger-500 focus:ring-danger-500"
                    : "border-secondary-300 focus:ring-primary-500"
                } focus:border-primary-500 focus:ring-2 transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-danger-600 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-secondary-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;