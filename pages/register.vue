<script setup lang="ts">
import { supabase } from "../composables/useSupabase";
const router = useRouter();
const form = reactive({ email: "", password: "" });
const errorMessage = ref("");

async function register() {
  const { data, error } = await supabase.auth.signUp(form);
  if (error) {
    errorMessage.value = error.message;
  } else {
    router.push("/login");
  }
}
</script>

<template>
  <div class="flex flex-col items-center p-8">
    <h2 class="text-2xl font-bold">Register</h2>
    <form @submit.prevent="register" class="w-96 space-y-4">
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="input"
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        class="input"
      />
      <button type="submit" class="btn">Sign Up</button>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </form>
    <p class="mt-4">
      Already have an account?
      <NuxtLink to="/login" class="text-blue-500">Login</NuxtLink>
    </p>
  </div>
</template>
