import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-secondary-900">
          🎉 Payment Successful!
        </h2>
        <p className="text-secondary-600 mt-2">
          Your order has been placed successfully.
        </p>

        <button
          className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
