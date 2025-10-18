// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // se você usa app/ e edge, mantenha suas flags aqui
  webpack: (config) => {
    // alias "@/..." -> "materna360_starter/..."
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "materna360_starter"),
    };
    return config;
  },
};

module.exports = nextConfig;
