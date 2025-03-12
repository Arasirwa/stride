import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-6">
      <div className="bg-white shadow-xl rounded-lg p-8 text-center max-w-md">
        {/* Failure Icon with Animation */}
        <div className="w-20 h-20 bg-red-100 flex items-center justify-center rounded-full mx-auto mb-4 animate-pulse">
          <XCircle size={50} className="text-red-600" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-red-700">
          Payment Failed
        </h2>
        <p className="text-secondary-700 mt-2 text-sm">
          Oops! Something went wrong with your payment. Please check your details and try again.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
            onClick={() => navigate("/order-confirmation")}
          >
            Retry Payment
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 text-secondary-700 font-medium py-3 px-6 rounded-lg transition-all"
            onClick={() => navigate("/shop")}
          >
            Go Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
