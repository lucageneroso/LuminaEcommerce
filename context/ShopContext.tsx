import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, WishlistItem } from '../types';
import { useAuth } from './AuthContext'; // Importiamo AuthContext
import { WishlistService } from '../services/mockApi'; // Importiamo il servizio

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  cartTotal: number;
  itemCount: number;
  clearCart: () => void;
  clearWishlist: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Prendiamo l'utente corrente
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Caricamento iniziale (Local Storage)
  useEffect(() => {
    const savedCart = localStorage.getItem('lumina_cart');
    // Carichiamo la wishlist da locale solo se non c'è utente, oppure come placeholder iniziale
    const savedWish = localStorage.getItem('lumina_wishlist');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWish && !user) setWishlist(JSON.parse(savedWish));
  }, []);

  // SINCRONIZZAZIONE DATABASE AL LOGIN
  useEffect(() => {
    const syncWishlist = async () => {
      if (user) {
        try {
          // Se l'utente è loggato, scarichiamo la sua lista dal DB
          const response = await WishlistService.getUserWishlist(user.id);
          if (response.success && response.data) {
            // Convertiamo i prodotti in WishlistItem (aggiungendo addedAt se manca)
            const dbWishlist: WishlistItem[] = response.data.map(p => ({
              ...p,
              addedAt: new Date() // O usa la data reale dal DB se vuoi
            }));
            setWishlist(dbWishlist);
          }
        } catch (error) {
          console.error("Errore sync wishlist", error);
        }
      } else {
        // Se si fa logout, svuotiamo (o ricarichiamo da locale se preferisci)
        setWishlist([]);
      }
    };
    syncWishlist();
  }, [user]); // Si attiva ogni volta che l'utente cambia (login/logout)

  // Salvataggio Local Storage
  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  // Salvataggio Local Storage (Solo come backup o per guest)
  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
    ));
  };

  const toggleWishlist = async (product: Product) => {
    // 1. Aggiornamento Ottimistico (UI immediata)
    let action: 'add' | 'remove' = 'add';

    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        action = 'remove';
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, { ...product, addedAt: new Date() }];
    });

    // 2. Sincronizzazione Database (Se loggato)
    if (user) {
      try {
        await WishlistService.toggleItem(user.id, product.id, action);
      } catch (err) {
        console.error("Errore salvataggio wishlist", err);
        // Qui potresti fare un rollback dello stato se fallisce
      }
    }
  };

  const clearCart = () => setCart([]);
  const clearWishlist = () => setWishlist([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
      <ShopContext.Provider value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        cartTotal,
        itemCount,
        clearCart,
        clearWishlist
      }}>
        {children}
      </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};