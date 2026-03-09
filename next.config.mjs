/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.prayerverses.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
    ],
  },
}

export default nextConfig
