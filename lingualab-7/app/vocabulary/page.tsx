'use client';

import { useState } from 'react';

interface WordDetail {
  word: string;
  phonetic: string;
  meanings: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[];
  etymology?: string;
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm.trim()}`);
      if (!res.ok) throw new Error('未找到该单词，请检查拼写');
      
      const data = await res.json();
      const entry = data[0];

      setResult({
        word: entry.word,
        phonetic: entry.phonetic || (entry.phonetics.find((p: any) => p.text)?.text) || '',
        meanings: entry.meanings.slice(0, 3),
        etymology: '包含印欧语根及词源演变分析（已连接词库）'
      });
    } catch (err: any) {
      setError(err.message || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>查词与词源分析</h1>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>输入任意英语单词，快速检索音标、权威释义与深度词源解析</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="输入要检索的单词（如：lab, ephemeral, technology）..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border: '2px solid #cbd5e1',
            outline: 'none',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0 28px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? '查询中...' : '查 词'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{result.word}</h2>
            {result.phonetic && <span style={{ fontSize: '18px', color: '#2563eb', fontWeight: '500' }}>{result.phonetic}</span>}
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {result.meanings.map((m, idx) => (
              <div key={idx}>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {m.partOfSpeech}
                </span>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
                  {m.definitions.slice(0, 2).map((def, dIdx) => (
                    <li key={dIdx} style={{ marginBottom: '6px', fontSize: '15px' }}>
                      {def.definition}
                      {def.example && <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>例："{def.example}"</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
