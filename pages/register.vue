<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { reactive, ref } from "vue";

const authStore = useAuthStore();
const form = reactive({ email: "", password: "" });
const errorMessage = ref("");

async function register() {
  errorMessage.value = "";
  const { error } = await authStore.register(form.email, form.password);
  
  if (error) {
    errorMessage.value = error.message;
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
        required
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        class="input"
        required
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
