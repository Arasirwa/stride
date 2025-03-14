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
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="admin-panel" element={<AdminPanel/>} />
      </Route>
    </Routes>
  );
}
