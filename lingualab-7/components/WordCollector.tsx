'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function WordCollector() {
  const [selectedWord, setSelectedWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // 监听网页划词选中文本
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      // 仅处理单字/词组选中文本
      if (text && /^[a-zA-Z\s-]+$/.test(text) && text.length < 30) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 8,
          });
          setSelectedWord(text.toLowerCase());
          setSaved(false);
          setDefinition('');
        }
      } else {
        // 点击空白处收起弹窗
        setTimeout(() => setPosition(null), 200);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // 保存到 Supabase 数据库
  const handleSaveWord = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('请先登录账号才能保存生词哦！');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('vocabulary').upsert({
      user_id: user.id,
      word: selectedWord,
      definition: definition || '手动添加生词',
      next_review_at: new Date().toISOString(),
    }, { onConflict: 'user_id,word' });

    setLoading(false);
    if (error) {
      alert('保存失败：' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setPosition(null), 1500);
    }
  };

  if (!position) return null;

  return (
    <div
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="absolute z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-64 text-slate-800 transition-all transform -translate-x-1/2"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-base text-blue-600">{selectedWord}</span>
        <button
          onClick={handleSaveWord}
          disabled={loading || saved}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? '保存中...' : saved ? '已入生词本 ✓' : '+ 记生词'}
        </button>
      </div>
      <input
        type="text"
        placeholder="输入释义/笔记 (选填)"
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
        className="w-full text-xs p-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
