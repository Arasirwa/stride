import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  
  // Check if user has completed registration
  useEffect(() => {
    const registrationData = JSON.parse(sessionStorage.getItem("registrationData") || "{}");
    
    // If no registration data, redirect to registration page
    if (!registrationData.fullName) {
      navigate("/register");
    } else {
      // Clear registration data after successful registration
      setTimeout(() => {
        sessionStorage.removeItem("registrationData");
      }, 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-product p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 font-heading">
            Registration Complete!
          </h1>
          <p className="text-secondary-600 mt-2">
            Your account has been created successfully.
          </p>
        </div>

        <div className="bg-secondary-50 rounded-lg p-6 mb-8">
          <p className="text-secondary-800 font-medium">
            What happens next?
          </p>
          <ul className="mt-4 space-y-4 text-left">
            <li className="flex items-start">
              <div className="bg-primary-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block w-4 h-4 bg-primary-600 rounded-full text-white text-xs flex items-center justify-center">
                  1
                </span>
              </div>
              <span className="text-secondary-700">
                Browse our collection of premium footwear
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block w-4 h-4 bg-primary-600 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </div>
              <span className="text-secondary-700">
                Enjoy personalized recommendations based on your preferences
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block w-4 h-4 bg-primary-600 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="text-secondary-700">
                Complete your profile to get the most out of your experience
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to="/login"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sign In
          </Link>
          <Link
            to="/"
            className="w-full bg-white border border-secondary-300 hover:bg-secondary-50 text-secondary-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            Go to Homepage
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;