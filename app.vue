<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const loading = ref(true);

console.log('authStore', authStore);

// onMounted(async () => {
//   console.log(await authStore.fetchUser());
//   await authStore.fetchUser(); // Fetch user profile via Pinia store
//   loading.value = false;
// });
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <p class="text-lg font-semibold">Loading...</p>
  </div>
  <div v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
