import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: authState } = useAuth();

  const navigation = [
    { name: 'HOME', page: 'home' },
    {
      name: 'PRODUCTS',
      page: 'products',
      submenu: [
        { 
          name: 'Face (Skincare)', 
          page: 'products', 
          category: 'face',
          subcategories: [
            'Cleansers/Washes',
            'Toners',
            'Serums',
            'Exfoliants',
            'Moisturizers (Creams/Lotions/Oils)',
            'Sunscreens',
            'Travel-Size',
            'Bundles/Routines',
            'Face Masks',
            'Accessories'
          ]
        },
        { 
          name: 'Bath and Body (Skincare)', 
          page: 'products', 
          category: 'bath-body',
          subcategories: [
            'Body Washes',
            'Body Bars (Soaps)',
            'Body Moisturizers',
            'Body Treatments',
            'Sunscreens',
            'Accessories',
            'Bundles/Routines'
          ]
        },
        { 
          name: 'Shop by Skin Concerns', 
          page: 'products', 
          category: 'skin-concerns',
          subcategories: [
            'Face/Body Acne & Blemishes',
            'Hyperpigmentation (Dark Spots/Areas)',
            'Dull/Dehydrated Skin',
            'Anti-Aging/Mature Skin',
            'Atopic Skin (Eczema/Psoriasis)',
            'Damaged Skin Barrier/Sensitized Skin',
            'Sensitive Skin',
            'Body Care'
          ]
        },
        { name: 'Asian Skincare', page: 'products', category: 'asian' },
        { name: 'African Skincare', page: 'products', category: 'african' },
        { name: 'Under 10K Skincare', page: 'products', category: 'under-10k' },
      ]
    },
    { name: 'CONSULTATION', page: 'consultation' },
    { name: 'GIFT CARDS', page: 'gift-cards' },
    { name: 'BLOG', page: 'blog' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0d0499] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <span>Free shipping on orders over ₦15,000</span>
            <div className="hidden md:flex items-center space-x-4">
              <span>Need help? Call: +234 (0) 123 456 789</span>
              <div className="flex items-center space-x-2">
                <span>Follow us:</span>
                <div className="flex space-x-2">
                  <a href="#" className="hover:text-[#c6f2f4] transition-colors">FB</a>
                  <a href="#" className="hover:text-[#c6f2f4] transition-colors">IG</a>
                  <a href="#" className="hover:text-[#c6f2f4] transition-colors">TW</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-[#0d0499] hover:text-[#c6f2f4] transition-colors"
            >
              DeeSkinStore
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <button className="flex items-center text-gray-700 hover:text-[#0d0499] font-medium transition-colors">
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {isProductsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
                        {item.submenu.map((subItem) => (
                          <div key={subItem.name} className="mb-2">
                            <button
                              onClick={() => {
                                onNavigate(subItem.page);
                                setIsProductsOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#c6f2f4] hover:text-[#0d0499] transition-colors"
                            >
                              {subItem.name}
                            </button>
                            {subItem.subcategories && (
                              <div className="ml-4 space-y-1">
                                {subItem.subcategories.map((subcategory) => (
                                  <button
                                    key={subcategory}
                                    onClick={() => {
                                      onNavigate(subItem.page);
                                      setIsProductsOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#0d0499] transition-colors rounded"
                                  >
                                    {subcategory}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(item.page)}
                    className={`text-gray-700 hover:text-[#0d0499] font-medium transition-colors ${
                      currentPage === item.page ? 'text-[#0d0499]' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* User account */}
            <button
              onClick={() => onNavigate(authState.isAuthenticated ? 'account' : 'auth')}
              className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Shopping cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0d0499] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#0d0499]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => {
                    onNavigate(item.page);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#0d0499] font-medium"
                >
                  {item.name}
                </button>
                {item.submenu && (
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => {
                          onNavigate(subItem.page);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-[#0d0499]"
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;