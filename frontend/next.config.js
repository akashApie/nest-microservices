/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:3001/products/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:3001/orders/:path*',
      },
      {
        source: '/api/customers/:path*',
        destination: 'http://localhost:3000/customers/:path*',
      },
    ];
  },
}

module.exports = nextConfig
