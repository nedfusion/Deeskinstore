import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes - No Header/Footer */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Main App Routes - With Header/Footer */}
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/consultation" element={<ConsultationPage />} />
                      <Route path="/gift-cards" element={<GiftCardPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;
