'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 访问我们自己刚刚建立的服务端 API
      const res = await fetch(`/api/dict?word=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '未查到该词');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 顶部固定导航 */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#2563eb', letterSpacing: '-0.025em' }}>
              LINGUALAB
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '600' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>首页</Link>
            <Link href="/listening" style={{ color: '#64748b', textDecoration: 'none' }}>听力</Link>
            <Link href="/reading" style={{ color: '#64748b', textDecoration: 'none' }}>阅读</Link>
            <Link href="/speaking" style={{ color: '#64748b', textDecoration: 'none' }}>口语</Link>
            <Link href="/vocabulary" style={{ color: '#2563eb', textDecoration: 'none' }}>查词</Link>
          </nav>
        </div>
      </header>

      {/* 主体查询界面（采用原生 inline-style，零依赖，绝对不会掉样式） */}
      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textBaseline: 'center', textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>查词与词源分析</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>服务端直连检索，秒出音标、权威释义与解析</p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="输入要检索的单词（如 happy, lab, ephemeral）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '检索中...' : '查 词'}
          </button>
        </form>

        {error && (
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fffbebfb', border: '1px solid #fef3c7', color: '#92400e', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{result.word}</h2>
              {result.phonetic && <span style={{ fontSize: '16px', color: '#2563eb', fontWeight: '600' }}>/{result.phonetic}/</span>}
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Etymology 词源解析</h3>
              <p style={{ fontSize: '14px', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>{result.etymology}</p>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>释义与例句</h3>
              {result.meanings.map((m: any, i: number) => (
                <div key={i} style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
                  <span style={{ fontWeight: '700', color: '#2563eb', marginRight: '8px' }}>{m.partOfSpeech}</span>
                  <span>{m.definition}</span>
                  {m.example && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>例："{m.example}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
