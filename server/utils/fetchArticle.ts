import * as cheerio from 'cheerio'

export async function fetchArticleText(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  $('script, style, nav, header, footer, aside').remove()

  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    ''

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    ''

  const bodyText = $('article').text() || $('main').text() || $('body').text()

  const text = [title, description, bodyText]
    .join('\n\n')
    .replace(/\s+/g, ' ')
    .trim()

  return text.slice(0, 8000)
}