import './globals.css';
import WordCollector from '@/components/WordCollector'; // 1. 引入划词组件

export const metadata = {
  title: 'LinguaLab — 英语专业学习平台',
  description: '专为英语专业打造的听力、阅读与复习工作台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-slate-50 min-h-screen text-slate-900">
        {children}
        
        {/* 2. 在页面最底部挂载划词生词本浮窗 */}
        <WordCollector />
      </body>
    </html>
  );
}
