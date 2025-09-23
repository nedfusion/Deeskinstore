import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import ConsultationPage from './pages/ConsultationPage';
import GiftCardPage from './pages/GiftCardPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Product } from './types';

type Page = 'home' | 'about' | 'products' | 'product-detail' | 'cart' | 'auth' | 'account' | 'consultation' | 'gift-cards' | 'blog' | 'faq' | 'checkout' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'admin') {
      setCurrentPage('admin-login');
      setIsAdminMode(true);
      return;
    }
    setCurrentPage(page as Page);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleBack = () => {
    if (currentPage === 'product-detail') {
      setCurrentPage('products');
      setSelectedProduct(null);
    } else {
      setCurrentPage('home');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
          />
        );
      case 'about':
        return (
          <AboutPage
            onBack={handleBack}
          />
        );
      case 'products':
        return (
          <ProductsPage
            onProductClick={handleProductClick}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBack}
          />
        ) : null;
      case 'cart':
        return (
          <CartPage
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        );
      case 'auth':
        return (
          <AuthPage
            onBack={handleBack}
          />
        );
      case 'consultation':
        return (
          <ConsultationPage
            onBack={handleBack}
          />
        );
      case 'gift-cards':
        return (
          <GiftCardPage
            onBack={handleBack}
          />
        );
      case 'blog':
        return (
          <BlogPage
            onBack={handleBack}
          />
        );
      case 'faq':
        return (
          <FAQPage
            onBack={handleBack}
          />
        );
      case 'admin-login':
        return (
          <AdminLoginPage
            onLogin={() => setCurrentPage('admin-dashboard')}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            onLogout={() => {
              setCurrentPage('home');
              setIsAdminMode(false);
            }}
          />
        );
      case 'checkout':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h2>
              <p className="text-gray-600 mb-6">Checkout functionality would be implemented here</p>
              <button
                onClick={() => setCurrentPage('cart')}
                className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Account</h2>
              <p className="text-gray-600 mb-6">Account management features would be implemented here</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
          />
        );
    }
  };

  return (
    <AdminProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {!isAdminMode && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
            <main className="flex-1">
              {renderPage()}
            </main>
            {!isAdminMode && <Footer />}
          </div>
        </CartProvider>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;