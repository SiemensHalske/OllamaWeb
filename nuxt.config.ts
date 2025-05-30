// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon'],
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      title: 'OllamaWeb'
    }
  },
  nitro: {
    plugins: [
      '~/server/plugins/logger.ts'
    ]
  }
})