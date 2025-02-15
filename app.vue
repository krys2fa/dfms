<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const loading = ref(true);
const toast = useToast();

onMounted(async () => {
  try {
    await authStore.fetchUser();
    toast.success("User data loaded successfully!");
  } catch (error) {
    toast.error("Failed to fetch user data.");
  } finally {
    loading.value = false;
  }
});
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
