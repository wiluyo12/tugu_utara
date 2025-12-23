/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iyefakksklvneifbsfki.supabase.co',
      },
    ],
  },
};

export default nextConfig;
