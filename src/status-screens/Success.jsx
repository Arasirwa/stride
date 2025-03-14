import { CheckIcon } from "lucide-react";
import React from "react";
import useOrderStore from "../stores/OrdersStore";


export default function Success() {
    const {currentOrder} = useOrderStore()
  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckIcon size={24} className="text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mt-4">
          Payment Successful!
        </h3>
        <p className="text-secondary-600 mt-2">
          Your order has been placed successfully.
        </p>
        <p className="text-secondary-600 mt-1">Order ID: {currentOrder.id}</p>
        <p className="text-secondary-600 mt-1">
          You will be redirected shortly...
        </p>
      </div>
    </div>
  );
}
