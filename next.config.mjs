/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
