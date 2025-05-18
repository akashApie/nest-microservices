import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { Product, CartItem } from '../../types';
import { fetchProducts } from '../../utils/api';
import { subscribeToCartUpdates, getCart, addToCart } from '../../utils/cartStorage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();

    // Subscribe to cart updates
    const unsubscribe = subscribeToCartUpdates(() => {
      setCartCount(getCart().reduce((sum: number, item: CartItem) => sum + item.quantity, 0));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Get customer ID from query params only (no localStorage check)
    if (router.query.customerId) {
      setCustomerId(router.query.customerId as string);
    }
  }, [router.query]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCheckout = () => {
    router.push(`/checkout${customerId ? `?customerId=${customerId}` : ''}`);
  };

  return (
    <Layout title="Products | Microservices Shop" cartCount={cartCount}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </Layout>
  );
};

export default ProductsPage;
