import React from "react";

export default function Processing() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
      <h3 className="text-lg font-medium text-secondary-900 mt-4">
        Processing Payment
      </h3>
      <p className="text-secondary-600 mt-2">
        Please wait while we process your payment...
      </p>
    </div>
  );
}
