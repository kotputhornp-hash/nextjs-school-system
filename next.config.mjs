/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone', // เพิ่มเพื่อให้ Vercel จัดการไฟล์ได้ดีขึ้น
};

export default nextConfig;