import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, CheckCircle, Truck, RotateCcw, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { dispatch } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, size: selectedSize, quantity }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.picture}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-[#0d0499] mx-auto mb-2" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <RotateCcw className="h-6 w-6 text-[#0d0499] mx-auto mb-2" />
                <p className="text-xs text-gray-600">30-Day Return</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-[#0d0499] mx-auto mb-2" />
                <p className="text-xs text-gray-600">Authentic</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-[#0d0499]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-medium rounded">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center">
              {product.inStock ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-[#0d0499] bg-[#0d0499] text-white'
                          : 'border-gray-300 hover:border-[#0d0499] text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 bg-gray-50 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Skin Concerns Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Addresses</h3>
              <div className="flex flex-wrap gap-2">
                {product.skinConcerns.map((concern) => (
                  <span
                    key={concern}
                    className="px-3 py-1 bg-[#c6f2f4] text-[#0d0499] text-sm rounded-full"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={addToCart}
                disabled={!product.inStock}
                className="flex-1 bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'ingredients', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-[#0d0499] text-[#0d0499]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Suitable for</h4>
                    <ul className="text-gray-600 space-y-1">
                      {product.skinTypes.map((type) => (
                        <li key={type}>• {type} skin</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Available sizes</h4>
                    <ul className="text-gray-600 space-y-1">
                      {product.sizes.map((size) => (
                        <li key={size}>• {size}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Key Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ingredients.map((ingredient) => (
                    <div key={ingredient} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Customer Reviews ({product.reviewCount})
                  </h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{product.rating} out of 5</span>
                  </div>
                </div>
                
                {/* Sample reviews */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-[#c6f2f4] rounded-full flex items-center justify-center">
                          <span className="text-[#0d0499] font-medium">JS</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">Jane Smith</h4>
                          <div className="ml-4 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          This product is amazing! I've been using it for 2 weeks and already see a difference in my skin texture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;