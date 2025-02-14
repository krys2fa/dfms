<!-- <script setup lang="ts">
import Sidebar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useAuthStore } from "../stores/auth";
import type { User } from "@supabase/supabase-js";
import { ref, onMounted } from "vue";

const { fetchUser, signOut } = useAuthStore();
const user = ref<User | null>(null);

onMounted(async () => {
  await fetchUser();
});
</script> -->

<!-- <template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />


    <nav class="p-4 bg-gray-800 text-white flex justify-between">
      <NuxtLink to="/" class="text-xl font-bold"
        >Digital Fuel Management System</NuxtLink
      >
      <div v-if="user">
        <span class="mr-4">{{ user.email }}</span>
        <button @click="signOut" class="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>

    <div class="flex-1 flex flex-col">
      <Header />

      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>

      <Footer />
    </div>
  </div> -->
<!-- </template> -->


<script setup lang="ts">
import Sidebar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useAuthStore } from "../stores/auth";
import type { User } from "@supabase/supabase-js";
import { ref, onMounted } from "vue";

const { fetchUser, signOut } = useAuthStore();
const user = ref<User | null>(null);

onMounted(async () => {
  await fetchUser();
});

const title = ref("Modernize - Nuxt3 Typescript based Free Admin Dashboard Template");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Nuxt3 Typescript based Free Admin Dashboard Template`
      : "Modernize - Nuxt3 Typescript based Free Admin Dashboard Template";
  },
});
</script>

<template>
    <v-locale-provider >
        <v-app>
            <LayoutFullMain/>
            <v-main>
                <v-container fluid class="page-wrapper">
                    <div class="maxWidth">
                        <NuxtPage  />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
