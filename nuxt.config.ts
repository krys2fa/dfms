// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false, // Ensures the app runs in client-only mode
  typescript: {
    shim: false,
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
    serveStatic: true, // Serve static files
  },
  devServerHandlers: [],
  hooks: {},
  devtools: { enabled: true }, // Enables Nuxt DevTools
  modules: [
    "@pinia/nuxt", // State management
    "@vueuse/nuxt", // Vue composables for better UX
  ],
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000/api", // 🔥 Updated API base URL
    },
    private: {
      databaseUrl: process.env.DATABASE_URL, // Prisma Database URL
      pgHost: process.env.PGHOST,
      pgDatabase: process.env.PGDATABASE,
      pgUser: process.env.PGUSER,
      pgPassword: process.env.PGPASSWORD,
      pgPort: process.env.PGPORT || "5432",
    },
  },
});
