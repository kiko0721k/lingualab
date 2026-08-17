/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 强制跳过 TypeScript 错误检查
    ignoreBuildErrors: true,
  },
  eslint: {
    // 强制跳过 ESLint 检查
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
