/** @type {import('next').NextConfig} */
// Static export for GitHub Pages deployment under /ADAC/.
// basePath is conditional so `npm run dev` continues to work at root.
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/ADAC' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
