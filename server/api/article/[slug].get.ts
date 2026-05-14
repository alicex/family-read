import { createNotionClient } from '../../utils/notion'

// rich_text を文字列化
function getRichText(property: any) {
  return property?.rich_text?.map((item: any) => item.plain_text).join('') || ''
}

// title を文字列化
function getTitle(property: any) {
  return property?.title?.map((item: any) => item.plain_text).join('') || ''
}

export default defineEventHandler(async (event) => {
  // URLパラメータ取得
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  // Notion接続
  const config = useRuntimeConfig()
  const notion = createNotionClient(config.notionToken)

  // slugで記事検索
  const result = await notion.databases.query({
    database_id: config.notionDatabaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    },
    page_size: 1
  })

  const page = result.results[0] as any

  // 記事なし
  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found'
    })
  }

  const properties = page.properties

  // 記事データ返却
  return {
    title: getTitle(properties.Title),
    url: properties.URL?.url || '',
    message: getRichText(properties.Message),
    summary: getRichText(properties.Summary)
  }
})