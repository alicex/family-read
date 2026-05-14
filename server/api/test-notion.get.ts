import { Client } from '@notionhq/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const notion = new Client({
      auth: config.notionToken
    })

    const response = await notion.users.me()

    return {
      success: true,
      response
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        body: error?.body
      }
    }
  }
})