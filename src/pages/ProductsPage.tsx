import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface ProductsPageProps {
  onProductClick: (product: Product) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSkinConcern, setSelectedSkinConcern] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'Face', 'Bath and Body', 'Asian Skincare', 'African Skincare', 'Under 10K'];
  
  const faceSubcategories = [
    'Cleansers/Washes', 'Toners', 'Serums', 'Exfoliants', 
    'Moisturizers (Creams/Lotions/Oils)', 'Sunscreens', 
    'Travel-Size', 'Bundles/Routines', 'Face Masks', 'Accessories'
  ];
  
  const bodySubcategories = [
    'Body Washes', 'Body Bars (Soaps)', 'Body Moisturizers', 
    'Body Treatments', 'Sunscreens', 'Accessories', 'Bundles/Routines'
  ];
  
  const skinConcernCategories = [
    'Face/Body Acne & Blemishes', 'Hyperpigmentation (Dark Spots/Areas)',
    'Dull/Dehydrated Skin', 'Anti-Aging/Mature Skin', 
    'Atopic Skin (Eczema/Psoriasis)', 'Damaged Skin Barrier/Sensitized Skin',
    'Sensitive Skin', 'Body Care'
  ];
  
  const allCategories = [...categories, ...faceSubcategories, ...bodySubcategories, ...skinConcernCategories];
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];
  const skinConcerns = ['all', ...Array.from(new Set(products.flatMap(p => p.skinConcerns)))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = selectedCategory === 'all' || 
        product.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'Under 10K' && product.price < 30);
      
      const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
      const skinConcernMatch = selectedSkinConcern === 'all' || 
        product.skinConcerns.includes(selectedSkinConcern);
      const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;

      return categoryMatch && brandMatch && skinConcernMatch && priceMatch;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, selectedBrand, selectedSkinConcern, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">{filteredProducts.length} products found</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#c6f2f4]"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View mode toggles */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#0d0499] text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#0d0499] text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white rounded-lg shadow-sm p-6 h-fit`}>
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              {allCategories.slice(0, 15).map((category) => (
                <label key={category} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-2 text-[#0d0499]"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
              {allCategories.length > 15 && (
                <button className="text-sm text-[#0d0499] hover:underline mt-2">
                  Show more categories
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
              {brands.slice(0, 6).map((brand) => (
                <label key={brand} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="mr-2 text-[#0d0499]"
                  />
                  <span className="text-sm text-gray-700 capitalize">{brand}</span>
                </label>
              ))}
            </div>

            {/* Skin Concerns Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Skin Concerns</h4>
              {skinConcerns.slice(0, 6).map((concern) => (
                <label key={concern} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="skinConcern"
                    value={concern}
                    checked={selectedSkinConcern === concern}
                    onChange={(e) => setSelectedSkinConcern(e.target.value)}
                    className="mr-2 text-[#0d0499]"
                  />
                  <span className="text-sm text-gray-700">{concern}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₦{priceRange.min}</span>
                  <span>₦{priceRange.max}+</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSelectedSkinConcern('all');
                setPriceRange({ min: 0, max: 100 });
              }}
              className="w-full px-4 py-2 text-sm text-[#0d0499] border border-[#0d0499] rounded-lg hover:bg-[#0d0499] hover:text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSelectedSkinConcern('all');
                  }}
                  className="text-[#0d0499] font-semibold hover:underline"
                >
                  Clear filters to see all products
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;