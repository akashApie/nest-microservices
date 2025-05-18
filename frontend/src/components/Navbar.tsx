import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCart, subscribeToCartUpdates } from '../utils/cartStorage';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [cartItemsCount, setCartItemsCount] = React.useState(0);
  
  // Update cart count when component mounts and when route changes
  React.useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartItemsCount(cart.reduce((total, item) => total + item.quantity, 0));
    };
    
    updateCartCount();
    
    // Add event listener for storage changes
    window.addEventListener('storage', updateCartCount);
    router.events.on('routeChangeComplete', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      router.events.off('routeChangeComplete', updateCartCount);
    };
  }, [router.events]);

  React.useEffect(() => {
    // Initial cart count
    setCartItemsCount(getCart().reduce((sum: number, item: any) => sum + item.quantity, 0));
    
    // Subscribe to cart updates
    const unsubscribe = subscribeToCartUpdates(() => {
      setCartItemsCount(getCart().reduce((sum: number, item: any) => sum + item.quantity, 0));
    });
    
    return () => unsubscribe();
  }, []);

  const isActive = (pathname: string) => router.pathname === pathname;
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Microservices Shop
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/products" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive('/products') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`} onClick={() => {
                  // Clear customer data when navigating to products via navbar
                  localStorage.removeItem('customer');
                  localStorage.removeItem('customerId');
                }}>
                Products
              </Link>
              <Link href="/orders" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive('/orders') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                Orders
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/cart" 
              className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                isActive('/cart') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 bg-white hover:bg-gray-100'
              }`}>
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
