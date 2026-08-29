import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CategoryListeningPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const supabase = createClient();

  const { data: list, error } = await supabase
    .from('listening_materials')
    .select('*')
    .eq('category', category);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold uppercase">{category} 听力专区</h1>
        <Link href="/listening" className="text-sm text-blue-600 hover:underline">
          ← 返回听力列表
        </Link>
      </div>

      {!list || list.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-xl text-gray-500 text-center border">
          暂无该分类下的材料，请确认数据库中包含 category 为 "{category}" 的记录。
        </div>
      ) : (
        <div className="space-y-6">
          {list.map((item) => (
            <div key={item.id} className="p-6 bg-white border rounded-xl shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
              
              <audio controls src={item.audio_url} className="w-full mt-2" />

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t text-sm">
                <div>
                  <span className="font-semibold text-gray-400 block mb-1">英文原文：</span>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{item.transcript || '暂无原文'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 block mb-1">参考翻译：</span>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.translation || '暂无翻译'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
