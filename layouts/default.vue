<script setup lang="ts">
import { useSupabase } from "../composables/useSupabase";
import type { User } from "@supabase/supabase-js";

const { supabase, logout } = useSupabase();
const user = ref<User | null>(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
});
</script>

<template>
  <div>
    <nav class="p-4 bg-gray-800 text-white flex justify-between">
      <NuxtLink to="/" class="text-xl font-bold"
        >Digital Fuel Management System</NuxtLink
      >
      <div v-if="user">
        <span class="mr-4">{{ user.email }}</span>
        <button @click="logout" class="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
    <slot />
  </div>
</template>
