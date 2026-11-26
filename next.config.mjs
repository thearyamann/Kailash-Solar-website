/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimized images/video in public/opt never change in place (a new version gets a new file name),
  // so phones can keep them for a year instead of re-checking them on every visit.
  async headers() {
    return [
      {
        source: '/opt/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/solar-company-meerut',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
