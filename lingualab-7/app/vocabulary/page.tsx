'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 播放发音（优先用 API 音频，备用浏览器自带真人发音）
  const playAudio = () => {
    if (result?.audio) {
      const audio = new Audio(result.audio);
      audio.play().catch(() => playSpeech());
    } else {
      playSpeech();
    }
  };

  const playSpeech = () => {
    if ('speechSynthesis' in window && result?.word) {
      const utterance = new SpeechSynthesisUtterance(result.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/dict?word=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '未查到该词');
      setResult(data);
    } catch (err: any) {
      setError(err.message || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 顶部固定导航栏 */}
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

      {/* 查词主体 */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">查词与词源分析</h1>
          <p className="mt-2 text-sm text-slate-500">检索标准音标、真人发音与权威释义</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="输入要检索的英语单词..."
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
            {/* 头部：单词 + 音标 + 发音小喇叭 */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-3xl font-bold text-slate-900">{result.word}</h2>
              {result.phonetic && <span className="text-lg font-medium text-blue-600">/{result.phonetic}/</span>}
              
              {/* 真人发音按钮 */}
              <button
                onClick={playAudio}
                className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                title="点击播放发音"
              >
                🔊 听发音
              </button>
            </div>

            {/* 详细释义列表 */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">释义与例句</h3>
              {result.meanings.map((m: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <span className="inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {m.partOfSpeech}
                  </span>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {m.definitions.map((d: any, dIdx: number) => (
                      <li key={dIdx} className="text-sm text-slate-700 leading-relaxed">
                        <span>{d.definition}</span>
                        {d.example && (
                          <p className="mt-0.5 text-xs text-slate-500 italic pl-4">
                            例："{d.example}"
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
