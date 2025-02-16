<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(true);

// **Check user session**
onMounted(async () => {
  const hasSession = authStore.checkSession();
  if (hasSession) {
    await authStore.fetchUser();
  } else {
    router.push("/auth/login");
  }
  loading.value = false;
});

// **Computed property for checking if the user is logged in**
const isAuthenticated = computed(() => !!authStore.user);
</script>

<template>
  <!-- Loading Spinner -->
  <div
    v-if="loading"
    class="flex items-center justify-center min-h-screen bg-gray-900"
  >
    <div
      class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"
    ></div>
  </div>

  <!-- Ensure Layout is applied -->
  <NuxtLayout v-else>
    <NuxtPage v-if="isAuthenticated || $route.path.includes('/auth')" />
  </NuxtLayout>
</template>

<style>
/* Global styles */
body {
  @apply bg-gray-100 text-gray-900;
}
</style>
