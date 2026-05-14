import { nanoid } from 'nanoid'
import { createNotionClient } from '../utils/notion'
import { summarizeArticle } from '../utils/summarize'
import { fetchArticleText } from '../utils/fetchArticle'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url?: string; message?: string }>(event)

  if (!body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    })
  }

  const config = useRuntimeConfig()
  const slug = nanoid(8)

  let summary = ''

  try {
    const articleText = await fetchArticleText(body.url)

    summary = await summarizeArticle({
      url: body.url,
      message: body.message || '',
      articleText,
      apiKey: config.geminiApiKey
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to summarize article'
    })
  }

  try {
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
                content: body.message || '読んでほしい記事'
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
                content: body.message || ''
              }
            }
          ]
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: summary.slice(0, 1900)
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
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create Notion page'
    })
  }

  const readUrl = `${config.public.appBaseUrl}/read/${slug}`

  return {
    slug,
    readUrl,
    smsText: `これ読んでみて！\n${readUrl}`
  }
})