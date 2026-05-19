import { nanoid } from 'nanoid'
import { createNotionClient } from '../utils/notion'
import { summarizeArticle } from '../utils/summarize'
import { fetchArticleText } from '../utils/fetchArticle'

export default defineEventHandler(async (event) => {
  // リクエスト内容を取得
  const body = await readBody<{ url?: string; message?: string }>(event)

  if (!body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    })
  }

  // URL形式チェック
  try {
    new URL(body.url)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL'
    })
  }

  const config = useRuntimeConfig()
  const slug = nanoid(8)

  let summary = ''
  let articleTitle = '読んでほしい記事'

  try {
    // 記事本文を取得
    const article = await fetchArticleText(body.url)

    articleTitle = article.title

    // Geminiで要約
    summary = await summarizeArticle({
      url: body.url,
      message: body.message || '',
      articleText: article.text,
      apiKey: config.geminiApiKey
    })
  } catch (error: any) {
    console.error('SUMMARIZE ERROR', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to summarize article',
      data: {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        status: error?.status,
        body: error?.body,
        stack: error?.stack
      }
    })
  }

  try {
    // Notionへ保存
    const notion = createNotionClient(config.notionToken)

    await notion.pages.create({
      parent: {
        database_id: config.notionDatabaseId
      },

      properties: {
        Title: {
          title: [
            {
              text: {
                content: articleTitle.slice(0, 100)
              }
            }
          ]
        },

        Slug: {
          rich_text: [
            {
              text: {
                content: slug
              }
            }
          ]
        },

        URL: {
          url: body.url
        },

        Message: {
          rich_text: [
            {
              text: {
                content: (body.message || '').slice(0, 1000)
              }
            }
          ]
        },

        Summary: {
          rich_text: [
            {
              text: {
                // Notion制限対策
                content: summary.slice(0, 1500)
              }
            }
          ]
        },

        CreatedAt: {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    })
  } catch (error: any) {
    console.error('NOTION ERROR', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create Notion page',
      data: {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        status: error?.status,
        body: error?.body,
        stack: error?.stack
      }
    })
  }

  // 読む用URL
  const readUrl = `${config.public.appBaseUrl}/read/${slug}`

  return {
    slug,
    readUrl,
    smsText: `これ読んでみて！\n${readUrl}`
  }
})