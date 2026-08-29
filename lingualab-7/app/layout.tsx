import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LinguaLab — 英语专业学习平台',
  description: '面向英语专业学生的综合学习平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* 全局固定顶部导航栏 */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 点击立刻返回首页 */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#2563eb', letterSpacing: '-0.025em' }}>
                LINGUALAB
              </span>
            </Link>

            {/* 顶部快捷跳转 */}
            <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '600' }}>
              <Link href="/listening" style={{ color: '#475569', textDecoration: 'none' }}>听力</Link>
              <Link href="/reading" style={{ color: '#475569', textDecoration: 'none' }}>阅读</Link>
              <Link href="/speaking" style={{ color: '#475569', textDecoration: 'none' }}>口语</Link>
              <Link href="/vocabulary" style={{ color: '#2563eb', textDecoration: 'none' }}>查词</Link>
            </nav>
          </div>
        </header>

        {/* 页面主主体内容 */}
        <main>{children}</main>
      </body>
    </html>
  );
}
