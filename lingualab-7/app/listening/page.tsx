'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CATEGORIES = [
  { id: 'BBC', name: 'BBC Learning English', tag: '官方精选', desc: '包含 6 Minute English 等经典地道听力材料。' },
  { id: 'VOA', name: 'VOA Learning English', tag: '慢速美音', desc: '适合语感培养与慢速听写训练，语速平缓分明。' },
  { id: 'TED', name: 'TED Talks', tag: '深度演讲', desc: '前沿观点与地道学术表达，适合精听与长难句拆解。' },
  { id: 'CET4', name: 'CET-4 大学英语四级', tag: '真题精听', desc: '四级听力真题精选，涵盖校园与日常交流场景。' },
  { id: 'CET6', name: 'CET-6 大学英语六级', tag: '真题精听', desc: '六级听力真题，高频词汇与复杂句式精听。' },
  { id: 'TEM4', name: 'TEM-4 专四听力', tag: '专业核心', desc: '专四听写与听力理解真题，针对专四题型突破。' },
  { id: 'TEM8', name: 'TEM-8 专八 Mini-Lecture', tag: '专业高阶', desc: '专八 Mini-Lecture 听力讲座与笔记填空专项训练。' },
  { id: 'LITERATURE', name: '英美文学经典音频', tag: '名著朗读', desc: '经典名著音频朗读，赏析文学名篇与地道发音。' },
  { id: 'NEWS', name: '新闻综合听力', tag: '实时新闻', desc: '全球新闻播报与文化经济资讯，拓展国际视野。' },
];

export default function ListeningPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 播放同步与高亮
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 划词取词弹窗
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordInfo, setWordInfo] = useState<any>(null);
  const [wordLoading, setWordLoading] = useState(false);

  // 点击卡片进入材料库，拉取数据库数据
  const handleSelectCategory = async (catId: string) => {
    setSelectedCat(catId);
    setLoading(true);
    setActiveMaterial(null);
    try {
      const { data } = await supabase
        .from('listening_materials')
        .select('*')
        .eq('category', catId);

      if (data && data.length > 0) {
        setMaterials(data);
        setActiveMaterial(data[0]);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 监听音频播放时间高亮逐句
  const handleTimeUpdate = () => {
    if (!audioRef.current || !activeMaterial?.transcript) return;
    const time = audioRef.current.currentTime;

    const index = activeMaterial.transcript.findIndex(
      (item: any) => time >= item.start && time <= item.end
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  };

  // 跳转到对应句子播放
  const jumpToSentence = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
    }
  };

  // 点词即查 Supabase 词库
  const handleWordClick = async (rawWord: string) => {
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    setWordLoading(true);
    setWordInfo(null);

    try {
      const { data } = await supabase
        .from('dictionary')
        .select('*')
        .ilike('word', cleanWord)
        .maybeSingle();

      setWordInfo(data || { word: cleanWord, meaning: '词库未收录该单词' });
    } catch {
      setWordInfo({ word: cleanWord, meaning: '查词超时' });
    } finally {
      setWordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black text-blue-600">LINGUALAB</Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <Link href="/listening" className="text-blue-600 font-bold">听力</Link>
            <Link href="/reading" className="hover:text-blue-600">阅读</Link>
            <Link href="/speaking" className="hover:text-blue-600">口语</Link>
            <Link href="/vocabulary" className="hover:text-blue-600">查词</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Listening Hub</h1>
          <p className="mt-2 text-sm text-slate-500">选择专区进入材料库，开始逐句精听与划词学习</p>
        </div>

        {/* 1. 完整保留原版的 9 大卡片结构 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-2xl border p-6 transition-all bg-white shadow-sm hover:shadow-md ${
                selectedCat === cat.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  {cat.tag}
                </span>
                <span className="text-xs font-bold text-slate-400">{cat.id}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 h-10">{cat.desc}</p>
              <button
                onClick={() => handleSelectCategory(cat.id)}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                进入材料库 →
              </button>
            </div>
          ))}
        </div>

        {/* 2. 点击卡片后在下方展开数据库精听工作台 */}
        {selectedCat && (
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              专区数据库：<span className="text-blue-600">{selectedCat}</span> 材料库
            </h2>

            {loading ? (
              <p className="text-sm text-slate-400">正在调取数据库...</p>
            ) : materials.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧材料篇目 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">选择篇目</h4>
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setActiveMaterial(m)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        activeMaterial?.id === m.id
                          ? 'border-blue-600 bg-blue-50/50 font-semibold text-blue-900'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="text-sm leading-snug">{m.title}</p>
                    </div>
                  ))}
                </div>

                {/* 右侧音频 + 逐句精听 + 点击取词 */}
                {activeMaterial && (
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <h3 className="font-bold text-slate-900 mb-2">{activeMaterial.title}</h3>
                      <audio
                        ref={audioRef}
                        controls
                        src={activeMaterial.audio_url}
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-10"
                      />
                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      {activeMaterial.transcript?.map((item: any, idx: number) => {
                        const isActive = activeIndex === idx;
                        return (
                          <div
                            key={item.id || idx}
                            className={`p-4 rounded-xl border transition-all ${
                              isActive
                                ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                                : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-slate-400">句 #{idx + 1}</span>
                              <button
                                onClick={() => jumpToSentence(item.start)}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                ▶ 播放本句
                              </button>
                            </div>

                            <p className="text-base text-slate-900 font-medium leading-relaxed">
                              {item.en.split(' ').map((word: string, wIdx: number) => (
                                <span
                                  key={wIdx}
                                  onClick={() => handleWordClick(word)}
                                  className="cursor-pointer hover:bg-yellow-200 rounded px-0.5 transition-colors inline-block mr-1"
                                >
                                  {word}
                                </span>
                              ))}
                            </p>
                            {item.cn && <p className="text-xs text-slate-500 mt-1">{item.cn}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">暂无数据，请确认已在 Supabase 运行 SQL 代码。</p>
            )}
          </div>
        )}

        {/* 划词弹窗 */}
        {selectedWord && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-2xl font-bold text-slate-900">{selectedWord}</h3>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {wordLoading ? (
                <p className="text-sm text-slate-500">正在查询 Supabase 词库...</p>
              ) : wordInfo ? (
                <div className="space-y-3">
                  {wordInfo.phonetic && (
                    <p className="text-sm font-semibold text-blue-600">/{wordInfo.phonetic}/</p>
                  )}
                  {wordInfo.etymology && (
                    <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                      <span className="font-bold block mb-1">词源演变：</span>
                      {wordInfo.etymology}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">释义</span>
                    <p className="text-sm text-slate-800 font-medium mt-1">
                      {wordInfo.translation || wordInfo.meaning || '暂无释义'}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
