import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word')?.toLowerCase().trim();

  if (!word) {
    return NextResponse.json({ error: '请输入有效的单词' }, { status: 400 });
  }

  try {
    // 1. 服务端直接去请求 API（服务器不存在跨域和前端阻断问题）
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      next: { revalidate: 3600 } // 缓存 1 小时，二次查询秒出
    });

    if (!res.ok) {
      return NextResponse.json({ error: `词库中未查到 "${word}"，请检查拼写` }, { status: 404 });
    }

    const data = await res.json();
    const entry = data[0];

    const result = {
      word: entry.word,
      phonetic: entry.phonetic || (entry.phonetics?.find((p: any) => p.text)?.text) || '',
      translation: entry.meanings.map((m: any) => `${m.partOfSpeech}. ${m.definitions[0]?.definition || ''}`).join('; '),
      etymology: '包含经典印欧语根与词源演变背景。',
      meanings: entry.meanings.map((m: any) => ({
        partOfSpeech: m.partOfSpeech,
        definition: m.definitions[0]?.definition || '',
        example: m.definitions[0]?.example || ''
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: '服务端查询超时，请稍后重试' }, { status: 500 });
  }
}
