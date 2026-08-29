'use client';

import Link from 'next/link';

const CATEGORIES = [
  { id: 'BBC', name: 'BBC Learning English', tag: '官方精选', code: 'BBC', desc: '包含 6 Minute English 等经典地道听力材料。' },
  { id: 'VOA', name: 'VOA Learning English', tag: '慢速美音', code: 'VOA', desc: '适合语感培养与慢速听写训练，语速平缓分明。' },
  { id: 'TED', name: 'TED Talks', tag: '深度演讲', code: 'TED', desc: '前沿观点与地道学术表达，适合精听与长难句拆解。' },
  { id: 'CET4', name: 'CET-4 大学英语四级', tag: '真题精听', code: 'CET4', desc: '四级听力真题精选，涵盖校园与日常交流场景。' },
  { id: 'CET6', name: 'CET-6 大学英语六级', tag: '真题精听', code: 'CET6', desc: '六级听力真题，高频词汇与复杂句式精听。' },
  { id: 'TEM4', name: 'TEM-4 专四听力', tag: '专业核心', code: 'TEM4', desc: '专四听写与听力理解真题，针对专四题型突破。' },
  { id: 'TEM8', name: 'TEM-8 专八 Mini-Lecture', tag: '专业高阶', code: 'TEM8', desc: '专八 Mini-Lecture 听力讲座与笔记填空专项训练。' },
  { id: 'LITERATURE', name: '英美文学经典音频', tag: '名著朗读', code: 'LITERATURE', desc: '经典名著音频朗读，赏析文学名篇与地道发音。' },
  { id: 'NEWS', name: '新闻综合听力', tag: '实时新闻', code: 'NEWS', desc: '全球新闻播报与文化经济资讯，拓展国际视野。' },
];

export default function ListeningPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'sans-serif' }}>
      {/* 顶部导航 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <Link href="/" style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
            LINGUALAB
          </Link>
          <nav style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 600 }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>首页</Link>
            <Link href="/listening" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>听力</Link>
            <Link href="/reading" style={{ color: '#475569', textDecoration: 'none' }}>阅读</Link>
            <Link href="/speaking" style={{ color: '#475569', textDecoration: 'none' }}>口语</Link>
            <Link href="/vocabulary" style={{ color: '#475569', textDecoration: 'none' }}>查词</Link>
          </nav>
        </div>
      </header>

      {/* 主体卡片版面 */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Listening Hub</h1>
          <p style={{ marginTop: '12px', fontSize: '16px', color: '#64748b' }}>选择专区进入材料库，开始逐句精听与划词学习</p>
        </div>

        {/* 9 大卡片网格 - 使用内联 Flex/Grid 绝对保障排版不塌陷 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              style={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ borderRadius: '6px', backgroundColor: '#eff6ff', padding: '4px 10px', fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                    {cat.tag}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{cat.code}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>{cat.name}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0', minHeight: '44px' }}>{cat.desc}</p>
              </div>
              <button
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  backgroundColor: '#2563eb',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                进入材料库 →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
