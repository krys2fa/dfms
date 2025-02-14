<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Chart, registerables } from "chart.js";
import { defineChartComponent } from 'vue-chart-3';
import { Pie, Bar } from "vue-chartjs";

const BarChart = defineChartComponent('BarChart', 'bar');

Chart.register(...registerables);

const authStore = useAuthStore();
const router = useRouter();

const transactions = ref<any[]>([]);
const users = ref<any[]>([]);
const loading = ref(true);
const cameraOpen = ref(false);
const capturedImage = ref<string | null>(null);

// 🚀 Ensure Session is Active Before Loading Dashboard
onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login"); // Redirect to login if no session exists
    return;
  }

  await authStore.fetchUser(); // Fetch user after verifying session
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    // Fetch Transactions and Users (Replace with actual API call)
    transactions.value = await fetchTransactions();
    users.value = await fetchUsers();
  } catch (error) {
    console.error("Error fetching dashboard data", error);
  } finally {
    loading.value = false;
  }
};

// Mock API Calls (Replace with actual API)
const fetchTransactions = async () => {
  return [
    { id: 1, vehicle_number: "GR-1234-22", amount: 50, timestamp: "2025-02-10", attendant: "John Doe" },
    { id: 2, vehicle_number: "GT-5678-22", amount: 80, timestamp: "2025-02-10", attendant: "Jane Doe" },
    { id: 3, vehicle_number: "GS-9101-23", amount: 40, timestamp: "2025-02-11", attendant: "John Doe" },
  ];
};

const fetchUsers = async () => {
  return [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }];
};

// 📊 Compute Daily Sales Data
const dailySalesData = computed(() => {
  const salesByDate: Record<string, number> = {};

  transactions.value.forEach((transaction) => {
    const date = transaction.timestamp;
    salesByDate[date] = (salesByDate[date] || 0) + transaction.amount;
  });

  return {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Daily Sales ($)",
        data: Object.values(salesByDate),
        backgroundColor: "#4CAF50",
      },
    ],
  };
});

// 📊 Compute Attendant Sales Data
const attendantSalesData = computed(() => {
  const salesByAttendant: Record<string, number> = {};

  transactions.value.forEach((transaction) => {
    const attendant = transaction.attendant;
    salesByAttendant[attendant] = (salesByAttendant[attendant] || 0) + transaction.amount;
  });

  return {
    labels: Object.keys(salesByAttendant),
    datasets: [
      {
        label: "Sales Per Attendant ($)",
        data: Object.values(salesByAttendant),
        backgroundColor: ["#FF5733", "#FFC300"],
      },
    ],
  };
});

// 📊 Compute User Count Data
const userCountData = computed(() => ({
  labels: ["Registered Users"],
  datasets: [
    {
      label: "Total Users",
      data: [users.value.length],
      backgroundColor: "#4287f5",
    },
  ],
}));

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

      <!-- 🔹 Charts Section -->
      <section v-if="loading">
        <p class="text-gray-600">Loading data...</p>
      </section>
      <section v-else>
        <h2 class="text-xl font-semibold mb-2">📊 Dashboard Analytics</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 📊 Daily Sales Chart -->
          <div class="bg-gray-50 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">📅 Daily Sales</h3>
            <Bar :data="dailySalesData" :options="{ responsive: true }" />
          </div>

          <!-- 👥 Total Users Chart -->
          <div class="bg-gray-50 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">👥 Registered Users</h3>
            <Pie :data="userCountData" :options="{ responsive: true }" />
          </div>

          <!-- ⛽ Sales Per Attendant Chart -->
          <div class="bg-gray-50 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">⛽ Sales Per Attendant</h3>
            <Bar :data="attendantSalesData" :options="{ responsive: true }" />
          </div>
        </div>
      </section>

      <!-- 🔹 Transaction List -->
      <section class="mt-6">
        <h2 class="text-xl font-semibold mb-2">⛽ Recent Transactions</h2>
        <ul class="bg-gray-50 p-4 rounded-lg">
          <li v-for="transaction in transactions" :key="transaction.id" class="border-b py-2">
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
        <button @click="openCamera" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Open Camera
        </button>
        <CameraCapture v-if="cameraOpen" @capture="handleCapture" />
        <img v-if="capturedImage" :src="capturedImage" class="mt-2 w-48 rounded-lg shadow-lg" />
      </section>
    </div>
  </div>
</template>
