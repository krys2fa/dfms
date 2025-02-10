<script setup lang="ts">
import { useSupabase } from "../composables/useSupabase";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const { supabase } = useSupabase();
const authStore = useAuthStore();
const router = useRouter();

async function logout() {
  await supabase.auth.signOut();
  authStore.signOut();
  router.push("/auth/login");
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold">Welcome to the Dashboard</h1>
    <button @click="logout" class="btn mt-4">Logout</button>
  </div>
</template>

<style scoped>
.btn {
  background: #ef4444;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
