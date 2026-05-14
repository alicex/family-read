import * as cheerio from 'cheerio'

export async function fetchArticleText(url: string) {
  // 記事HTMLを取得
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

  // 不要要素を削除
  $('script, style, nav, header, footer, aside').remove()

  // タイトル取得
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    '読んでほしい記事'

  // 概要取得
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    ''

  // 本文取得
  const bodyText = $('article').text() || $('main').text() || $('body').text()

  // 要約用テキスト生成
  const text = [title, description, bodyText]
    .join('\n\n')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    title: title.trim(),
    text: text.slice(0, 8000)
  }
}