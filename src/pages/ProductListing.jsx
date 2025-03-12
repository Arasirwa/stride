import React, { useEffect } from "react";
import {
  ChevronDown,
  X,
  Filter,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import useProductStore from "../stores/productStore";

const ProductListing = () => {
  // Get store state and actions
  const {
    fetchProducts,
    filteredProducts,
    isLoading,
    error,
    selectedBrands,
    selectedCategories,
    priceRange,
    genderFilter,
    sortOption,
    toggleBrand,
    toggleCategory,
    setPriceRange,
    setGenderFilter,
    setSortOption,
    clearFilters,
    products,
  } = useProductStore();

  // State for mobile filters
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get all brands from products
  const allBrands = [...new Set(products.map((product) => product.brand))];

  // Get all categories from products
  const allCategories = [
    ...new Set(products.flatMap((product) => product.categories)),
  ];

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-secondary-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-secondary-700">Loading products...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-secondary-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle size={24} className="mr-2" />
            <h2 className="text-xl font-bold">Error Loading Products</h2>
          </div>
          <p className="text-secondary-700 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 mb-8">
          Shop All Shoes
        </h1>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 bg-white shadow-sm"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>

          {/* Mobile Sort Dropdown */}
          <div className="relative inline-block">
            <select
              className="appearance-none bg-white border border-secondary-300 text-secondary-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bestselling">Bestsellers</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-product p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-secondary-900 flex items-center">
                  <SlidersHorizontal size={18} className="mr-2" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-secondary-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 mr-2"
                      />
                      <span className="text-secondary-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-secondary-900 mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  {allCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 mr-2"
                      />
                      <span className="text-secondary-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-secondary-900 mb-3">
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-secondary-600 mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-secondary-900 mb-3">Gender</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      genderFilter === "all"
                        ? "bg-primary-100 text-primary-800 border-primary-200"
                        : "bg-secondary-100 text-secondary-700 border-secondary-200"
                    } border`}
                    onClick={() => setGenderFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      genderFilter === "men"
                        ? "bg-primary-100 text-primary-800 border-primary-200"
                        : "bg-secondary-100 text-secondary-700 border-secondary-200"
                    } border`}
                    onClick={() => setGenderFilter("men")}
                  >
                    Men
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      genderFilter === "women"
                        ? "bg-primary-100 text-primary-800 border-primary-200"
                        : "bg-secondary-100 text-secondary-700 border-secondary-200"
                    } border`}
                    onClick={() => setGenderFilter("women")}
                  >
                    Women
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      genderFilter === "unisex"
                        ? "bg-primary-100 text-primary-800 border-primary-200"
                        : "bg-secondary-100 text-secondary-700 border-secondary-200"
                    } border`}
                    onClick={() => setGenderFilter("unisex")}
                  >
                    Unisex
                  </button>
                </div>
              </div>
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                  onClick={() => setMobileFiltersOpen(false)}
                ></div>
                <div className="absolute inset-y-0 right-0 max-w-full flex">
                  <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl">
                      {/* Header */}
                      <div className="px-4 py-6 bg-primary-600 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-white">
                            Filters
                          </h2>
                          <button
                            type="button"
                            className="text-white hover:text-secondary-200"
                            onClick={() => setMobileFiltersOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <X size={24} />
                          </button>
                        </div>
                      </div>

                      {/* Filter Content */}
                      <div className="relative flex-1 py-6 px-4 sm:px-6 overflow-y-auto">
                        {/* Clear all button */}
                        <div className="mb-6 flex justify-end">
                          <button
                            onClick={() => {
                              clearFilters();
                              setMobileFiltersOpen(false);
                            }}
                            className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-8">
                          <h3 className="font-medium text-secondary-900 mb-3">
                            Brand
                          </h3>
                          <div className="space-y-3">
                            {allBrands.map((brand) => (
                              <label key={brand} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedBrands.includes(brand)}
                                  onChange={() => toggleBrand(brand)}
                                  className="rounded text-primary-600 focus:ring-primary-500 h-5 w-5 mr-3"
                                />
                                <span className="text-secondary-700 text-lg">
                                  {brand}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                          <h3 className="font-medium text-secondary-900 mb-3">
                            Category
                          </h3>
                          <div className="space-y-3">
                            {allCategories.map((category) => (
                              <label
                                key={category}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(
                                    category
                                  )}
                                  onChange={() => toggleCategory(category)}
                                  className="rounded text-primary-600 focus:ring-primary-500 h-5 w-5 mr-3"
                                />
                                <span className="text-secondary-700 text-lg">
                                  {category}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-8">
                          <h3 className="font-medium text-secondary-900 mb-3">
                            Price Range
                          </h3>
                          <div className="px-2">
                            <input
                              type="range"
                              min="0"
                              max="2000"
                              step="100"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value),
                                ])
                              }
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-secondary-600 mt-2">
                              <span>₹{priceRange[0]}</span>
                              <span>₹{priceRange[1]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Gender Filter */}
                        <div className="mb-8">
                          <h3 className="font-medium text-secondary-900 mb-3">
                            Gender
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            <button
                              className={`px-4 py-2 rounded-full text-base ${
                                genderFilter === "all"
                                  ? "bg-primary-100 text-primary-800 border-primary-200"
                                  : "bg-secondary-100 text-secondary-700 border-secondary-200"
                              } border`}
                              onClick={() => setGenderFilter("all")}
                            >
                              All
                            </button>
                            <button
                              className={`px-4 py-2 rounded-full text-base ${
                                genderFilter === "men"
                                  ? "bg-primary-100 text-primary-800 border-primary-200"
                                  : "bg-secondary-100 text-secondary-700 border-secondary-200"
                              } border`}
                              onClick={() => setGenderFilter("men")}
                            >
                              Men
                            </button>
                            <button
                              className={`px-4 py-2 rounded-full text-base ${
                                genderFilter === "women"
                                  ? "bg-primary-100 text-primary-800 border-primary-200"
                                  : "bg-secondary-100 text-secondary-700 border-secondary-200"
                              } border`}
                              onClick={() => setGenderFilter("women")}
                            >
                              Women
                            </button>
                            <button
                              className={`px-4 py-2 rounded-full text-base ${
                                genderFilter === "unisex"
                                  ? "bg-primary-100 text-primary-800 border-primary-200"
                                  : "bg-secondary-100 text-secondary-700 border-secondary-200"
                              } border`}
                              onClick={() => setGenderFilter("unisex")}
                            >
                              Unisex
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Apply Filters Button */}
                      <div className="border-t border-secondary-200 p-4">
                        <button
                          onClick={() => setMobileFiltersOpen(false)}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors text-base font-medium"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-secondary-600">
                Showing {filteredProducts.length} results
              </p>

              <div className="relative inline-block w-64">
                <select
                  className="appearance-none w-full bg-white border border-secondary-300 text-secondary-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="bestselling">Bestsellers</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Empty state if no products match filters */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-500 mb-4">
                  <Filter size={24} />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No products found
                </h3>
                <p className="text-secondary-600 mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Grid of Products */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination - only show if we have products */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {/* Pagination controls remain the same */}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
