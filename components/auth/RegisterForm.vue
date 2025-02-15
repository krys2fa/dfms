<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const role = ref(""); // Added role field
const errorMessage = ref("");
const loading = ref(false);

const register = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await authStore.register(
      email.value,
      password.value,
      role.value
    );
    const data = response?.data;

    if (data?.user) {
      console.log("User registered:", data.user);

      // Redirect user based on their role
      switch (data.user.role) {
        case "admin":
          router.push("/admin-dashboard");
          break;
        case "superadmin":
          router.push("/superadmin-dashboard");
          break;
        case "owner":
          router.push("/owner-dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } else {
      errorMessage.value = "Registration failed. Please try again.";
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value = error.message || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="register">
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

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Role</v-label>
        <v-select
          v-model="role"
          :items="['user', 'admin', 'owner', 'superadmin']"
          label="Select Role"
          variant="outlined"
          color="primary"
          required
        />
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
          Sign up
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
