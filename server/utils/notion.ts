import { Client } from '@notionhq/client'

// Notionクライアント生成
export function createNotionClient(token: string) {
  return new Client({ auth: token })
}