import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  // Application 100 % cliente : aucun backend, déployable en statique.
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  // Composants utilisables sans préfixe de dossier : <BaseButton />, <AppSidebar />…
  components: [{ path: '~/components', pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true, typeCheck: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'CV Builder ATS',
      htmlAttrs: { lang: 'fr' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
