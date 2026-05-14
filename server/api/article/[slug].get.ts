import { createNotionClient } from '../../utils/notion'

function getRichText(property: any) {
  return property?.rich_text?.map((item: any) => item.plain_text).join('') || ''
}

function getTitle(property: any) {
  return property?.title?.map((item: any) => item.plain_text).join('') || ''
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  const config = useRuntimeConfig()
  const notion = createNotionClient(config.notionToken)

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

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found'
    })
  }

  const properties = page.properties

  return {
    title: getTitle(properties.Title),
    url: properties.URL?.url || '',
    message: getRichText(properties.Message),
    summary: getRichText(properties.Summary)
  }
})