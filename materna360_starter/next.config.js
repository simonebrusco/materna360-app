// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Garante que "@/..." resolva a partir da RAIZ do projeto
  // (onde estão "app/" e "lib/").
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
