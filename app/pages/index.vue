<script setup lang="ts">
type CreateArticleResponse = {
  slug: string
  readUrl: string
  smsText: string
}

// フォーム状態
const url = ref('')
const message = ref('')

// UI状態
const loading = ref(false)
const errorMessage = ref('')

// 作成結果
const result = ref<CreateArticleResponse | null>(null)

// 記事を登録
const createArticle = async () => {
  loading.value = true
  result.value = null
  errorMessage.value = ''

  try {
    // APIへ送信
    result.value = await $fetch<CreateArticleResponse>('/api/create', {
      method: 'POST',
      body: {
        url: url.value,
        message: message.value
      }
    })
  } catch (error) {
    // エラー表示
    console.error(error)
    errorMessage.value = '記事の登録に失敗しました。URLを確認してもう一度お試しください。'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-8">
    <h1 class="text-2xl font-bold">
      記事を登録
    </h1>

    <!-- 登録フォーム -->
    <form class="mt-6 space-y-4" @submit.prevent="createArticle">
      <div>
        <label class="block text-sm font-bold">
          記事URL
        </label>

        <input
          v-model="url"
          type="url"
          required
          class="mt-1 w-full rounded border px-3 py-2"
        >
      </div>

      <div>
        <label class="block text-sm font-bold">
          メッセージ
        </label>

        <textarea
          v-model="message"
          class="mt-1 w-full rounded border px-3 py-2"
          rows="4"
        />
      </div>

      <button
        type="submit"
        class="rounded bg-black px-4 py-2 font-bold text-white disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? '作成中...' : '要約して登録' }}
      </button>
    </form>

    <!-- エラー表示 -->
    <p
      v-if="errorMessage"
      class="mt-4 rounded bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <!-- 作成結果 -->
    <section v-if="result" class="mt-8 rounded border p-4">
      <p class="font-bold">
        SMSで送る内容
      </p>

      <textarea
        class="mt-2 w-full rounded border px-3 py-2"
        rows="4"
        readonly
        :value="result.smsText"
      />

      <a
        class="mt-4 inline-block underline"
        :href="result.readUrl"
        target="_blank"
      >
        読む画面を開く
      </a>
    </section>
  </main>
</template>