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
  const [selectedCat, setSelectedCat] = useState<string>('BBC');
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // 播放与高亮同步
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 划词取词弹窗状态
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordInfo, setWordInfo] = useState<any>(null);
  const [wordLoading, setWordLoading] = useState(false);

  // 加载所选分类材料
  useEffect(() => {
    fetchMaterials(selectedCat);
  }, [selectedCat]);

  const fetchMaterials = async (catId: string) => {
    setLoading(true);
    setActiveMaterial(null);
    try {
      const { data } = await supabase
        .from('listening_materials')
        .select('*')
        .eq('category', catId);

      if (data && data.length > 0) {
        setMaterials(data);
        setActiveMaterial(data[0]); // 默认加载第一条材料
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 音频播放进度监听，实时高亮句子
  const handleTimeUpdate = () => {
    if (!audioRef.current || !activeMaterial?.transcript) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    const index = activeMaterial.transcript.findIndex(
      (item: any) => time >= item.start && time <= item.end
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  };

  // 点击句子跳转播放
  const jumpToSentence = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
    }
  };

  // 点词即查（查询 Supabase 词库）
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

      if (data) {
        setWordInfo(data);
      } else {
        setWordInfo({ word: cleanWord, meaning: '词库中暂未收录该词释义' });
      }
    } catch {
      setWordInfo({ word: cleanWord, meaning: '查询超时，请稍后重试' });
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Listening Hub 精听工作台</h1>
          <p className="mt-2 text-sm text-slate-500">点击材料实时精听，点击任意单词即可调取 Supabase 词库查看释义与音标</p>
        </div>

        {/* 专区选择列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                selectedCat === cat.id
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="block text-[10px] font-bold uppercase text-blue-600">{cat.tag}</span>
              <span className="block text-sm font-bold text-slate-900 truncate">{cat.id}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：材料选择 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">{selectedCat} 篇目列表</h3>
            {loading ? (
              <p className="text-sm text-slate-400">加载中...</p>
            ) : materials.length > 0 ? (
              <div className="space-y-3">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveMaterial(m)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeMaterial?.id === m.id
                        ? 'border-blue-600 bg-blue-50/40 font-semibold text-blue-900'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="text-sm leading-snug">{m.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">该专区暂未收录材料。</p>
            )}
          </div>

          {/* 右侧：精听与逐句高亮控制台 */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            {activeMaterial ? (
              <div>
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 mb-2 inline-block">
                    {activeMaterial.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{activeMaterial.title}</h2>
                  
                  {/* 音频控制 */}
                  <audio
                    ref={audioRef}
                    controls
                    src={activeMaterial.audio_url}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full mt-4 h-10"
                  />
                </div>

                {/* 逐句字幕与点击查词 */}
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                  {activeMaterial.transcript?.map((item: any, idx: number) => {
                    const isActive = activeIndex === idx;
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400">句 #{idx + 1}</span>
                          <button
                            onClick={() => jumpToSentence(item.start)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            ▶ 播放此句
                          </button>
                        </div>

                        {/* 单词拆解实现点词即查 */}
                        <p className="text-base leading-relaxed text-slate-800">
                          {item.text.split(' ').map((word: string, wIdx: number) => (
                            <span
                              key={wIdx}
                              onClick={() => handleWordClick(word)}
                              className="cursor-pointer hover:bg-yellow-200 hover:text-slate-900 rounded px-0.5 transition-colors inline-block mr-1"
                            >
                              {word}
                            </span>
                          ))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                请在左侧选择一篇听力材料开始练习
              </div>
            )}
          </div>
        </div>

        {/* 点击单词即时查询弹窗 */}
        {selectedWord && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-2xl font-bold text-slate-900">{selectedWord}</h3>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
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
                      {wordInfo.translation || wordInfo.meaning || '无详细释义'}
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
