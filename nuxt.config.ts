export default defineNuxtConfig({
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    notionToken: process.env.NOTION_TOKEN,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
    public: {
      appBaseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
    }
  }
})