import * as cheerio from 'cheerio'

const MAX_PAGES = 3
const MAX_TEXT_LENGTH = 15000

export async function fetchArticleText(url: string) {
  const visitedUrls = new Set<string>()

  let currentUrl = url

  let title = '読んでほしい記事'
  let description = ''

  const textParts: string[] = []

  for (let i = 0; i < MAX_PAGES; i++) {
    // 同じURL巡回防止
    if (visitedUrls.has(currentUrl)) {
      break
    }

    visitedUrls.add(currentUrl)

    console.log(`Fetching: ${currentUrl}`)

    // HTML取得
    const response = await fetch(currentUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`)
    }

    const html = await response.text()

    const $ = cheerio.load(html)

    // 不要要素削除
    $('script, style, nav, header, footer, aside').remove()

    // 1ページ目だけタイトル取得
    if (i === 0) {
      title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        '読んでほしい記事'

      description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        ''
    }

    // 本文取得
    const bodyText =
      $('article').text() ||
      $('main').text() ||
      $('body').text()

    textParts.push(bodyText)

    // 文字数制限
    const joinedText = textParts.join('\n\n')

    if (joinedText.length > MAX_TEXT_LENGTH) {
      break
    }

    // 次ページ探索
    let nextUrl: string | undefined

    // rel=next 優先
    nextUrl = $('a[rel="next"]').attr('href')

    // 見つからない場合はテキスト判定
    if (!nextUrl) {
      $('a').each((_, element) => {
        const text = $(element).text().trim()

        const href = $(element).attr('href')

        if (!href) {
          return
        }

        const nextTexts = [
          '次へ',
          '次ページ',
          '続きを読む',
          'もっと見る',
          '›',
          '»'
        ]

        const matched = nextTexts.some((t) => text.includes(t))

        if (matched && !nextUrl) {
          nextUrl = new URL(href, currentUrl).toString()
        }
      })
    }

    // 次ページなし
    if (!nextUrl) {
      break
    }

    currentUrl = nextUrl
  }

  // 最終テキスト
  const text = [
    title,
    description,
    textParts.join('\n\n')
  ]
    .join('\n\n')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    title: title.trim(),
    text: text.slice(0, MAX_TEXT_LENGTH)
  }
}