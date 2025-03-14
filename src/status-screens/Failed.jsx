import React from "react";
import { XIcon } from "lucide-react";

export default function Failed({setPaymentStatus}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <XIcon size={24} className="text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-secondary-900 mt-4">
        Payment Failed
      </h3>
      <p className="text-secondary-600 mt-2">
        Your payment could not be processed.
      </p>
      <p className="text-secondary-600 mt-1">
        Please try again or use a different payment method.
      </p>
      <button
        onClick={() => setPaymentStatus(null)}
        className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
