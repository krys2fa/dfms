<script setup lang="ts">
import { createPinia } from "pinia";
import { supabase } from "./composables/useSupabase";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

// Create Pinia instance
const pinia = createPinia();
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(true);

// Watch for authentication changes
onMounted(async () => {
  const { data: user } = await supabase.auth.getUser();

  if (user?.user) {
    authStore.setUser(user.user);
    router.push("/dashboard");
  } else {
    router.push("/login");
  }

  loading.value = false;
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
