import React from 'react';
import { Facebook, Instagram, Twitter, CreditCard, Truck, LifeBuoy, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-100">
      {/* Main Footer Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">STRIDE</h3>
            <p className="text-secondary-300 mb-4 text-sm">
              Premium footwear for every occasion. Step into comfort, walk with style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-300 hover:text-white transition duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Men's Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Women's Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Sale Items
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-4">Join Our Newsletter</h3>
            <p className="text-secondary-300 mb-4 text-sm">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 w-full bg-secondary-800 text-white border border-secondary-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-r-md transition duration-200"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-secondary-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center md:justify-start">
              <Truck size={20} className="text-accent-500 mr-2" />
              <span className="text-secondary-200 text-sm">Free shipping on orders over $150</span>
            </div>
            <div className="flex items-center justify-center">
              <CreditCard size={20} className="text-accent-500 mr-2" />
              <span className="text-secondary-200 text-sm">Secure payment processing</span>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <LifeBuoy size={20} className="text-accent-500 mr-2" />
              <span className="text-secondary-200 text-sm">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-secondary-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {currentYear} STRIDE. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-secondary-200 text-sm transition duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-secondary-200 text-sm transition duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-secondary-200 text-sm transition duration-200">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;