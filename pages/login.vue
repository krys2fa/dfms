<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const { supabase } = useSupabase();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
  errorMessage.value = "";
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    authStore.setUser(data.user);
    router.push("/dashboard");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center mb-4">Login</h2>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border rounded mb-2"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-2 border rounded mb-2"
          required
        />
        <p v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </p>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded mt-3"
        >
          Login
        </button>
      </form>
      <p class="text-sm mt-3 text-center">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-600">Register</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
