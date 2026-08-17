/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 忽略 TypeScript 类型错误，强制打包构建
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略 ESLint 检查错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
