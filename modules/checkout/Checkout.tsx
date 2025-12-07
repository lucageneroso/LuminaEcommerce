import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckoutStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, CreditCard, Home, User } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const [status, setStatus] = useState<CheckoutStatus>(CheckoutStatus.IDLE);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(CheckoutStatus.PROCESSING);
    
    // Simulate API call to PHP backend for order processing
    setTimeout(() => {
      setStatus(CheckoutStatus.SUCCESS);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && status !== CheckoutStatus.SUCCESS) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-accent hover:underline"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  if (status === CheckoutStatus.SUCCESS) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for your purchase. We have sent a confirmation email to your inbox.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section aria-labelledby="shipping-heading">
            <h2 id="shipping-heading" className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
              <Home size={20} /> Shipping Information
            </h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </form>
          </section>

          <section aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard size={20} /> Payment Details
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiration (MM/YY)</label>
                <input type="text" placeholder="MM/YY" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <input type="text" placeholder="123" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:pl-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="flex py-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            
            <button
              form="checkout-form"
              type="submit"
              disabled={status === CheckoutStatus.PROCESSING}
              className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {status === CheckoutStatus.PROCESSING ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
