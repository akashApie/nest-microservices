import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getCart, clearCart, getCartTotal } from '../../utils/cartStorage';
import { createCustomer, createOrder } from '../../utils/api';
import { CartItem } from '../../types';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      // Redirect to cart if empty
      router.push('/cart');
      return;
    }
    
    setCartItems(items);
    setTotal(getCartTotal());
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. Create/get customer
      const customer = await createCustomer({
        name,
        email,
        phone,
        address
      });
      
      // 2. Create order
      const order = await createOrder(customer.id, cartItems);
      
      // 3. Clear cart
      clearCart();
      
      // 4. Show success and redirect to order confirmation
      toast.success('Order placed successfully!');
      router.push('/orders');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Checkout | Microservices Shop">
      <div>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="form-label">Shipping Address</label>
                <textarea
                  id="address"
                  className="form-input"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.productId} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
