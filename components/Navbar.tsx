import React from 'react';
import { ShoppingCart, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { user, logout } = useAuth();
  // 1. Recuperiamo anche clearWishlist
  const { itemCount, wishlist, clearCart, clearWishlist } = useShop();
  const location = useLocation();

  // 2. Aggiorniamo la funzione di logout
  const handleLogout = () => {
    clearCart();      // Svuota carrello
    clearWishlist();  // Svuota wishlist
    logout();         // Logout utente
  };

  return (
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                Lumina
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                    to="/"
                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}
                >
                  Catalog
                </Link>
                <Link
                    to="/wishlist"
                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/wishlist' ? 'text-primary' : 'text-gray-500'}`}
                >
                  Wishlist
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 hidden sm:block">Hello, {user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
              ) : (
                  <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
                    <UserIcon size={20} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
              )}

              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              <Link to="/wishlist" className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                <Heart size={22} />
                {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlist.length}
                </span>
                )}
              </Link>

              <button
                  onClick={onCartClick}
                  className="relative p-2 text-gray-500 hover:text-primary transition-colors"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {itemCount}
                </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
};