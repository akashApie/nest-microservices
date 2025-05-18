import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { fetchOrdersByCustomerId, fetchCustomerById } from '../../utils/api';
import { Order, Customer } from '../../types';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Save customer ID if received from checkout
    
    console.log('Received customer details:', {
      id: router.query.customerId,
      name: router.query.customerName,
      email: router.query.customerEmail
    });
    
    // Simulate getting the customer ID from session/local storage
    // In a real app, you would get this from authentication
    const getCustomerIdFromStorage = (): string | null => {
      return router.query.customerId as string || 
        (typeof window !== 'undefined' ? localStorage.getItem('customerId') : null);
    };

    const getOrders = async () => {
      try {
        setLoading(true);
        const customerId = getCustomerIdFromStorage();
        
        if (!customerId) {
          if (router.pathname !== '/') {
            router.replace('/');
          }
          return;
        }
        
        // Fetch customer details
        const customerData = await fetchCustomerById(customerId);
        setCustomer(customerData);
        
        // Fetch orders for this customer
        const orderData = await fetchOrdersByCustomerId(customerId);
        setOrders(orderData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const handleShopMore = () => {
    // Only set customer ID when clicking Shop More
    if (router.query.customerId) {
      localStorage.setItem('customer', JSON.stringify({
        id: router.query.customerId as string,
        name: router.query.customerName as string,
        email: router.query.customerEmail as string,
        phone: router.query.customerPhone as string,
        address: router.query.customerAddress as string
      }));
    }
    router.push(router.query.customerId ? `/products?customerId=${router.query.customerId}` : '/products');
  };

  return (
    <Layout title="Orders | Microservices Shop">
      <div className="space-y-6">
        {router.query.customerName && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Customer ID:</p>
                <p>{router.query.customerId}</p>
              </div>
              <div>
                <p className="font-semibold">Name:</p>
                <p>{router.query.customerName}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{router.query.customerEmail}</p>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            {error.includes('customer') && (
              <div className="mt-4">
                <Link href="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        )}
        
        {!loading && !error && customer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">Customer Information</h2>
                <p className="text-blue-700">{customer.name}</p>
                <p className="text-blue-600">{customer.email}</p>
                {customer.phone && <p className="text-blue-600">{customer.phone}</p>}
              </div>
              <div>
                <p className="text-sm text-blue-600">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        )}
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{typeof order.id === 'string' ? order.id.substring(0, 8) : order.id}</h3>
                    <p className="text-gray-500">
                      Placed: {new Date(order.orderDate || order.createdAt).toLocaleDateString()} at {new Date(order.orderDate || order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-md font-medium mb-2">Items</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(order.items || order.orderItems || []).map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">{item.product ? item.product.name : `Product #${item.productId}`}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">${Number(item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-2">${(Number(item.price || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between border-t pt-4">
                  <div>
                    <p className="text-gray-600">Order ID: <span className="font-mono">{order.id}</span></p>
                    {order.status === 'pending' && (
                      <p className="text-yellow-600 mt-2">
                        Your order is being processed. You&apos;ll receive an update once it ships.
                      </p>
                    )}
                  </div>
                  <div className="text-lg font-bold">
                    <p className="text-lg font-semibold">Total: ${Number(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 text-center">
            <button 
              onClick={handleShopMore}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Shop More Products
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
