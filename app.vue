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
  <div
    v-if="loading"
    class="flex items-center justify-center min-h-screen bg-gray-900"
  >
    <!-- Animated Loading Spinner -->
    <div
      class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"
    ></div>
  </div>

  <div v-else>
    <!-- Show the app only when authenticated -->
    <router-view v-if="isAuthenticated" />
    <router-view
      v-else-if="!isAuthenticated && $route.path.includes('/auth')"
    />
  </div>
</template>

<style>
/* Global styles */
body {
  @apply bg-gray-100 text-gray-900;
}
</style>
