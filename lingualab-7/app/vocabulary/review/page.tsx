'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { calculateNextReview } from '@/lib/ebbinghaus';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface WordItem {
  id: string;
  word: string;
  definition: string;
  stage: number;
  next_review_at: string;
}

export default function ReviewPage() {
  const [queue, setQueue] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function loadDueWords() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('user_id', user.id)
          .lte('next_review_at', new Date().toISOString())
          .order('next_review_at', { ascending: true });

        if (!error && data) setQueue(data);
      }
      setLoading(false);
    }
    loadDueWords();
  }, []);

  const handleReview = async (remembered: boolean) => {
    if (queue.length === 0) return;

    const currentWord = queue[0];
    const { nextStage, nextReviewAt } = calculateNextReview(currentWord.stage, remembered);

    await supabase
      .from('vocabulary')
      .update({
        stage: nextStage,
        next_review_at: nextReviewAt,
      })
      .eq('id', currentWord.id);

    setQueue((prev) => prev.slice(1));
    setShowAnswer(false);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">正在加载复习卡片...</div>;

  if (queue.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">太棒了！</h2>
        <p className="text-gray-500 mt-2 text-sm">当前没有需要复习的生词啦！</p>
      </div>
    );
  }

  const current = queue[0];

  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-4 text-xs font-semibold text-gray-400">
        <span>艾宾浩斯记忆卡片</span>
        <span>待复习：{queue.length} 个</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[280px] shadow-sm flex flex-col justify-between text-center transition-all">
        <div>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
            Stage {current.stage}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-6">{current.word}</h1>
        </div>

        {showAnswer ? (
          <div className="my-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-gray-700 text-sm">
            {current.definition}
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="my-8 text-sm text-blue-600 font-medium hover:underline"
          >
            点击查看释义
          </button>
        )}

        {showAnswer && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleReview(false)}
              className="py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors text-sm"
            >
              忘掉了 (重置)
            </button>
            <button
              onClick={() => handleReview(true)}
              className="py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm shadow-sm"
            >
              记住了 (升级)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
