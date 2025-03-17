import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if user has verified OTP
  useEffect(() => {
    const resetData = JSON.parse(sessionStorage.getItem("passwordResetData") || "{}");
    
    // If no reset data, redirect to forgot password page
    if (!resetData.contact) {
      navigate("/forgot-password");
    }
  }, [navigate]);

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setIsCompleted(true);
      
      // Clear password reset data
      sessionStorage.removeItem("passwordResetData");
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrors({
        general: "Failed to reset password. Please try again later."
      });
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" };
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    
    return {
      strength,
      label: labels[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 1: return "bg-danger-500";
      case 2: return "bg-danger-400";
      case 3: return "bg-warning-500";
      case 4: return "bg-success-400";
      case 5: return "bg-success-500";
      default: return "bg-secondary-300";
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-product p-8">
        <div className="mb-8">
          <Link to="/forgot-password" className="text-secondary-600 hover:text-secondary-800 inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Reset Request
          </Link>
          
          <h1 className="text-2xl font-bold text-secondary-900 font-heading mt-4">
            {isCompleted ? "Password Reset Successful" : "Create New Password"}
          </h1>
          <p className="text-secondary-600 mt-2">
            {isCompleted 
              ? "Your password has been reset successfully." 
              : "Your new password must be different from previously used passwords."}
          </p>
        </div>

        {errors.general && (
          <div className="bg-danger-100 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {isCompleted ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-success-500 mb-4" />
            <p className="text-secondary-700 mb-4">
              You can now log in to your account with your new password.
            </p>
            <Link 
              to="/login"
              className="inline-block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm text-center"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                New Password
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
                  placeholder="Create a strong password"
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
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex h-1 mt-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-full w-1/5 ${
                          level <= passwordStrength.strength
                            ? getPasswordStrengthColor(passwordStrength.strength)
                            : "bg-secondary-200"
                        } ${level > 1 ? "ml-1" : ""}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-secondary-600">
                    Password strength: <span className="font-medium">{passwordStrength.label || "Very Weak"}</span>
                  </p>
                </div>
              )}
              
              <ul className="mt-2 text-xs text-secondary-600 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? "text-success-600" : ""}`}>
                  {formData.password.length >= 8 ? (
                    <CheckCircle size={12} className="mr-1 text-success-600" />
                  ) : (
                    <span className="h-3 w-3 mr-1" />
                  )}
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? "text-success-600" : ""}`}>
                  {/[A-Z]/.test(formData.password) ? (
                    <CheckCircle size={12} className="mr-1 text-success-600" />
                  ) : (
                    <span className="h-3 w-3 mr-1" />
                  )}
                  At least one uppercase letter
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.password) ? "text-success-600" : ""}`}>
                  {/[a-z]/.test(formData.password) ? (
                    <CheckCircle size={12} className="mr-1 text-success-600" />
                  ) : (
                    <span className="h-3 w-3 mr-1" />
                  )}
                  At least one lowercase letter
                </li>
                <li className={`flex items-center ${/[0-9]/.test(formData.password) ? "text-success-600" : ""}`}>
                  {/[0-9]/.test(formData.password) ? (
                    <CheckCircle size={12} className="mr-1 text-success-600" />
                  ) : (
                    <span className="h-3 w-3 mr-1" />
                  )}
                  At least one number
                </li>
              </ul>
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
                  placeholder="Confirm your password"
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
                    Updating Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;