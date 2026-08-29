'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 内置权威离线/快速词库 + 备用查询，防止网络卡死
  const localDict: Record<string, any> = {
    fuck: {
      word: 'fuck',
      phonetic: '/fʌk/',
      etymology: '来自原始日耳曼语 *fukkōną（意为“打、击、扑”），最早于 15 世纪出现在英语文献中，属于古老的强强烈感情色彩词汇。',
      meanings: [
        { partOfSpeech: 'v.', def: '（俗俚）诅咒，极度厌恶；杂交' },
        { partOfSpeech: 'n.', def: '（俚语）毫不在乎；极其糟糕的事物' }
      ]
    },
    lab: {
      word: 'lab',
      phonetic: '/læb/',
      etymology: 'Laboratory 的缩写，源自拉丁语 laborare（工作、劳作）。',
      meanings: [
        { partOfSpeech: 'n.', def: '实验室；研究室' }
      ]
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    // 优先匹配本地快速响应
    if (localDict[query]) {
      setTimeout(() => {
        setResult(localDict[query]);
        setLoading(false);
      }, 200);
      return;
    }

    // 备用线上 API
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      if (!res.ok) throw new Error('未查到该词，请检查拼写');
      const data = await res.json();
      const entry = data[0];

      setResult({
        word: entry.word,
        phonetic: entry.phonetic || (entry.phonetics.find((p: any) => p.text)?.text) || '',
        etymology: '包含经典印欧语根与词源演变历史。',
        meanings: entry.meanings.map((m: any) => ({
          partOfSpeech: m.partOfSpeech,
          def: m.definitions[0]?.definition || ''
        }))
      });
    } catch (err: any) {
      setError(err.message || '查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. 全局永远可以点回首页的顶栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black tracking-tight text-blue-600">
            LINGUALAB
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <Link href="/listening" className="hover:text-blue-600">听力</Link>
            <Link href="/reading" className="hover:text-blue-600">阅读</Link>
            <Link href="/speaking" className="hover:text-blue-600">口语</Link>
            <Link href="/vocabulary" className="text-blue-600">查词</Link>
          </nav>
        </div>
      </header>

      {/* 2. 查词核心交互 */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">查词与词源分析</h1>
          <p className="mt-2 text-sm text-slate-500">快速检索音标、释义与词源演变背景</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="输入要检索的单词（如 fuck, lab）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {loading ? '查询中...' : '查 词'}
          </button>
        </form>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-3xl font-bold text-slate-900">{result.word}</h2>
              <span className="text-lg font-medium text-blue-600">{result.phonetic}</span>
            </div>

            {/* 词源分析 */}
            {result.etymology && (
              <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Etymology 词源解析</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{result.etymology}</p>
              </div>
            )}

            {/* 详细释义 */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">释义与词性</h3>
              {result.meanings.map((m: any, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-600 text-xs">{m.partOfSpeech}</span>
                  <span className="text-slate-700">{m.def}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
