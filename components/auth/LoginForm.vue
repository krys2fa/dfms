<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const checkbox = ref(false);

const login = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await authStore.login(email.value, password.value);
    const data = response?.data;

    if (data) {
      console.log("User authenticated, navigating to dashboard...");
      router.push("/dashboard");
    } else {
      errorMessage.value = "Login failed. Please check your credentials.";
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    errorMessage.value = error.message || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="login">
    <v-row class="d-flex mb-3">
      <!-- Email Field -->
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Email</v-label>
        <v-text-field
          v-model="email"
          type="email"
          placeholder="Email"
          variant="outlined"
          color="primary"
          :rules="[v => !!v || 'Email is required']"
          required
        ></v-text-field>
      </v-col>

      <!-- Password Field -->
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Password</v-label>
        <v-text-field
          v-model="password"
          type="password"
          placeholder="Enter your password"
          variant="outlined"
          color="primary"
          :rules="[v => !!v || 'Password is required']"
          required
        ></v-text-field>
      </v-col>

      <!-- Remember Me Checkbox -->
      <v-col cols="12" class="pt-0">
        <div class="d-flex flex-wrap align-center ml-n2">
          <v-checkbox v-model="checkbox" color="primary" hide-details>
            <template v-slot:label>Remember this Device</template>
          </v-checkbox>
        </div>
      </v-col>

      <!-- Error Message -->
      <v-col cols="12" v-if="errorMessage">
        <p class="text-red-500">{{ errorMessage }}</p>
      </v-col>

      <!-- Submit Button -->
      <v-col cols="12" class="pt-0">
        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          flat
          :loading="loading"
        >
          Sign in
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
