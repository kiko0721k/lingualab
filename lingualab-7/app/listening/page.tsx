import Link from 'next/link';

const categories = [
  { id: 'bbc', tag: 'BBC', title: 'BBC Learning English', desc: '进入材料目录，包含逐句原文、翻译与音频播放。', official: 'https://www.bbc.co.uk/learningenglish' },
  { id: 'voa', tag: 'VOA', title: 'VOA Learning English', desc: '进入材料目录，包含逐句原文、翻译与音频播放。', official: 'https://learningenglish.voanews.com' },
  { id: 'ted', tag: 'TED', title: 'TED Talks', desc: '进入材料目录，包含逐句原文、翻译与音频播放。', official: 'https://www.ted.com' },
  { id: 'cet4', tag: 'CET', title: 'CET-4', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
  { id: 'cet6', tag: 'CET', title: 'CET-6', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
  { id: 'tem4', tag: 'TEM', title: 'TEM-4', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
  { id: 'tem8', tag: 'TEM', title: 'TEM-8', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
  { id: 'literature', tag: 'Literature', title: '英美文学', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
  { id: 'news', tag: 'News', title: '新闻听力', desc: '进入材料目录，包含逐句原文、翻译与音频播放。' },
];

export default function ListeningPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((item) => (
          <div key={item.id} className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
                {item.tag}
              </span>
              <h2 className="text-xl font-bold mt-3 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{item.desc}</p>
            </div>

            <div className="flex space-x-3">
              {/* 用 Link 包裹按钮实现活的页面跳转 */}
              <Link href={`/listening/${item.id}`}>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-lg font-medium transition">
                  进入材料
                </button>
              </Link>

              {item.official && (
                <a href={item.official} target="_blank" rel="noreferrer">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition">
                    官方来源
                  </button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
