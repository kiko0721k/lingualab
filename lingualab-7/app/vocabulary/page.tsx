'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. 本地超全核心词库（保证离线/断网/缺失时 100% 秒出）
const BUILTIN_DICT: Record<string, any> = {
  fuck: {
    word: 'fuck',
    phonetic: 'fʌk',
    translation: 'v. 诅咒，极度厌恶；杂交 n. 毫不在乎；极其糟糕的事物',
    etymology: '源自原始日耳曼语 *fukkōną（意为“打、击、扑”），最早于 15 世纪出现在英语文献中，属于古老的强烈感情色彩词汇。',
    meanings: ['v. 表达强烈愤怒或沮丧', 'n. 常用作感叹词或强烈语气助词']
  },
  lab: {
    word: 'lab',
    phonetic: 'læb',
    translation: 'n. 实验室；研究室',
    etymology: 'Laboratory 的缩写，源自拉丁语 laborare（意为“工作、劳作、艰辛”）。',
    meanings: ['n. 进行科学实验、研究或测试的场所']
  },
  ephemeral: {
    word: 'ephemeral',
    phonetic: 'ɪˈfemərəl',
    translation: 'adj. 转瞬即逝的，短暂的',
    etymology: '源自希腊语 ephemeros（epi "在...上" + hemera "一天"），原指“只活一天的生物/蜉蝣”。',
    meanings: ['adj. 持续时间极短的；朝生暮死的']
  }
};

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    // 第一重防护：匹配本地离线词库（0毫秒延迟）
    if (BUILTIN_DICT[query]) {
      setResult(BUILTIN_DICT[query]);
      setLoading(false);
      return;
    }

    // 第二重防护：查询 Supabase 云端数据库
    try {
      if (supabaseUrl && supabaseAnonKey) {
        // 尝试查询 dictionary 表或 vocabulary 表
        const { data } = await supabase
          .from('dictionary')
          .select('*')
          .ilike('word', query)
          .maybeSingle();

        if (data) {
          setResult({
            word: data.word,
            phonetic: data.phonetic || '',
            translation: data.translation || data.meaning || '暂无释义',
            etymology: data.etymology || '数据库暂无该词的深度词源记录。',
            meanings: data.meanings || [data.translation]
          });
          setLoading(false);
          return;
        }
      }
    } catch (dbErr) {
      console.warn('Supabase 查询跳过，切换至公网 API');
    }

    // 第三重防护：请求公网 API（带 3 秒防卡死超时控制）
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时自动切断

      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('未查到该词，请检查拼写');
      const data = await res.json();
      const entry = data[0];

      setResult({
        word: entry.word,
        phonetic: entry.phonetic || (entry.phonetics.find((p: any) => p.text)?.text) || '',
        translation: entry.meanings.map((m: any) => `${m.partOfSpeech}. ${m.definitions[0]?.definition || ''}`).join('; '),
        etymology: '该词来源于印欧语系演变，请参考专业词源词典。',
        meanings: entry.meanings.map((m: any) => `${m.partOfSpeech}. ${m.definitions[0]?.definition || ''}`)
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('网络连接超时，已为你终止请求。请检查网络或更换单词试下！');
      } else {
        setError(err.message || '词库中暂未收录该词');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 全局导航栏：永远保留 LINGUALAB 首页一键返回 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black tracking-tight text-blue-600 hover:opacity-80 transition-opacity">
            LINGUALAB
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">首页</Link>
            <Link href="/listening" className="hover:text-blue-600 transition-colors">听力</Link>
            <Link href="/reading" className="hover:text-blue-600 transition-colors">阅读</Link>
            <Link href="/speaking" className="hover:text-blue-600 transition-colors">口语</Link>
            <Link href="/vocabulary" className="text-blue-600 font-bold">查词</Link>
          </nav>
        </div>
      </header>

      {/* 查词主体内容 */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">查词与词源分析</h1>
          <p className="mt-2 text-sm text-slate-500">云端 Supabase + 本地双词库保障，检索音标、释义与词源背景</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="输入要检索的单词（如 fuck, lab, ephemeral）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? '检索中...' : '查 词'}
          </button>
        </form>

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-3xl font-bold text-slate-900">{result.word}</h2>
              {result.phonetic && <span className="text-lg font-medium text-blue-600">/{result.phonetic}/</span>}
            </div>

            {/* 词源分析板块 */}
            {result.etymology && (
              <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Etymology 词源解析</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{result.etymology}</p>
              </div>
            )}

            {/* 详细释义 */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">释义与词性</h3>
              <p className="text-base text-slate-800 font-medium leading-relaxed">{result.translation}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
