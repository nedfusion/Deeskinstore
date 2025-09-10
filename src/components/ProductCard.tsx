import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { dispatch } = useCart();

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, size: product.sizes[0] }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.picture}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {product.isNew && (
            <span className="bg-[#c6f2f4] text-[#0d0499] px-2 py-1 text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Quick add to cart */}
        <button
          onClick={addToCart}
          className="absolute bottom-3 right-3 p-2 bg-[#0d0499] text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-90"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        
        {/* Product name */}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0d0499] transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">({product.reviewCount})</span>
        </div>

        {/* Skin concerns */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.skinConcerns.slice(0, 2).map((concern) => (
            <span
              key={concern}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {concern}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#0d0499]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Stock status */}
          <span className={`text-xs px-2 py-1 rounded ${
            product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;