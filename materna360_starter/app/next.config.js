/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname + '/materna360_starter';
    return config;
  },
};

module.exports = nextConfig;
