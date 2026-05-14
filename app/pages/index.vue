<script setup lang="ts">
const url = ref('')
const message = ref('')
const loading = ref(false)
const result = ref<null | {
  readUrl: string
  smsText: string
}>(null)

const errorMessage = ref('')

const createArticle = async () => {
  loading.value = true
  result.value = null
  errorMessage.value = ''

  try {
    result.value = await $fetch('/api/create', {
      method: 'POST',
      body: {
        url: url.value,
        message: message.value
      }
    })
  } catch (error: any) {
    console.error(error)
    errorMessage.value = JSON.stringify(error?.data || error, null, 2)
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
          placeholder="https://example.com/article"
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
          placeholder="これ読んでみて！"
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