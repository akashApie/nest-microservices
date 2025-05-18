import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  cartCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Microservices Demo', cartCount = 0 }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Microservices demo with Next.js frontend" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          {children}
        </main>
        <footer className="bg-gray-100 py-6">
          <div className="container text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Microservices Demo
          </div>
        </footer>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export default Layout;
