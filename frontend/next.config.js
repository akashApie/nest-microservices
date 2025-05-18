/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:3002/products/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:3002/orders/:path*',
      },
      {
        source: '/api/customers/:path*',
        destination: 'http://localhost:3003/customers/:path*',
      },
    ];
  },
}

module.exports = nextConfig
