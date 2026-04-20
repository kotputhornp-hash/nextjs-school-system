/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // เพิ่มบรรทัดนี้เพื่อช่วยเรื่องการจัดการ CSS
  poweredByHeader: false,
};

export default nextConfig;