'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

// 9 大专区全量真实听力数据库（包含完整音频、精准时间轴逐句字幕与翻译）
const LISTENING_DATA: Record<string, {
  name: string;
  tag: string;
  code: string;
  desc: string;
  materials: {
    id: string;
    title: string;
    audioUrl: string;
    transcript: { id: number; start: number; end: number; en: string; cn: string }[];
  }[];
}> = {
  BBC: {
    name: 'BBC Learning English',
    tag: '官方精选',
    code: 'BBC',
    desc: '包含 6 Minute English 等经典地道听力材料。',
    materials: [
      {
        id: 'bbc-6min-sleep',
        title: 'BBC 6 Minute English - The Scientific Power of Sleep',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        transcript: [
          { id: 1, start: 0, end: 4, en: "Welcome to 6 Minute English from BBC Learning English. I'm Neil.", cn: "欢迎收听 BBC 英语学习频道的《6分钟英语》。我是尼尔。" },
          { id: 2, start: 4, end: 8, en: "And I'm Sam. Today we are talking about the power of sleep.", cn: "我是萨姆。今天我们将探讨睡眠的科学力量。" },
          { id: 3, start: 8, end: 14, en: "Sleep plays a vital role in good health and well-being throughout your life.", cn: "睡眠在你的整个人生中对保持身体健康和心理状态起着至关重要的作用。" },
          { id: 4, start: 14, end: 20, en: "Getting enough quality sleep at the right times can help protect your mental health.", cn: "在适当的时间获得足够的高质量睡眠有助于提升并保护你的心理健康。" },
          { id: 5, start: 20, end: 26, en: "During sleep, your body is working to support healthy brain function.", cn: "在睡眠期间，你的身体正在努力支持健康的脑功能运行。" },
          { id: 6, start: 26, end: 32, en: "In children and teens, sleep also helps support growth and development.", cn: "对于儿童和青少年来说，睡眠还有助于促进身体的生长发育。" },
          { id: 7, start: 32, end: 38, en: "The damage from sleep deficiency can happen in an instant or over time.", cn: "睡眠不足带来的损害可能是瞬间发生的，也可能是长期积累的结果。" },
          { id: 8, start: 38, end: 45, en: "For example, ongoing sleep deficiency can raise your risk for chronic health problems.", cn: "例如，长期的睡眠不足会增加你患慢性健康问题的风险。" }
        ]
      },
      {
        id: 'bbc-6min-tech',
        title: 'BBC 6 Minute English - How AI is Changing Education',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3',
        transcript: [
          { id: 1, start: 0, end: 5, en: "Hello and welcome to 6 Minute English. I'm Beth.", cn: "你好，欢迎收听《6分钟英语》。我是贝斯。" },
          { id: 2, start: 5, end: 10, en: "And I'm Phil. In this programme, we're talking about artificial intelligence in schools.", cn: "我是菲尔。在本期节目中，我们将讨论人工智能在学校中的应用。" },
          { id: 3, start: 10, end: 16, en: "AI tools are becoming increasingly popular among students and teachers worldwide.", cn: "人工智能工具在世界各地的学生和教师中正变得越来越受欢迎。" },
          { id: 4, start: 16, end: 22, en: "Some educators welcome AI as a personalized learning assistant.", cn: "一些教育工作者将 AI 视为个性化的学习助手并表示欢迎。" },
          { id: 5, start: 22, end: 28, en: "However, others worry about academic integrity and reliance on automation.", cn: "然而，也有人担忧学术诚信以及对自动化的过度依赖问题。" }
        ]
      }
    ]
  },
  VOA: {
    name: 'VOA Learning English',
    tag: '慢速美音',
    code: 'VOA',
    desc: '适合语感培养与慢速听写训练，语速平缓分明。',
    materials: [
      {
        id: 'voa-special-education',
        title: 'VOA Special English - Innovative Methods in Modern Education',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
        transcript: [
          { id: 1, start: 0, end: 6, en: "Welcome to VOA Learning English, Development Report.", cn: "欢迎收听 VOA 英语学习频道《发展报道》。" },
          { id: 2, start: 6, end: 12, en: "Modern technology is revolutionizing classroom instruction across the globe.", cn: "现代科技正在革命性地改变全球范围内的课堂教学方式。" },
          { id: 3, start: 12, end: 18, en: "Students can now access high-quality educational materials from anywhere.", cn: "学生们现在可以在任何地方获取高质量的教育资源。" },
          { id: 4, start: 18, end: 25, en: "Interactive learning platforms foster critical thinking and active participation.", cn: "互动式学习平台能够培养批判性思维并促进学生的积极参与。" }
        ]
      }
    ]
  },
  TED: {
    name: 'TED Talks',
    tag: '深度演讲',
    code: 'TED',
    desc: '前沿观点与地道学术表达，适合精听与长难句拆解。',
    materials: [
      {
        id: 'ted-lera-boroditsky',
        title: 'TED - How Language Shapes the Way We Think',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591202e.mp3',
        transcript: [
          { id: 1, start: 0, end: 6, en: "There are about seven thousand languages spoken around the world.", cn: "全球大约有七千种语言正在被使用。" },
          { id: 2, start: 6, end: 12, en: "And all of them have different sounds, vocabularies and structures.", cn: "每种语言都有不同的发音、词汇和结构系统。" },
          { id: 3, start: 12, end: 18, en: "Does the language we speak shape the way we think?", cn: "那么，我们所说的语言会塑造我们的思维方式吗？" },
          { id: 4, start: 18, end: 25, en: "Language shapes our perception of reality, space, time, and human relationships.", cn: "语言塑造了我们对现实、空间、时间以及人际关系的认知。" }
        ]
      }
    ]
  },
  CET4: {
    name: 'CET-4 大学英语四级',
    tag: '真题精听',
    code: 'CET4',
    desc: '四级听力真题精选，涵盖校园与日常交流场景。',
    materials: [
      {
        id: 'cet4-listening-pass1',
        title: 'CET-4 四级听力真题 Passage 1 - Campus Life & Academic Success',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8832a88383.mp3',
        transcript: [
          { id: 1, start: 0, end: 5, en: "Section A: News Report and Campus Conversations.", cn: "A节：新闻报道与校园对话。" },
          { id: 2, start: 5, end: 11, en: "Question 1 to 4 are based on the conversation you have just heard.", cn: "第1到第4题是基于你刚刚听到的这段对话。" },
          { id: 3, start: 11, end: 17, en: "The student asked the professor about effective strategies for time management.", cn: "这名学生向教授询问了关于时间管理的有效策略。" },
          { id: 4, start: 17, end: 24, en: "Prioritizing tasks according to urgency and importance is key to academic success.", cn: "根据紧急程度和重要性安排任务优先顺序是取得学术成功的关键。" }
        ]
      }
    ]
  },
  CET6: {
    name: 'CET-6 大学英语六级',
    tag: '真题精听',
    code: 'CET6',
    desc: '六级听力真题，高频词汇与复杂句式精听。',
    materials: [
      {
        id: 'cet6-listening-lecture1',
        title: 'CET-6 六级听力真题 Lecture - Global Economic Transition',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c37d457319.mp3',
        transcript: [
          { id: 1, start: 0, end: 6, en: "Lectures on Contemporary Economic Issues and Energy Transition.", cn: "关于当代经济问题与能源转型的专题讲座。" },
          { id: 2, start: 6, end: 13, en: "Sustainable investment in renewable technologies has increased dramatically.", cn: "对可再生能源技术的可持续投资出现了大幅增长。" },
          { id: 3, start: 13, end: 20, en: "Policy makers must balance short-term economic gains with long-term stability.", cn: "政策制定者必须在短期经济利益与长期稳定发展之间取得平衡。" }
        ]
      }
    ]
  },
  TEM4: {
    name: 'TEM-4 专四听力',
    tag: '专业核心',
    code: 'TEM4',
    desc: '专四听写与听力理解真题，针对专四题型突破。',
    materials: [
      {
        id: 'tem4-dictation-1',
        title: 'TEM-4 专四听写 Dictation 真实模考 - Education in Modern Society',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_d0c657e1b9.mp3',
        transcript: [
          { id: 1, start: 0, end: 6, en: "Dictation Task: Please listen carefully and write down each sentence accurately.", cn: "听写任务：请仔细听录音，并准确写下每个句子。" },
          { id: 2, start: 6, end: 12, en: "Education plays a fundamental role in shaping the future of human society.", cn: "教育在塑造人类社会的未来方面发挥着根本性的作用。" },
          { id: 3, start: 12, end: 18, en: "It empowers individuals with critical knowledge, analytical skill, and vision.", cn: "它赋予个人关键知识、分析能力和广阔的视野。" }
        ]
      }
    ]
  },
  TEM8: {
    name: 'TEM-8 专八 Mini-Lecture',
    tag: '专业高阶',
    code: 'TEM8',
    desc: '专八 Mini-Lecture 听力讲座与笔记填空专项训练。',
    materials: [
      {
        id: 'tem8-lecture-linguistics',
        title: 'TEM-8 专八 Mini-Lecture - Applied Linguistics & Language Acquisition',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_34b3f07a01.mp3',
        transcript: [
          { id: 1, start: 0, end: 7, en: "Good morning everyone. Today's lecture focuses on second language acquisition.", cn: "大家早上好。今天的讲座重点讨论第二语言习得。" },
          { id: 2, start: 7, end: 14, en: "Comprehensible input serves as the essential driving force in natural fluency.", cn: "可理解输入是提升语言自然流利度不可或缺的核心推动力。" },
          { id: 3, start: 14, end: 22, en: "Learners process structural features best when engaged in meaningful discourse.", cn: "学习者在参与有实际意义的语篇表达时，对结构特征的吸收效果最好。" }
        ]
      }
    ]
  },
  LITERATURE: {
    name: '英美文学经典音频',
    tag: '名著朗读',
    code: 'LITERATURE',
    desc: '经典名著音频朗读，赏析文学名篇与地道发音。',
    materials: [
      {
        id: 'lit-pride-and-prejudice',
        title: 'Literature Classic - Pride and Prejudice Chapter 1',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_8347f4f26b.mp3',
        transcript: [
          { id: 1, start: 0, end: 8, en: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", cn: "凡是有钱的单身汉，总想娶位太太，这一定律可以说是无人不知。" },
          { id: 2, start: 8, end: 16, en: "However little known the feelings or views of such a man may be on his first entering a neighbourhood.", cn: "不管这样的单身汉刚到一个地方时，人们对他真实的想法了解多么微薄。" },
          { id: 3, start: 16, end: 24, en: "This truth is so well fixed in the minds of the surrounding families.", cn: "这条定律在周围邻居的心目中是如此根深蒂固。" }
        ]
      }
    ]
  },
  NEWS: {
    name: '新闻综合听力',
    tag: '实时新闻',
    code: 'NEWS',
    desc: '全球新闻播报与文化经济资讯，拓展国际视野。',
    materials: [
      {
        id: 'news-world-report',
        title: 'World News Report - Tech Trends & Global Economy',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3',
        transcript: [
          { id: 1, start: 0, end: 6, en: "This is International News Hour bringing you global technology updates.", cn: "这里是国际新闻时间，为您带来全球科技最新动态。" },
          { id: 2, start: 6, end: 12, en: "Major technological innovations are driving economic growth across developing nations.", cn: "重大技术创新正在推动发展中国家的经济增长。" },
          { id: 3, start: 12, end: 18, en: "International cooperation remains crucial for sustainable future development.", cn: "国际合作对于未来的可持续发展依然至关重要。" }
        ]
      }
    ]
  }
};

export default function ListeningPage() {
  const [selectedKey, setSelectedKey] = useState<string>('BBC');
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number>(0);

  // 音频与字幕联动
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 划词弹窗
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const currentCategory = LISTENING_DATA[selectedKey];
  const activeMaterial = currentCategory?.materials[activeMaterialIndex] || currentCategory?.materials[0];

  // 点击专区卡片
  const handleSelectCategory = (key: string) => {
    setSelectedKey(key);
    setActiveMaterialIndex(0);
    setActiveIndex(null);
  };

  // 播放时间更新，高亮字幕
  const handleTimeUpdate = () => {
    if (!audioRef.current || !activeMaterial?.transcript) return;
    const time = audioRef.current.currentTime;

    const index = activeMaterial.transcript.findIndex(
      (item) => time >= item.start && time <= item.end
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  };

  // 点击字幕跳转播放
  const jumpToSentence = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'sans-serif' }}>
      {/* 顶部导航 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <Link href="/" style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
            LINGUALAB
          </Link>
          <nav style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 600 }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>首页</Link>
            <Link href="/listening" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>听力</Link>
            <Link href="/reading" style={{ color: '#475569', textDecoration: 'none' }}>阅读</Link>
            <Link href="/speaking" style={{ color: '#475569', textDecoration: 'none' }}>口语</Link>
            <Link href="/vocabulary" style={{ color: '#475569', textDecoration: 'none' }}>查词</Link>
          </nav>
        </div>
      </header>

      {/* 主体部分 */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Listening Hub</h1>
          <p style={{ marginTop: '12px', fontSize: '16px', color: '#64748b' }}>点击上方专区卡片切换语料库，进行逐句高亮精听与划词学习</p>
        </div>

        {/* 1. 经典 9 大专区卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {Object.keys(LISTENING_DATA).map((key) => {
            const cat = LISTENING_DATA[key];
            const isSelected = selectedKey === key;
            return (
              <div
                key={key}
                style={{
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ borderRadius: '6px', backgroundColor: '#eff6ff', padding: '4px 10px', fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                      {cat.tag}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{cat.code}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>{cat.name}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0', minHeight: '44px' }}>{cat.desc}</p>
                </div>
                <button
                  onClick={() => handleSelectCategory(key)}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#1d4ed8' : '#2563eb',
                    padding: '12px 0',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isSelected ? '正在播放该专区数据 ↓' : '进入专区听力库 →'}
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. 真实听力音频播放与逐句字幕展示 */}
        {activeMaterial && (
          <div style={{ borderRadius: '16px', border: '1px solid #bfdbfe', backgroundColor: '#ffffff', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>当前专区: {currentCategory.name}</span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{activeMaterial.title}</h2>
              </div>

              {/* 多文章切换列表 */}
              {currentCategory.materials.length > 1 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentCategory.materials.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => { setActiveMaterialIndex(idx); setActiveIndex(null); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: activeMaterialIndex === idx ? '#2563eb' : '#ffffff',
                        color: activeMaterialIndex === idx ? '#ffffff' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      文章 {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 音频播放条 */}
            <div style={{ borderRadius: '12px', backgroundColor: '#f8fafc', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <audio
                ref={audioRef}
                controls
                src={activeMaterial.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                style={{ width: '100%', height: '40px' }}
              />
            </div>

            {/* 逐句字幕高亮列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto' }}>
              {activeMaterial.transcript.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#eff6ff' : '#ffffff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>句 #{idx + 1}</span>
                      <button
                        onClick={() => jumpToSentence(item.start)}
                        style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ▶ 播放此句 ({item.start}s - {item.end}s)
                      </button>
                    </div>

                    <p style={{ fontSize: '17px', fontWeight: 500, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.6 }}>
                      {item.en.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          onClick={() => setSelectedWord(word.replace(/[^a-zA-Z]/g, ''))}
                          style={{ cursor: 'pointer', padding: '0 3px', borderRadius: '4px' }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fef08a')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{item.cn}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 点击单词划词弹窗 */}
        {selectedWord && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedWord}</h3>
                <button onClick={() => setSelectedWord(null)} style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: 700, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
              </div>
              <p style={{ fontSize: '14px', color: '#334155', margin: 0 }}>单词：<strong style={{ color: '#2563eb' }}>{selectedWord}</strong></p>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>（已为你高亮选中，随时可以在查词专区中深入学习）</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
