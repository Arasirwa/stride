import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const ratingAvg =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <Link to={`/product/${product.id}`} className="bg-white shadow-product rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-hover hover:-translate-y-1">
      {/* Badge for bestseller */}
      {product.isBestselling && (
        <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-bl-xl z-10">
          Bestseller
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-60 overflow-hidden bg-secondary-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {product.discountPrice && (
          <div className="absolute top-2 left-2 bg-danger-600 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="text-xs text-secondary-500 uppercase font-medium mb-1">
          {product.brand}
        </div>
        <h3 className="font-medium text-secondary-900 mb-1 truncate">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-accent-500">
            {[...Array(Math.floor(ratingAvg))].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
            {ratingAvg % 1 !== 0 && <StarHalf size={14} fill="currentColor" />}
          </div>
          <span className="text-xs text-secondary-600 ml-1">
            ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-danger-600">
                Ksh {product.discountPrice.toLocaleString()}
              </span>
              <span className="text-secondary-500 text-sm line-through">
                Ksh {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-bold text-secondary-900">
              Ksh {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sizes Preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.map((sizeObj) => (
            <span
              key={sizeObj.size}
              className={`text-xs px-2 py-1 rounded border ${
                sizeObj.available
                  ? "border-secondary-300 text-secondary-700"
                  : "border-secondary-200 text-secondary-400 bg-secondary-50"
              }`}
            >
              {sizeObj.size}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
