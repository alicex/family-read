<script setup lang="ts">
const route = useRoute()

const { data, pending, error } = await useFetch(`/api/article/${route.params.slug}`)
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-8">
    <p v-if="pending">
      読み込み中...
    </p>

    <p v-else-if="error">
      記事が見つかりませんでした。
    </p>

    <article v-else-if="data">
      <h1 class="text-2xl font-bold">
        {{ data.title }}
      </h1>

      <p v-if="data.message" class="mt-4 rounded bg-gray-100 p-4">
        {{ data.message }}
      </p>

      <div class="mt-6 whitespace-pre-wrap leading-8">
        {{ data.summary }}
      </div>

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