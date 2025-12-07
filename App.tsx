import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Catalog } from './modules/catalog/Catalog';
import { Login, Register } from './modules/auth/AuthPages';
import { CartDrawer } from './modules/cart/CartDrawer';
import { Checkout } from './modules/checkout/Checkout';
import { Wishlist } from './modules/wishlist/Wishlist';
import { ProductDetails } from './modules/catalog/ProductDetails';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2024 Lumina E-Commerce. All rights reserved.
            <br />
            <span className="text-xs">
              Frontend by React • Backend Architecture inspired by PHP Modules
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;