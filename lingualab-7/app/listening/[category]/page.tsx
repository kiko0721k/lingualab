'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Material {
  id: string;
  title: string;
  audio_url: string;
  transcript?: string;
  translation?: string;
}

// 分类名称映射表
const categoryNames: Record<string, string> = {
  bbc: 'BBC Learning English',
  voa: 'VOA Learning English',
  ted: 'TED Talks',
  cet4: 'CET-4',
  cet6: 'CET-6',
  tem4: 'TEM-4',
  tem8: 'TEM-8',
  literature: '英美文学听力',
  news: '新闻综合听力',
};

export default function CategoryListeningPage() {
  const params = useParams();
  const category = (params?.category as string) || '';

  const [list, setList] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('listening_materials')
        .select('*')
        .eq('category', category);

      if (!error && data) {
        setList(data);
      }
      setLoading(false);
    }

    fetchData();
  }, [category]);

  const categoryTitle = categoryNames[category] || category.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* 顶部导航与标题 */}
      <div className="mb-8">
        <Link
          href="/listening"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回听力列表
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{categoryTitle}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-400 font-medium">
          正在读取听力材料...
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 bg-gray-50 border border-gray-200 rounded-2xl text-center">
          <p className="text-gray-500 font-medium">暂无该分类下的材料</p>
          <p className="text-xs text-gray-400 mt-2">请确认数据库中包含 category 为 "{category}" 的记录。</p>
        </div>
      ) : (
        <div className="space-y-8">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h2>

              {/* 音频播放区域 */}
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl mb-6">
                <audio controls src={item.audio_url} className="w-full focus:outline-none" />
              </div>

              {/* 对照展示 */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    英文原文
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {item.transcript || '暂无原文'}
                  </p>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-600/70 block mb-2">
                    参考翻译
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {item.translation || '暂无翻译'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
