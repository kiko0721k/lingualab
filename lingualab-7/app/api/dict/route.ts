import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word')?.toLowerCase().trim();

  if (!word) {
    return NextResponse.json({ error: '请输入有效的单词' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) {
      return NextResponse.json({ error: `未查到单词 "${word}"` }, { status: 404 });
    }

    const data = await res.json();
    const entry = data[0];

    // 提取有效发音音频
    const audioObj = entry.phonetics?.find((p: any) => p.audio && p.audio.length > 0);
    const audioUrl = audioObj ? audioObj.audio : '';

    const result = {
      word: entry.word,
      phonetic: entry.phonetic || (entry.phonetics?.find((p: any) => p.text)?.text) || '',
      audio: audioUrl,
      meanings: entry.meanings.map((m: any) => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions.map((d: any) => ({
          definition: d.definition,
          example: d.example || ''
        }))
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: '服务器连接超时' }, { status: 500 });
  }
}
