import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  SheetIcon,
  ShieldIcon,
} from "lucide-react";
import useProductStore from "../stores/productStore";
import useCartStore from "../stores/cartStore";
import useOrderStore from "../stores/OrdersStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const cart = useCartStore((state) => state.cart);
  const notifications = useOrderStore((state) => state.notifications);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    // Navigate to shop if not already there
    if (location.pathname !== "/shop" && newQuery.trim() !== "") {
      navigate("/shop");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim() !== "") {
      setSearchQuery(searchQuery); // Ensure it triggers filtering
    }

    if (location.pathname !== "/shop") {
      navigate("/shop");
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18 md:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-primary-700 font-heading font-extrabold text-2xl md:text-3xl"
            >
              STRIDE
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-lg font-bold">
            <NavLink
              to="/"
              className="text-secondary-700 hover:text-primary-600 transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className="text-secondary-700 hover:text-primary-600 transition"
            >
              Shop
            </NavLink>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-grow max-w-lg mx-10">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for shoes..."
                className="w-full pl-5 pr-12 py-3 text-lg rounded-md border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-primary-600 transition"
              >
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/cart"
              className="relative text-secondary-700 hover:text-primary-600 transition"
            >
              <ShoppingBag size={26} />
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white rounded-full text-sm w-6 h-6 flex items-center justify-center">
                {cart.length}
              </span>
            </NavLink>
            <NavLink
              to="/profile"
              className="relative text-secondary-700 hover:text-primary-600 transition"
            >
              <User size={26} />
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white rounded-full text-sm w-6 h-6 flex items-center justify-center">
                {notifications.length}
              </span>
            </NavLink>
            <NavLink
              to="/admin-panel"
              className="relative text-secondary-700 hover:text-primary-600 transition"
            >
              <ShieldIcon size={26} />
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white rounded-full text-sm w-6 h-6 flex items-center justify-center">
                {}
              </span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-5">
            <NavLink to="/cart" className="relative text-secondary-700">
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            </NavLink>
            <button onClick={toggleMenu} className="text-secondary-700">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-5 border-t border-secondary-200">
            <nav className="flex flex-col space-y-5 text-lg font-bold">
              <NavLink
                to="/"
                className="text-secondary-700 hover:text-primary-600 transition"
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className="text-secondary-700 hover:text-primary-600 transition"
              >
                Shop
              </NavLink>
              <NavLink
                to="/profile"
                className="text-secondary-700 hover:text-primary-600 transition"
              >
                Profile
              </NavLink>
            </nav>
            <form onSubmit={handleSearchSubmit} className="relative mt-5">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for shoes..."
                className="w-full pl-5 pr-12 py-3 text-lg rounded-md border border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-primary-600 transition"
              >
                <Search size={22} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
