import React from "react";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationHeader() {
  return (
    <div className="text-center mb-8">
      <CheckCircle size={48} className="text-success-500 mx-auto" />
      <h1 className="text-2xl font-bold text-secondary-900 mt-4">
        Confirm Your Order
      </h1>
      <p className="text-secondary-600 mt-2">
        Review your order and select your preferred payment method.
      </p>
    </div>
  );
}
