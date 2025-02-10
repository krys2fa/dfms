<!-- <script setup lang="ts">
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
    <h1 class="text-3xl font-bold">Fuel Sales Dashboard</h1>
    <button @click="logout" class="btn mt-4">Logout</button>
    <ul>
      <li v-for="(transaction, index) in transactions" :key="index" class="p-4 bg-white shadow-md my-2">
        {{ transaction.vehicle }} - {{ transaction.amount }} Liters
      </li>
    </ul>
  </div>
</template>

<style scoped>
.btn {
  background: #ef4444;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
</style> -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// import { useSupabaseClient, useUser } from "@supabase/supabase-js";

import { useSupabase } from "../composables/useSupabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

// const supabase = useSupabaseClient();
const { supabase } = useSupabase();
const router = useRouter();
// const user = useUser();
const user = ref<User | null>(null);

const transactions = ref<any[]>([]);
const loading = ref(true);
const cameraOpen = ref(false);
const capturedImage = ref<string | null>(null);

// 🚀 Redirect if not logged in
onMounted(async () => {
  if (!user.value) {
    router.push("/login");
  }
  fetchTransactions();
  listenForTransactionUpdates();
});

// 🛒 Fetch Transactions from Supabase
const fetchTransactions = async () => {
  loading.value = true;
  const { data, error } = await supabase.from("transactions").select("*");
  if (data) transactions.value = data;
  loading.value = false;
};

// 📡 Listen for real-time transactions
const listenForTransactionUpdates = () => {
  supabase
    .channel("transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      fetchTransactions
    )
    .subscribe();
};

// 📷 Capture License Plate Image
const openCamera = () => (cameraOpen.value = true);
const handleCapture = (image: string) => {
  capturedImage.value = image;
  cameraOpen.value = false;
};

// 📤 Logout Function
const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <!-- 🔹 Dashboard Header -->
      <header class="flex justify-between items-center border-b pb-4 mb-4">
        <h1 class="text-2xl font-semibold">🚀 Fuel Management Dashboard</h1>
        <button
          @click="logout"
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

      <!-- 📤 Download Report -->
      <button
        @click="fetchTransactions"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        📊 Download Report
      </button>
    </div>
  </div>
</template>
