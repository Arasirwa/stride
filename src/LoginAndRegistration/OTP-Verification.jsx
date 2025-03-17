import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Determine purpose of verification (registration or password reset)
  const purpose = location.state?.purpose || "registration";
  const contactMethod = location.state?.method || "email";
  const contactValue = location.state?.contact || "";
  
  // If no contact value from location state, try to get from sessionStorage
  useEffect(() => {
    if (!contactValue) {
      const registrationData = JSON.parse(sessionStorage.getItem("registrationData") || "{}");
      const resetData = JSON.parse(sessionStorage.getItem("passwordResetData") || "{}");
      
      if (purpose === "passwordReset" && resetData.contact) {
        // Use data from password reset flow
      } else if (registrationData.fullName) {
        // Use data from registration flow
      } else {
        // No data found, redirect to appropriate starting page
        navigate(purpose === "passwordReset" ? "/forgot-password" : "/register");
      }
    }
  }, [contactValue, navigate, purpose]);
  
  // Handle timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => clearInterval(interval);
  }, [timer]);

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      // Take only the last digit if multiple are pasted
      newOtp[index] = value.slice(-1);
      return newOtp;
    });
    
    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Check if pasted content is numeric and of correct length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6);
      
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        digits.forEach((digit, idx) => {
          if (idx < 6) newOtp[idx] = digit;
        });
        return newOtp;
      });
      
      // Focus the next empty input or the last input if all filled
      const lastFilledIndex = Math.min(5, digits.length - 1);
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1].focus();
      } else {
        inputRefs.current[5].focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit verification code" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to your backend to verify the OTP
      // For demo purposes we're just simulating a delay and using a dummy OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dummy verification for demo purposes (123456 is the valid OTP)
      if (otpValue === "123456") {
        setVerified(true);
        
        // Clear any existing errors
        setErrors({});
        
        // Handle next steps after a delay
        setTimeout(() => {
          if (purpose === "passwordReset") {
            navigate("/reset-password");
          } else {
            // For registration flow, navigate to a success page or directly log in the user
            navigate("/registration-success");
          }
        }, 2000);
      } else {
        setErrors({ otp: "Invalid verification code. Please try again." });
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ general: "Verification failed. Please try again later." });
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setCanResend(false);
    setTimer(60); // Reset timer to 60 seconds
    
    try {
      // Here you would typically make an API call to your backend to resend the OTP
      // For demo purposes we're just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setErrors({ success: "A new verification code has been sent!" });
      
      // Reset OTP fields
      setOtp(Array(6).fill(""));
      inputRefs.current[0].focus();
    } catch (error) {
      setErrors({ general: "Failed to resend code. Please try again later." });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-product p-8">
        <div className="mb-8">
          <Link 
            to={purpose === "passwordReset" ? "/forgot-password" : "/register"} 
            className="text-secondary-600 hover:text-secondary-800 inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
          
          <h1 className="text-2xl font-bold text-secondary-900 font-heading mt-4">
            {verified ? "Verification Successful!" : "Verification Code"}
          </h1>
          <p className="text-secondary-600 mt-2">
            {verified 
              ? "Your identity has been verified successfully."
              : `Enter the 6-digit code sent to your ${
                  contactMethod === "email" ? "email" : "phone"
                }`}
          </p>
        </div>

        {errors.general && (
          <div className="bg-danger-100 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {errors.success && (
          <div className="bg-success-100 border border-success-300 text-success-700 px-4 py-3 rounded-lg mb-6">
            {errors.success}
          </div>
        )}

        {verified ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-success-500 mb-4" />
            <p className="text-secondary-800">
              {purpose === "passwordReset" 
                ? "You'll be redirected to reset your password."
                : "Your account has been verified. You'll be redirected shortly."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-4 text-center">
                Enter Verification Code
              </label>
              
              <div className="flex justify-between gap-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg 
                      ${
                        errors.otp
                          ? "border-danger-500 focus:ring-danger-500"
                          : "border-secondary-300 focus:ring-primary-500"
                      } focus:border-primary-500 focus:ring-2 transition`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-1 text-danger-600 text-sm text-center">{errors.otp}</p>
              )}
              
              <p className="mt-4 text-secondary-600 text-sm text-center">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Resend Code
                  </button>
                ) : (
                  <span className="text-secondary-500">
                    Resend code in {formatTimeRemaining()}
                  </span>
                )}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading || otp.join("").length !== 6}
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
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;