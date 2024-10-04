// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
  ],

  pinia: {
    storesDirs: ["~/stores/**", "~/modules/**/stores/**"],
  },

  css: ["~/assets/css/tailwind.css"],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "./tailwind.config.js",
    exposeConfig: true,
    viewer: true,
  },

  googleFonts: {
    families: {
      "Roboto Flex": {
        wght: [200, 300, 400, 500, 600, 700],
      },
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/:pathMatch(.*)*": { prerender: true },
  },

  nitro: {
    prerender: {
      routes: ["/index.html", "/404.html"],
    },
  },
});
