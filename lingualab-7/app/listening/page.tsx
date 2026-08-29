import Link from 'next/link';

const categories = [
  { id: 'bbc', title: 'BBC Learning English', badge: '官方精选', desc: '包含 6 Minute English 等经典地道听力材料。' },
  { id: 'voa', title: 'VOA Learning English', badge: '慢速美音', desc: '适合语感培养与慢速听写训练，语速平缓分明。' },
  { id: 'ted', title: 'TED Talks', badge: '深度演讲', desc: '前沿观点与地道学术表达，适合精听与长难句拆解。' },
  { id: 'cet4', title: 'CET-4 大学英语四级', badge: '真题精听', desc: '四级听力真题精选，涵盖校园与日常交流场景。' },
  { id: 'cet6', title: 'CET-6 大学英语六级', badge: '真题精听', desc: '六级听力真题，高频词汇与复杂句式精析。' },
  { id: 'tem4', title: 'TEM-4 专四听力', badge: '专业核心', desc: '专四听写与听力理解真题，针对专四题型突破。' },
  { id: 'tem8', title: 'TEM-8 专八 Mini-Lecture', badge: '专业高阶', desc: '专八 Mini-Lecture 听力讲座与笔记填空专项训练。' },
  { id: 'literature', title: '英美文学经典音频', badge: '名著朗读', desc: '经典名著音频朗读，赏析文学名篇与地道发音。' },
  { id: 'news', title: '新闻综合听力', badge: '实时新闻', desc: '全球新闻播报与文化经济资讯，拓展国际视野。' },
];

export default function ListeningHubPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 标题头部 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}> Listening Hub</h1>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>选择专区进入材料库，开始逐句精听与划词学习</p>
      </div>

      {/* 九宫格卡片布局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {categories.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '20px' }}>
                  {item.badge}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', uppercase: 'true' }}>{item.id.toUpperCase()}</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>{item.title}</h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0 0 20px 0' }}>{item.desc}</p>
            </div>

            <Link
              href={`/listening/${item.id}`}
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                padding: '10px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              进入材料库 →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
