'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VocabularyPage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>我的生词本</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>积累划词生词，结合艾宾浩斯曲线定时复习</p>
        </div>
        <Link
          href="/vocabulary/review"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          开始复习卡片 →
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="搜索已保存的生词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            outline: 'none',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        暂无生词记录，去听力库划词收藏吧！
      </div>
    </div>
  );
}
