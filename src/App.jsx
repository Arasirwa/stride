import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import Profile from "./Profile/Profile";
import ProductDetailsPage from "./pages/ProductDetails";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminPanel from "./pages/AdminPanel";
import { Navigate } from "react-router-dom";

// Import auth pages
import Login from "./LoginAndRegistration/LoginPage";
import Register from "./LoginAndRegistration/RegistrationPage";
import ForgotPassword from "./LoginAndRegistration/ForgotPassword";
import OTPVerification from "./LoginAndRegistration/OTP-Verification";
import ResetPassword from "./LoginAndRegistration/PasswordReset";
import RegistrationSuccess from "./LoginAndRegistration/RegistrationSuccess";

// Auth guard components
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Auth routes (outside MainLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/registration-success" element={<RegistrationSuccess />} />

      {/* MainLayout routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
