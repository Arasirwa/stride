import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import useProductStore from "../stores/productStore";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Home = () => {
  const { products, fetchProducts } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
      setIsLoading(false);
    };

    loadProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter((product) => product.isBestselling);
  const heroSlides =
    products.length >= 6 ? products.slice(0, 6) : [...products, ...products];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-primary-600 font-medium">
            Loading amazing products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-secondary-100">
      {/* Hero Section - Improved with larger text and cleaner overlay */}
      <section className="relative h-screen max-h-[800px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + ' bg-accent-500"></span>';
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={heroSlides.length > 1}
          className="h-full w-full"
        >
          {heroSlides.map((product, index) => (
            <SwiperSlide key={`${product.id}-${index}`} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center z-20">
                <div className="container mx-auto px-6 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white max-w-2xl"
                  >
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 leading-tight">
                      {product.name}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-secondary-100 max-w-xl opacity-90">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={`/product/${product.id}`}
                        className="px-8 py-4 bg-accent-500 hover:bg-accent-600 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                      >
                        Shop Now
                      </Link>
                      <Link
                        to="/shop"
                        className="px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white font-medium border border-white/30 transition-all hover:-translate-y-1 duration-300"
                      >
                        View Collection
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Navigation */}
        <div className="swiper-button-prev !text-primary-700 !opacity-70 hover:!opacity-100 !left-6"></div>
        <div className="swiper-button-next !text-primary-700 !opacity-70 hover:!opacity-100 !right-6"></div>
      </section>

      {/* Features Section - New */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free Shipping",
                description: "On all orders over ksh 5,000",
                icon: "📦",
              },
              {
                title: "Secure Payment",
                description: "100% secure payment options",
                icon: "🔒",
              },
              {
                title: "Easy Returns",
                description: "30 days return policy",
                icon: "↩️",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-product hover:shadow-hover transition-all flex items-center gap-4"
              >
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-900">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Redesigned with images */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold font-heading mb-4 text-secondary-900"
            >
              Explore Categories
            </motion.h2>
            <div className="w-24 h-1 bg-accent-500 mx-auto"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                name: "Sneakers",
                image:
                  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600",
              },
              {
                name: "Casual",
                image:
                  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600",
              },
              {
                name: "Running",
                image:
                  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600",
              },
              {
                name: "Basketball",
                image:
                  "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=600",
              },
            ].map((category) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                className="group cursor-pointer relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-ratio aspect-w-1 aspect-h-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-white font-heading">
                      {category.name}
                    </h3>
                    <p className="text-white/80 mt-1 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      Explore Collection →
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bestselling Products - Enhanced with badges and hover effects */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold font-heading text-secondary-900"
              >
                Bestselling Products
              </motion.h2>
              <div className="w-24 h-1 bg-accent-500 mt-4"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/shop"
                className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-2"
              >
                View All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-product hover:shadow-hover transition-all group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative">
                    <div className="aspect-ratio aspect-w-3 aspect-h-4 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {product.stockCount <= 10 && (
                      <div className="absolute top-4 right-4 bg-danger-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Low Stock
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full bg-white text-primary-600 hover:bg-primary-600 hover:text-white py-2 rounded-xl font-medium transition-colors shadow-md">
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-accent-600 font-medium mb-1">
                      {product.brand}
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary-600">
                        ksh {product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center text-primary-500">
                        <span className="mr-1">★★★★</span>
                        <span className="text-xs text-secondary-500">
                          ({product.reviews?.length || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews - Redesigned with cards */}
      <section className="py-16 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-heading text-center mb-2"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-center text-primary-100 mb-12 max-w-2xl mx-auto"
          >
            Don't just take our word for it, hear what our customers have to say
          </motion.p>

          <Swiper
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {products[0]?.reviews?.map((review, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-b from-white/10 to-white/5 p-8 rounded-2xl backdrop-blur-sm h-full"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-400 flex items-center justify-center text-primary-900 font-bold text-xl">
                      {review.username.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold">{review.username}</p>
                      <div className="text-primary-300 text-sm">
                        Verified Buyer
                      </div>
                    </div>
                  </div>
                  <div className="text-yellow-400 mb-4">★★★★★</div>
                  <p className="text-lg italic mb-4">"{review.comment}"</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Newsletter Signup - Enhanced with background pattern */}
      <section className="py-16 bg-accent-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="black"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold font-heading mb-4 text-secondary-900"
            >
              Stay Updated
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg text-secondary-600 mb-8"
            >
              Sign up for exclusive offers, new releases, and 10% off your first
              order.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="p-4 rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto flex-grow max-w-md"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </motion.div>

            <p className="text-xs text-secondary-500 mt-4">
              By subscribing you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </section>

      {/* Brand Partners - New Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-secondary-500 mb-6 text-sm font-medium">
            TRUSTED BY LEADING BRANDS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-60">
            {[
              "Nike",
              "Adidas",
              "Puma",
              "New Balance",
              "Reebok",
              "Under Armour",
            ].map((brand) => (
              <div
                key={brand}
                className="text-2xl font-bold text-secondary-400"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
