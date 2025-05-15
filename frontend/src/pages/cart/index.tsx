import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal } from '../../utils/cartStorage';
import { CartItem } from '../../types';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Load cart from localStorage
    const items = getCart();
    setCartItems(items);
    setTotal(getCartTotal());
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItemQuantity(productId, newQuantity);
    
    // Update local state
    setCartItems(getCart());
    setTotal(getCartTotal());
    toast.success('Cart updated!');
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    
    // Update local state
    setCartItems(getCart());
    setTotal(getCartTotal());
    toast.success('Item removed from cart!');
  };

  return (
    <Layout title="Cart | Microservices Shop">
      <div>
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-500">{item.product.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded-l"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">
                      Cart Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-lg">
                      ${total.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="flex justify-between">
              <Link href="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <Link href="/checkout" className="btn btn-primary">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
