<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import { LogoutIcon, ChartPieIcon, UsersIcon, GasStationIcon } from "vue-tabler-icons";

const authStore = useAuthStore();
const router = useRouter();

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
  { id: 1, vehicle_number: "GR-1234-22", amount: 50, timestamp: "2025-02-10", attendant: "John Doe" },
  { id: 2, vehicle_number: "GT-5678-22", amount: 80, timestamp: "2025-02-10", attendant: "Jane Doe" },
  { id: 3, vehicle_number: "GS-9101-23", amount: 40, timestamp: "2025-02-11", attendant: "John Doe" },
];

const fetchUsers = async () => [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }];

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
    salesByAttendant[t.attendant] = (salesByAttendant[t.attendant] || 0) + t.amount;
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
  <v-container>
    <v-card class="pa-6">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <h2 class="text-h5 font-weight-bold">Fuel Management Dashboard</h2>
        </v-col>
        <v-col class="text-right">
          <v-btn @click="authStore.signOut()" color="red" variant="outlined">
            <LogoutIcon class="mr-2" /> Logout
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <ChartPieIcon class="mr-2" /> Daily Sales
            </v-card-title>
            <VueApexCharts v-if="!loading" :options="dailySalesData" :series="dailySalesData.series" type="area" height="250" />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <UsersIcon class="mr-2" /> Registered Users
            </v-card-title>
            <VueApexCharts v-if="!loading" :options="userCountData" :series="userCountData.series" type="donut" height="250" />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-card-title>
              <GasStationIcon class="mr-2" /> Sales Per Attendant
            </v-card-title>
            <VueApexCharts v-if="!loading" :options="attendantSalesData" :series="attendantSalesData.series" type="radar" height="250" />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
