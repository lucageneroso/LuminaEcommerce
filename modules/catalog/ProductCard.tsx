import React from 'react';
import { Product } from '../../types';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none lg:h-80 relative">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/50 text-gray-700 hover:bg-white'
          }`}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex items-center gap-1 text-yellow-500 text-xs">
          <Star size={14} fill="currentColor" />
          <span className="text-gray-500 ml-1">{product.rating}</span>
        </div>
        
        <h3 className="text-sm text-gray-700 mb-1 flex-1">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm font-medium text-gray-500 mb-4">{product.category}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="relative z-10 p-2 text-primary bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};