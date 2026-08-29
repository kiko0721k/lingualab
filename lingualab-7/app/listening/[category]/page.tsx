'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// 确保在客户端准确拿到 Supabase 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface Material {
  id: string;
  title: string;
  audio_url: string;
  transcript?: string;
  translation?: string;
  created_at?: string;
}

const categoryNames: Record<string, string> = {
  bbc: 'BBC Learning English 听力库',
  voa: 'VOA Learning English 听力库',
  ted: 'TED Talks 演讲听力库',
  cet4: 'CET-4 大学英语四级听力真题库',
  cet6: 'CET-6 大学英语六级听力真题库',
  tem4: 'TEM-4 英语专业四级真题与听写库',
  tem8: 'TEM-8 英语专业八级 Mini-Lecture 听力库',
  literature: '英美文学经典音频朗读库',
  news: '新闻综合听力库',
};

export default function CategoryListeningPage() {
  const params = useParams();
  const category = (params?.category as string) || '';

  const [list, setList] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<Material | null>(null);

  useEffect(() => {
    if (!category || !supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return;
    }

    // 在 useEffect 内部动态实例化 Supabase，防止 SSR 阶段 c.from 报错
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listening_materials')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setList(data);
          if (data.length > 0) setActiveItem(data[0]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  const categoryTitle = categoryNames[category] || `${category.toUpperCase()} 听力材料库`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 顶部面包屑导航 */}
      <div className="mb-6">
        <Link href="/listening" className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center">
          ← 返回专区选择
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{categoryTitle}</h1>
        <p className="text-sm text-gray-500 mt-1">共收录 {list.length} 篇精选听力练习材料</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">正在加载听力材料库...</div>
      ) : list.length === 0 ? (
        <div className="p-12 bg-gray-50 border border-gray-200 rounded-2xl text-center text-gray-500">
          暂无该分类下的材料，请确认数据库是否有数据。
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：听力材料目录列表 */}
          <div className="lg:col-span-1 border border-gray-200 rounded-2xl bg-white p-4 space-y-2 h-fit shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-3">材料列表</h2>
            {list.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`w-full text-left p-3.5 rounded-xl transition-all ${
                  activeItem?.id === item.id
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">Passage {index + 1}</div>
                <div className="text-sm line-clamp-2 leading-snug">{item.title}</div>
              </button>
            ))}
          </div>

          {/* 右侧：当前选中材料的精听/播放区 */}
          {activeItem && (
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">正在播放</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-3">{activeItem.title}</h2>
              </div>

              {/* 音频播放器 */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <audio controls src={activeItem.audio_url} className="w-full focus:outline-none" />
              </div>

              {/* 逐句原文与中文翻译 */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">英文原文</span>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{activeItem.transcript || '暂无原文'}</p>
                </div>
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/60">
                  <span className="text-xs font-semibold text-amber-600 block mb-2">参考翻译</span>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{activeItem.translation || '暂无翻译'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
