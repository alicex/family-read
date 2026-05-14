import { GoogleGenAI } from '@google/genai'

export async function summarizeArticle(params: {
  url: string
  message: string
  articleText: string
  apiKey: string
}) {
  if (!params.apiKey) {
    throw new Error('GEMINI_API_KEY is missing')
  }

  const ai = new GoogleGenAI({
    apiKey: params.apiKey
  })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
以下は、URLから取得した記事本文です。
この本文だけを根拠に、子どもにもわかる文章で要約してください。
本文に書かれていないことは絶対に足さないでください。

URL:
${params.url}

送る人からのメッセージ:
${params.message || 'なし'}

記事本文:
${params.articleText}

条件:
- 小学校高学年〜中学生向け
- やさしい言葉
- 300〜500文字
- 難しい言葉は説明
- 最後に「大事なポイント」を3つ
- 元記事の全文転載はしない
`
  })

  return response.text || ''
}