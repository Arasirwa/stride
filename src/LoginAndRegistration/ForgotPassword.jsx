import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, ArrowLeft, Info } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contact: "",
    method: "email" // Default to email
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

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
    
    if (formData.method === "email") {
      // Email validation
      if (!formData.contact) {
        newErrors.contact = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.contact)) {
        newErrors.contact = "Email is invalid";
      }
    } else {
      // Phone validation
      if (!formData.contact) {
        newErrors.contact = "Phone number is required";
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.contact.replace(/\s+/g, ''))) {
        newErrors.contact = "Please enter a valid phone number";
      }
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
      
      // Store the recovery data temporarily (in a real app, this would be in your backend)
      sessionStorage.setItem("passwordResetData", JSON.stringify({
        contact: formData.contact,
        method: formData.method
      }));
      
      // Show success message or redirect to OTP verification page
      setRequestSent(true);
      
      // Navigate to OTP verification page after a delay
      setTimeout(() => {
        navigate("/verify-otp", { 
          state: { 
            purpose: "passwordReset",
            contact: formData.contact,
            method: formData.method
          } 
        });
      }, 2000);
      
    } catch (error) {
      setErrors({
        general: "Failed to send reset instructions. Please try again later."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-product p-8">
        <div className="mb-8">
          <Link to="/login" className="text-secondary-600 hover:text-secondary-800 inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
          
          <h1 className="text-2xl font-bold text-secondary-900 font-heading mt-4">
            {requestSent ? "Check Your " + (formData.method === "email" ? "Email" : "Phone") : "Reset Your Password"}
          </h1>
          <p className="text-secondary-600 mt-2">
            {requestSent 
              ? `We've sent a verification code to ${formData.contact}` 
              : "Enter your email or phone number and we'll send you a verification code to reset your password"}
          </p>
        </div>

        {errors.general && (
          <div className="bg-danger-100 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {requestSent ? (
          <div className="bg-success-100 border border-success-300 text-success-700 px-4 py-3 rounded-lg mb-6">
            <p>Verification code sent successfully! Redirecting to verification page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Send verification code via
              </label>
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="method"
                    value="email"
                    checked={formData.method === "email"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-secondary-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="method"
                    value="phone"
                    checked={formData.method === "phone"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-secondary-700">Phone (SMS)</span>
                </label>
              </div>
              
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                {formData.method === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                  {formData.method === "email" ? <Mail size={20} /> : <Phone size={20} />}
                </span>
                <input
                  type={formData.method === "email" ? "email" : "tel"}
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-lg ${
                    errors.contact
                      ? "border-danger-500 focus:ring-danger-500"
                      : "border-secondary-300 focus:ring-primary-500"
                  } focus:border-primary-500 focus:ring-2 transition`}
                  placeholder={formData.method === "email" ? "your@email.com" : "+1 234 567 8900"}
                />
              </div>
              {errors.contact && (
                <p className="mt-1 text-danger-600 text-sm">{errors.contact}</p>
              )}
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
              <div className="flex items-start">
                <Info size={20} className="text-primary-500 flex-shrink-0 mr-3 mt-1" />
                <p className="text-secondary-600 text-sm">
                  We'll send a verification code to {formData.method === "email" ? "your email address" : "your phone number"}. 
                  You'll need this code to create a new password.
                </p>
              </div>
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
                    Sending Code...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;