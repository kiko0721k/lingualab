# LinguaLab 7.0 — Vercel + Supabase 云端版

这是一个 GitHub-ready 的 Next.js 项目。目标是：上传一次 → Vercel 部署 → 得到一个真正的网址。

## 功能骨架
- 听力：BBC / VOA / TED 官方入口 + CET-4/CET-6/TEM-4/TEM-8/文学/新闻分类；数据库支持 audio_url、transcript、translation。
- 阅读：外刊 / 文学 / 学术 / 新闻 / 专业文章分类。
- 口语：浏览器录音 → OpenAI 转写 → AI 表达反馈；预留 Shadowing、专业口试与错误统计。
- 单词：Dictionary API 释义、音标、例句、音频（数据源提供时）；预留词源、记忆法、生词本、艾宾浩斯。
- 账号与数据库：Supabase Auth + Postgres + RLS。

## 网页部署
1. GitHub 新建 `lingualab` 仓库。
2. 把本文件夹内全部文件上传到仓库。不要上传 `.env` 或真实 API Key。
3. Vercel → New Project → Continue with GitHub → 选择 `lingualab` → Import。
4. Supabase 新建项目。
5. Supabase → SQL Editor，把 `supabase/schema.sql` 全部粘贴并 Run。
6. Vercel → Settings → Environment Variables 添加：
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   - OPENAI_API_KEY（可先不填，AI 功能会暂时不可用）
   - OPENAI_TEXT_MODEL=gpt-5.6
   - OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
   - OPENAI_TTS_MODEL=gpt-4o-mini-tts
7. Supabase → Authentication → URL Configuration，把 Site URL 设置为你的 Vercel 网址。
8. Vercel → Deployments → Redeploy。

## 内容版权
BBC / VOA / TED / 四六级 / 专四专八的内容不能因为用于学习就默认可以复制或重新托管。本项目默认使用官方来源入口，并为你拥有授权的音频/文章预留字段。正式上线时请使用官方允许的嵌入、API、feed 或已授权内容库。

## 后续开发顺序
1. 登录后把收藏写入 vocabulary。
2. 完成艾宾浩斯算法与复习卡片。
3. 把 listening_materials 做成真正的课程详情页、逐句播放器、原文/翻译和生词收藏。
4. 把 reading_articles 做成点击查词、长难句和错题系统。
5. 保存 speaking_attempts 与 error_patterns。
6. 接入授权的真实音频/文章内容库和管理员后台。
