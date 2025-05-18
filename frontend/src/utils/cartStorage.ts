import { CartItem, Product } from '../types';

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : [];
};

let listeners: (() => void)[] = [];

export const subscribeToCartUpdates = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

const notifyCartUpdate = () => {
  listeners.forEach(callback => callback());
};

// Add item to cart
export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.productId === product.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already in cart
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      productId: product.id,
      product,
      quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyCartUpdate();
};

// Update cart item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.productId === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart[itemIndex].quantity = quantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    notifyCartUpdate();
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  notifyCartUpdate();
};

// Clear cart
export const clearCart = (): void => {
  localStorage.setItem('cart', JSON.stringify([]));
  notifyCartUpdate();
};

// Calculate cart total
export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};
