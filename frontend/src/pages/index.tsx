import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <Layout title="Home | Microservices Shop">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Microservices Shop</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          This demo application showcases a microservices architecture with NestJS backend services
          and a Next.js frontend.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Browse Products</h2>
            <p className="mb-6">Explore our catalog of products and add items to your cart.</p>
            <Link href="/products" className="btn btn-primary inline-block">
              View Products
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            <p className="mb-6">Check the status of your orders and view order history.</p>
            <Link href="/orders" className="btn btn-primary inline-block">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
