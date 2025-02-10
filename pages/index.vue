<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
(async () => {
  await authStore.fetchUser();
})();

const logout = async () => {
  await authStore.signOut();
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Welcome</h1>
    <p v-if="authStore.user">Logged in as: {{ authStore.user?.email }}</p>
    <button @click="logout" class="btn">Sign Out</button>
  </div>
</template>
