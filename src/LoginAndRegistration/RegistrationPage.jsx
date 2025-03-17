import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Phone, Info } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verificationMethod: "email" // Default to email verification
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation
    if (formData.verificationMethod === "phone" && !formData.phone) {
      newErrors.phone = "Phone number is required for OTP verification";
    } else if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
      
      // Store the registration data temporarily (in a real app, this would be in your backend)
      sessionStorage.setItem("registrationData", JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        verificationMethod: formData.verificationMethod
      }));
      
      // Navigate to OTP verification page
      navigate("/verify-otp");
    } catch (error) {
      setErrors({
        general: "Registration failed. Please try again later."
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
            Create Account
          </h1>
          <p className="text-secondary-600 mt-2">
            Sign up to get started with STRIDE
          </p>
        </div>

        {errors.general && (
          <div className="bg-danger-100 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-secondary-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                <User size={20} />
              </span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg ${
                  errors.fullName
                    ? "border-danger-500 focus:ring-danger-500"
                    : "border-secondary-300 focus:ring-primary-500"
                } focus:border-primary-500 focus:ring-2 transition`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-danger-600 text-sm">{errors.fullName}</p>
            )}
          </div>

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
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-secondary-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                <Phone size={20} />
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg ${
                  errors.phone
                    ? "border-danger-500 focus:ring-danger-500"
                    : "border-secondary-300 focus:ring-primary-500"
                } focus:border-primary-500 focus:ring-2 transition`}
                placeholder="+1 234 567 8900"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-danger-600 text-sm">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Verification Method
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="email"
                  checked={formData.verificationMethod === "email"}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-secondary-700">Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="phone"
                  checked={formData.verificationMethod === "phone"}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-secondary-700">Phone (SMS)</span>
              </label>
            </div>
            <p className="mt-1 text-secondary-500 text-xs flex items-center">
              <Info size={12} className="inline mr-1" />
              {formData.verificationMethod === "email" 
                ? "We'll send a verification code to your email" 
                : "We'll send a verification code via SMS"}
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary-700 mb-1"
            >
              Password
            </label>
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-secondary-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                <Lock size={20} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg ${
                  errors.confirmPassword
                    ? "border-danger-500 focus:ring-danger-500"
                    : "border-secondary-300 focus:ring-primary-500"
                } focus:border-primary-500 focus:ring-2 transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-danger-600 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-2">
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-secondary-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;