/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['polhsjatjhxjlswbbzta.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polhsjatjhxjlswbbzta.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig