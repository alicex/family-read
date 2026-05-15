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
  <main class="min-h-screen bg-violet-50 px-6 py-10">
    <!-- エラー表示 -->
    <p
      v-if="error"
      class="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center text-violet-900 shadow-sm"
    >
      記事が見つかりませんでした。
    </p>

    <!-- 記事表示 -->
    <article
      v-else-if="data"
      class="mx-auto max-w-3xl rounded-3xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-12"
    >
      <p class="text-sm font-bold text-violet-400">
        Family Reader
      </p>

      <h1 class="mt-3 text-2xl font-bold leading-normal text-violet-950 md:text-3xl">
        {{ data.title }}
      </h1>

      <!-- 送信メッセージ -->
      <section
        v-if="data.message"
        class="mt-6 rounded-2xl bg-violet-100 p-5 text-violet-950"
      >
        <p class="text-sm font-bold text-violet-500">
          メッセージ
        </p>

        <p class="mt-2 leading-8">
          {{ data.message }}
        </p>
      </section>

      <!-- AI要約 -->
      <section class="mt-8">
        <p class="text-sm font-bold text-violet-400">
          やさしい要約
        </p>

        <div class="mt-3 whitespace-pre-wrap text-lg leading-9 text-gray-800">
          {{ data.summary }}
        </div>
      </section>

      <!-- 元記事リンク -->
      <a
        class="mt-10 inline-flex rounded-full bg-violet-400 px-6 py-3 font-bold text-white shadow-sm"
        :href="data.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        元の記事を読む
      </a>
    </article>
  </main>
</template>