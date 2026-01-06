import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Shield, Truck, Award, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productsService } from '../services/products';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onProductClick }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setAllProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredProducts = allProducts.filter(p => p.isPopular);
  const newProducts = allProducts.filter(p => p.isNew);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="./banner.png"
            alt="DeeSkinStore Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Skin
              <span className="block text-[#c6f2f4]">Deserves the Best</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="bg-white text-[#0d0499] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('consultation')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#0d0499] transition-colors"
              >
                Free Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#0d0499]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">100% genuine products from authorized retailers</p>
            </div>
            <div className="text-center">
              <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-[#0d0499]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above ₦15,000</p>
            </div>
            <div className="text-center">
              <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[#0d0499]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Curation</h3>
              <p className="text-gray-600">Dermatologist-approved skincare selection</p>
            </div>
            <div className="text-center">
              <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#0d0499]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">30-day money-back guarantee on all orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Sellers</h2>
              <p className="text-gray-600">Our most loved products by customers</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-[#0d0499] font-semibold flex items-center hover:text-[#c6f2f4] transition-colors"
            >
              View All
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
          
          {/* Show all products if no featured products */}
          {featuredProducts.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover skincare solutions tailored to your specific needs and preferences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer" onClick={() => onNavigate('products')}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Face Skincare"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Face Skincare</h3>
                    <p className="text-sm opacity-90">Serums, moisturizers & treatments</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => onNavigate('products')}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Bath and Body"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Bath & Body</h3>
                    <p className="text-sm opacity-90">Cleansers, scrubs & lotions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => onNavigate('products')}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/7929553/pexels-photo-7929553.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Asian Skincare"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Asian Skincare</h3>
                    <p className="text-sm opacity-90">K-beauty & J-beauty essentials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
              <p className="text-gray-600">Latest additions to our skincare collection</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-[#0d0499] font-semibold flex items-center hover:text-[#c6f2f4] transition-colors"
            >
              View All
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
          
          {/* Show all products if no new products */}
          {newProducts.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.slice(4, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
              <p className="text-gray-600">Complete collection of our skincare products</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-[#0d0499] font-semibold flex items-center hover:text-[#c6f2f4] transition-colors"
            >
              View All
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#0d0499] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Skincare Tips</h2>
          <p className="text-lg mb-8 text-gray-200">
            Get the latest skincare advice, product launches, and exclusive offers delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 text-gray-900 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#c6f2f4]"
            />
            <button className="bg-[#c6f2f4] text-[#0d0499] px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg hover:bg-opacity-90 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            No spam, unsubscribe anytime. Your privacy is important to us.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;