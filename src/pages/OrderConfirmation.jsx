import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Phone,
  AlertCircle,
  ChevronRight,
  CheckIcon,
  XIcon,
} from "lucide-react";
import useProductStore from "../stores/productStore";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { currentOrder, markOrderAsPaid } = useProductStore();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-secondary-50 px-4">
        <ShoppingBag size={48} className="text-secondary-400" />
        <h2 className="text-2xl font-semibold text-secondary-700 mt-4">
          No order to confirm
        </h2>
        <button
          className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          onClick={() => navigate("/shop")}
        >
          Go Back to Shop
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    setPaymentStatus("processing");

    setTimeout(() => {
      // Simulate success or failure (90% success rate)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        setPaymentStatus("success");

        // ✅ Mark order as paid & clear cart
        markOrderAsPaid(currentOrder.id);

        setTimeout(() => navigate("/order-success"), 2000);
      } else {
        setPaymentStatus("failed");
        // Optional: Redirect to a failure page
        // setTimeout(() => navigate("/order-failed"), 2000);
      }
    }, 2000);
  };

  const renderPaymentForm = () => {
    if (!paymentMethod) return null;

    return (
      <div className="p-6 bg-white rounded-lg shadow-md relative">
        {/* Back Button */}
        <button
          onClick={() => setPaymentMethod(null)}
          className="absolute top-4 left-4 text-secondary-500 hover:text-secondary-700 flex items-center"
        >
          <ChevronRight size={20} className="rotate-180 mr-2" />
          <span>Back</span>
        </button>

        {paymentMethod === "mpesa" && (
          <>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 text-center">
              Pay with M-Pesa
            </h3>
            <div className="mb-6">
              <label className="block text-secondary-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="254700000000"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-green-800 mb-2">
                Manual M-Pesa Payment Steps:
              </h4>
              <ol className="list-decimal pl-5 text-green-700 space-y-2">
                <li>Go to M-Pesa on your phone</li>
                <li>Select "Lipa na M-Pesa"</li>
                <li>Select "Pay Bill"</li>
                <li>Enter Business Number: 174379</li>
                <li>Enter Account Number: {currentOrder.id}</li>
                <li>
                  Enter Amount: KSH{""}
                  {currentOrder.items.reduce(
                    (total, item) =>
                      total + item.quantity * item.product.discountPrice,
                    0
                  )}
                </li>
                <li>Enter your M-Pesa PIN</li>
                <li>Confirm the transaction</li>
              </ol>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Complete M-Pesa Payment
            </button>
          </>
        )}

        {paymentMethod === "airtel" && (
          <>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 text-center">
              Pay with Airtel Money
            </h3>
            <div className="mb-6">
              <label className="block text-secondary-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="254700000000"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-red-800 mb-2">
                Manual Airtel Money Payment Steps:
              </h4>
              <ol className="list-decimal pl-5 text-red-700 space-y-2">
                <li>Go to Airtel Money on your phone</li>
                <li>Select "Make Payments"</li>
                <li>Select "Pay Bill"</li>
                <li>Enter Business Name: ShopName</li>
                <li>Enter Reference Number: {currentOrder.id}</li>
                <li>
                  Enter Amount: KSH{" "}
                  {currentOrder.items.reduce(
                    (total, item) =>
                      total + item.quantity * item.product.discountPrice,
                    0
                  )}
                </li>
                <li>Enter your Airtel Money PIN</li>
                <li>Confirm the transaction</li>
              </ol>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Complete Airtel Money Payment
            </button>
          </>
        )}

        {paymentMethod === "card" && (
          <>
            <h3 className="text-lg font-medium text-secondary-900 mb-4 text-center">
              Pay with Card
            </h3>
            <div className="mb-4">
              <label className="block text-secondary-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-secondary-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-secondary-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-secondary-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-200"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <img src="/api/placeholder/40/24" alt="Visa" className="h-6" />
              <img
                src="/home/arasirwa/webDevelopment/React/shoe-shop/src/assets/mastercard.svg"
                alt="Mastercard"
                className="h-6"
              />
              <img src="/api/placeholder/40/24" alt="Amex" className="h-6" />
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Pay KSH{" "}
              {currentOrder.items.reduce(
                (total, item) =>
                  total + item.quantity * item.product.discountPrice,
                0
              )}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "processing":
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

      case "success":
        return (
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
            <p className="text-secondary-600 mt-1">
              Order ID: {currentOrder.id}
            </p>
            <p className="text-secondary-600 mt-1">
              You will be redirected shortly...
            </p>
          </div>
        );

      case "failed":
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle size={48} className="text-success-500 mx-auto" />
          <h1 className="text-2xl font-bold text-secondary-900 mt-4">
            Confirm Your Order
          </h1>
          <p className="text-secondary-600 mt-2">
            Review your order and select your preferred payment method.
          </p>
        </div>

        {paymentStatus ? (
          <div className="max-w-md mx-auto">{renderPaymentStatus()}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Order Summary */}
            <div className="flex-1">
              <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Order Summary
                </h2>
                <ul className="mt-4 space-y-4">
                  {currentOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span className="text-secondary-700">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-secondary-900 font-medium">
                        Ksh: {item.product.discountPrice * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <span className="text-lg font-semibold text-secondary-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-secondary-900">
                    Ksh:{" "}
                    {currentOrder.items.reduce(
                      (total, item) =>
                        total + item.quantity * item.product.discountPrice,
                      0
                    )}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              {!paymentMethod && (
                <div className="mt-6 bg-white shadow-md rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    Select Payment Method
                  </h2>

                  <button
                    onClick={() => setPaymentMethod("mpesa")}
                    className="w-full flex items-center justify-between p-4 border rounded-lg mb-3 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Phone size={20} className="text-green-600" />
                      </div>
                      <span className="font-medium">Safaricom M-Pesa</span>
                    </div>
                    <ChevronRight size={20} className="text-secondary-400" />
                  </button>

                  <button
                    onClick={() => setPaymentMethod("airtel")}
                    className="w-full flex items-center justify-between p-4 border rounded-lg mb-3 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <Phone size={20} className="text-red-600" />
                      </div>
                      <span className="font-medium">Airtel Money</span>
                    </div>
                    <ChevronRight size={20} className="text-secondary-400" />
                  </button>

                  <button
                    onClick={() => setPaymentMethod("card")}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <ChevronRight size={20} className="text-secondary-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Payment Form */}
            <div className="flex-1">{renderPaymentForm()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderConfirmation;
