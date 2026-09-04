/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
