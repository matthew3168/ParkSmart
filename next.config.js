/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "aws-crt": false,
    };
    return config;
  },
};

module.exports = nextConfig;
