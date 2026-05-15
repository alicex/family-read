import { GoogleGenAI } from '@google/genai'

export async function summarizeArticle(params: {
  url: string
  message: string
  articleText: string
  apiKey: string
}) {
  // APIキー確認
  if (!params.apiKey) {
    throw new Error('GEMINI_API_KEY is missing')
  }

  // Geminiクライアント生成
  const ai = new GoogleGenAI({
    apiKey: params.apiKey
  })

  // 記事を要約
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
以下は、URLから取得した記事本文です。
この本文だけを根拠に、子どもにもわかる文章で要約してください。
本文に書かれていないことは絶対に足さないでください。

URL:
${params.url}

記事本文:
${params.articleText}

条件:
- 小学校高学年〜中学生向け
- やさしい言葉
- 300〜500文字
- 難しい言葉は説明
- 最後に「大事なポイント」を3つ
- 送る人からのメッセージは要約に含めない
- 元記事の全文転載はしない
- Markdown記法を使わない
- 太字記法（**）を使わない
`
  })

  return response.text || ''
}