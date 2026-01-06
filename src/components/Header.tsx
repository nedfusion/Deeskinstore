import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    {
      name: 'PRODUCTS',
      path: '/products',
      submenu: [
        {
          name: 'Face (Skincare)',
          path: '/products',
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
          path: '/products',
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
          path: '/products',
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
        { name: 'Asian Skincare', path: '/products', category: 'asian' },
        { name: 'African Skincare', path: '/products', category: 'african' },
        { name: 'Under 10K Skincare', path: '/products', category: 'under-10k' },
      ]
    },
    { name: 'CONSULTATION', path: '/consultation' },
    { name: 'GIFT CARDS', path: '/gift-cards' },
    { name: 'BLOG', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="bg-[#0d0499] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <span>Free shipping on orders over ₦15,000 | Business enquiries: business@deeskinstore.com</span>
            <div className="hidden md:flex items-center space-x-4">
              <span>Need help? Call: +2347079228195 | Email: support@deeskinstore.com</span>
              <div className="flex items-center space-x-2">
                <span>Follow us:</span>
                <div className="flex space-x-2">
                  <a href="https://instagram.com/deeskinstore" target="_blank" rel="noopener noreferrer" className="hover:text-[#c6f2f4] transition-colors">IG</a>
                  <a href="https://twitter.com/deeskinstore" target="_blank" rel="noopener noreferrer" className="hover:text-[#c6f2f4] transition-colors">TW</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="./deeskinstore_logo-removebg-preview.png"
                alt="DeeSkinStore Logo"
                className="h-20 w-auto hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

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
                            <Link
                              to={subItem.path}
                              onClick={() => setIsProductsOpen(false)}
                              className="block w-full text-left px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#c6f2f4] hover:text-[#0d0499] transition-colors"
                            >
                              {subItem.name}
                            </Link>
                            {subItem.subcategories && (
                              <div className="ml-4 space-y-1">
                                {subItem.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory}
                                    to={subItem.path}
                                    onClick={() => setIsProductsOpen(false)}
                                    className="block w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#0d0499] transition-colors rounded"
                                  >
                                    {subcategory}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-gray-700 hover:text-[#0d0499] font-medium transition-colors ${
                      location.pathname === item.path ? 'text-[#0d0499]' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <Link
              to="/admin"
              className="text-gray-700 hover:text-[#0d0499] font-medium transition-colors text-sm"
            >
              ADMIN
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors">
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate(authState.isAuthenticated ? '/account' : '/auth')}
              className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors"
            >
              <User className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-600 hover:text-[#0d0499] transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0d0499] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#0d0499]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#0d0499] font-medium"
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-[#0d0499]"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#0d0499] font-medium"
            >
              ADMIN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
