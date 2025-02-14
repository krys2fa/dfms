// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  hooks: {
  },
  devtools: { enabled: true }, // Enables Nuxt DevTools
  // debug: true, // Enables debug mode
  // logLevel: "info", // Use "debug" for even more details
  modules: ["@pinia/nuxt"],
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    },
  },
});
