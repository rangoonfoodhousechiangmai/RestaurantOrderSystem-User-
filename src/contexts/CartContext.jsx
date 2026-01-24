import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    const addonPart = item.selectedAddon && item.selectedAddon.length > 0 ? item.selectedAddon.map(a => a.eng_name).sort().join(',') : 'none';
    const uniqueId = `${item.id}-${item.selectedProtein?.eng_name || 'none'}-${addonPart}-${item.selectedFlavor?.eng_name || 'none'}`;
    // console.log(uniqueId);
    setCart(prevCart => {
      const existing = prevCart.find(c => c.uniqueId === uniqueId);
      if (existing) {
        return prevCart.map(c =>
          c.uniqueId === uniqueId ? { ...c, quantity: c.quantity + quantity } : c
        );
      } else {
        return [...prevCart, { ...item, quantity, uniqueId }];
      }
    });
  };

  const updateQuantity = (uniqueId, quantity) => {
    if (quantity < 1) {
      // removeFromCart(uniqueId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.uniqueId === uniqueId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (uniqueId) => {
    // console.log('removing...')
    setCart(prevCart => prevCart.filter(item => item.uniqueId !== uniqueId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
