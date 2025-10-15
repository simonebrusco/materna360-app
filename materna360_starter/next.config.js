/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/activities', destination: '/brincar', permanent: true },
      { source: '/activities/:slug*', destination: '/brincar/:slug*', permanent: true },
      { source: '/wellbeing', destination: '/cuidar', permanent: true },
      { source: '/profile', destination: '/eu360', permanent: true },
    ];
  },
};
module.exports = nextConfig;
