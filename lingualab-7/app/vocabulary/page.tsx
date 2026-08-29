'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface WordItem {
  id: string;
  word: string;
  phonetic?: string;
  meanings?: string[];
  examples?: string[];
  audio?: string;
  created_at?: string;
}

export default function VocabularyPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      ? await supabase.from('vocabulary').select('*').order('created_at', { ascending: false })
      : { data: [], error: null };

    if (!error && data) {
      setWords(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setWords(words.filter(item => item.id !== id));
    if (supabase) {
      await supabase.from('vocabulary').delete().eq('id', id);
    }
  };

  const filteredWords = words.filter(item =>
    item.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 头部标题与统计区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LinguaLab Vocabulary</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0' }}>我的生词本</h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>积累精听与阅读划词，结合艾宾浩斯曲线高效复习</p>
        </div>
        <div style={{ backgroundColor: '#eff6ff', padding: '12px 20px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
          <span style={{ fontSize: '13px', color: '#1e40af' }}>已积累词汇量：</span>
          <strong style={{ fontSize: '20px', color: '#1d4ed8', marginLeft: '6px' }}>{words.length}</strong>
        </div>
      </div>

      {/* 搜索过滤栏 */}
      <div style={{ marginBottom: '28px' }}>
        <input
          type="text"
          placeholder="搜索已保存的生词或释义..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            outline: 'none',
            fontSize: '15px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        />
      </div>

      {/* 生词列表展示 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>加载生词库中...</div>
      ) : filteredWords.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredWords.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{item.word}</h3>
                  {item.phonetic && <span style={{ fontSize: '14px', color: '#64748b' }}>/{item.phonetic}/</span>}
                </div>
                {item.meanings && item.meanings.length > 0 && (
                  <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                    {item.meanings.join('； ')}
                  </p>
                )}
                {item.examples && item.examples.length > 0 && (
                  <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                    例句："{item.examples[0]}"
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: '4px 8px' }}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', border: '1px border-dashed #cbd5e1', borderRadius: '20px', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 8px 0' }}>暂无相关生词记录</p>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>在精听或阅读文章中双击/划词，即可快速将生词同步至此处！</p>
        </div>
      )}
    </div>
  );
}
