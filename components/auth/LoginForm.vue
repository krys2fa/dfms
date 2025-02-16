<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const checkbox = ref(false);
const toast = useToast();

const login = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const data = await authStore.login(email.value, password.value);

    if (data?.user) {
      console.log("User authenticated:", data.user);

      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          // router.push("/admin-dashboard");
          router.push("/dashboard");
          break;
        case "superadmin":
          // router.push("/superadmin-dashboard");
          router.push("/dashboard");
          break;
        case "owner":
          // router.push("/owner-dashboard");
          router.push("/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } else {
      errorMessage.value = "Invalid credentials. Please try again.";
      toast.error("Invalid credentials. Please try again.");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value = error.message || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="login">
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Email</v-label>
        <v-text-field
          v-model="email"
          type="email"
          placeholder="Enter your email"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Email is required']"
          required
        />
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Password</v-label>
        <v-text-field
          v-model="password"
          type="password"
          placeholder="Enter your password"
          variant="outlined"
          color="primary"
          :rules="[(v) => !!v || 'Password is required']"
          required
        />
      </v-col>

      <v-col cols="12" class="pt-0">
        <v-checkbox v-model="checkbox" color="primary" hide-details>
          <template v-slot:label>Remember this device</template>
        </v-checkbox>
      </v-col>

      <v-col cols="12" v-if="errorMessage">
        <p class="text-red-500">{{ errorMessage }}</p>
      </v-col>

      <v-col cols="12">
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
