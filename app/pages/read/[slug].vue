<script setup lang="ts">
type ArticleResponse = {
  title: string
  url: string
  message: string
  summary: string
}

// URLパラメータ取得
const route = useRoute()

// 記事データ取得
const { data, error } = await useFetch<ArticleResponse>(
  `/api/article/${route.params.slug}`
)
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-8">
    <!-- エラー表示 -->
    <p v-if="error">
      記事が見つかりませんでした。
    </p>

    <!-- 記事表示 -->
    <article v-else-if="data">
      <h1 class="text-2xl font-bold leading-normal">
        {{ data.title }}
      </h1>

      <!-- 送信メッセージ -->
      <p v-if="data.message" class="mt-4 rounded bg-gray-100 p-4">
        {{ data.message }}
      </p>

      <!-- AI要約 -->
      <div class="mt-6 whitespace-pre-wrap leading-8">
        {{ data.summary }}
      </div>

      <!-- 元記事リンク -->
      <a
        class="mt-8 inline-block underline"
        :href="data.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        元の記事を読む
      </a>
    </article>
  </main>
</template>