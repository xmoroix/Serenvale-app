import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: isProd,

  experimental: {
    optimizePackageImports: [
      '@lobehub/ui',
      '@lobehub/icons',
      'lucide-react',
      'antd',
    ],
  },

  transpilePackages: ['@lobehub/ui'],

  serverExternalPackages: ['@electric-sql/pglite'],

  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},

  webpack: (config) => {
    // PGLite WASM support
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;
