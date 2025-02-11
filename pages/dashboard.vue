<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const transactions = ref<any[]>([]);
const loading = ref(true);
const cameraOpen = ref(false);
const capturedImage = ref<string | null>(null);

// 🚀 Ensure Session is Active Before Loading Dashboard
onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/login"); // Redirect to login if no session exists
    return;
  }
  
  await authStore.fetchUser(); // Fetch user after verifying session
});

// 📷 Capture License Plate Image
const openCamera = () => (cameraOpen.value = true);
const handleCapture = (image: string) => {
  capturedImage.value = image;
  cameraOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <!-- 🔹 Dashboard Header -->
      <header class="flex justify-between items-center border-b pb-4 mb-4">
        <h1 class="text-2xl font-semibold">🚀 Fuel Management Dashboard</h1>
        <button
          @click="authStore.signOut()"
          class="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </header>

      <!-- 🔹 Transaction List -->
      <section v-if="loading">
        <p class="text-gray-600">Loading transactions...</p>
      </section>
      <section v-else>
        <h2 class="text-xl font-semibold mb-2">⛽ Recent Transactions</h2>
        <ul class="bg-gray-50 p-4 rounded-lg">
          <li
            v-for="transaction in transactions"
            :key="transaction.id"
            class="border-b py-2"
          >
            <strong>{{ transaction.vehicle_number }}</strong> - ${{
              transaction.amount
            }}
            - {{ transaction.timestamp }}
          </li>
        </ul>
      </section>

      <!-- 🔹 License Plate Capture -->
      <section class="mt-6">
        <h2 class="text-xl font-semibold mb-2">📷 License Plate Capture</h2>
        <button
          @click="openCamera"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Open Camera
        </button>
        <CameraCapture v-if="cameraOpen" @capture="handleCapture" />
        <img
          v-if="capturedImage"
          :src="capturedImage"
          class="mt-2 w-48 rounded-lg shadow-lg"
        />
      </section>
    </div>
  </div>
</template>
