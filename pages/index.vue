<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import {
  LogoutIcon,
  ChartPieIcon,
  UsersIcon,
  GasStationIcon,
  FileTextIcon,
  ReportIcon,
  SettingsIcon,
  WalletIcon,
} from "vue-tabler-icons";

const authStore = useAuthStore();
const router = useRouter();

// Get the current user's name
const userName = computed(() => authStore.user?.name || "User");

// Dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const transactions = ref<any[]>([]);
const users = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchUser();
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    transactions.value = await fetchTransactions();
    users.value = await fetchUsers();
  } catch (error) {
    console.error("Error fetching dashboard data", error);
  } finally {
    loading.value = false;
  }
};

const fetchTransactions = async () => [
  {
    id: 1,
    vehicle_number: "GR-1234-22",
    amount: 50,
    timestamp: "2025-02-10",
    attendant: "John Doe",
  },
  {
    id: 2,
    vehicle_number: "GT-5678-22",
    amount: 80,
    timestamp: "2025-02-10",
    attendant: "Jane Doe",
  },
  {
    id: 3,
    vehicle_number: "GS-9101-23",
    amount: 40,
    timestamp: "2025-02-11",
    attendant: "John Doe",
  },
];

const fetchUsers = async () => [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];

const dailySalesData = computed(() => {
  const salesByDate: Record<string, number> = {};
  transactions.value.forEach((t) => {
    salesByDate[t.timestamp] = (salesByDate[t.timestamp] || 0) + t.amount;
  });
  return {
    chart: { type: "area" },
    series: [{ name: "Sales ($)", data: Object.values(salesByDate) }],
    xaxis: { categories: Object.keys(salesByDate) },
  };
});

const attendantSalesData = computed(() => {
  const salesByAttendant: Record<string, number> = {};
  transactions.value.forEach((t) => {
    salesByAttendant[t.attendant] =
      (salesByAttendant[t.attendant] || 0) + t.amount;
  });
  return {
    chart: { type: "radar" },
    series: [{ name: "Sales ($)", data: Object.values(salesByAttendant) }],
    labels: Object.keys(salesByAttendant),
  };
});

const userCountData = computed(() => ({
  chart: { type: "donut" },
  series: [users.value.length],
  labels: ["Registered Users"],
}));
</script>

<template>
  <v-container fluid>
    <!-- Welcome Message -->
    <v-card class="pa-5 mb-5 rounded-lg" elevation="2">
      <v-row align="center">
        <v-col cols="12" md="8">
          <h1 class="text-h4 font-weight-bold">
            {{ getGreeting() }}, {{ userName }}! 👋
          </h1>
          <p class="text-body-1 text-muted">
            Welcome to your transaction management dashboard. Here’s a quick
            overview of your recent activity.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-end">
          <v-btn color="primary" variant="flat" to="/transactions" class="mr-2">
            <WalletIcon stroke-width="1.5" size="20" class="mr-2" />
            Manage Transactions
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center hover-card" elevation="2">
          <FileTextIcon
            stroke-width="1.5"
            size="30"
            class="mb-2 text-primary"
          />
          <h3 class="text-h6 font-weight-bold">View Reports</h3>
          <p class="text-body-2 text-muted">
            Analyze transaction data and insights.
          </p>
          <v-btn color="primary" variant="text" to="/reports">
            Go to Reports
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center hover-card" elevation="2">
          <ReportIcon stroke-width="1.5" size="30" class="mb-2 text-primary" />
          <h3 class="text-h6 font-weight-bold">Recent Transactions</h3>
          <p class="text-body-2 text-muted">
            Keep track of your latest transactions.
          </p>
          <v-btn color="primary" variant="text" to="/transactions">
            View Transactions
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center hover-card" elevation="2">
          <SettingsIcon
            stroke-width="1.5"
            size="30"
            class="mb-2 text-primary"
          />
          <h3 class="text-h6 font-weight-bold">Settings</h3>
          <p class="text-body-2 text-muted">Manage preferences and security.</p>
          <v-btn color="primary" variant="text" to="/settings">
            Open Settings
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Stats -->
    <v-row class="mt-5">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <h3 class="text-h5 font-weight-bold text-primary">₵50,000</h3>
          <p class="text-body-2 text-muted">Total Transactions</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <h3 class="text-h5 font-weight-bold text-success">₵12,000</h3>
          <p class="text-body-2 text-muted">Revenue This Month</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <h3 class="text-h5 font-weight-bold text-error">₵5,000</h3>
          <p class="text-body-2 text-muted">Pending Transactions</p>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="pa-6 mt-5">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <ChartPieIcon class="mr-2" /> Daily Sales
            </v-card-title>
            <VueApexCharts
              v-if="!loading"
              :options="dailySalesData"
              :series="dailySalesData.series"
              type="area"
              height="250"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <UsersIcon class="mr-2" /> Registered Users
            </v-card-title>
            <VueApexCharts
              v-if="!loading"
              :options="userCountData"
              :series="userCountData.series"
              type="donut"
              height="250"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <GasStationIcon class="mr-2" /> Sales Per Attendant
            </v-card-title>
            <VueApexCharts
              v-if="!loading"
              :options="attendantSalesData"
              :series="attendantSalesData.series"
              type="radar"
              height="250"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s ease-in-out;
}
.hover-card:hover {
  transform: translateY(-5px);
}
</style>
