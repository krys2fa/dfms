<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { FileExportIcon, CalendarIcon } from "vue-tabler-icons";
import { useAuthStore } from "../stores/auth";

// Authentication & Routing
const authStore = useAuthStore();
const router = useRouter();

// Transactions Data
const transactions = ref<Array<any>>([]);
const isLoading = ref(false);

// Fetch User Session on Mount
onMounted(async () => {
  isLoading.value = true;

  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }

  await authStore.fetchUser();
  await fetchTransactions();

  isLoading.value = false;
});

// Fetch Transactions from Supabase
const fetchTransactions = async () => {
  // const { data, error } = await supabase
  //   .from("transactions")
  //   .select("id, vehicle_number, amount, timestamp");
  // if (error) {
  //   console.error("Error fetching transactions:", error);
  // } else {
  //   transactions.value = data || [];
  // }
};

// Date Range Filter
const dateRange = ref({ start: "", end: "" });

const filteredTransactions = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end) return transactions.value;

  return transactions.value.filter((tx) => {
    const date = new Date(tx.timestamp);
    return (
      date >= new Date(dateRange.value.start) &&
      date <= new Date(dateRange.value.end)
    );
  });
});

// Total Amount Calculation
const totalAmount = computed(() => {
  return filteredTransactions.value.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );
});

// Export Transactions (Mock Function)
const exportReport = () => {
  console.log("Exporting transactions:", filteredTransactions.value);
  alert("Report exported successfully!");
};
</script>

<template>
  <v-container>
    <!-- Loading State -->
    <v-row v-if="isLoading" justify="center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="50"
      ></v-progress-circular>
    </v-row>

    <template v-else>
      <!-- Overview Cards -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-card color="primary" class="pa-4 white--text">
            <h3 class="text-h6">Total Transactions</h3>
            <p class="text-h5 font-weight-bold">
              {{ filteredTransactions.length }}
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card color="green" class="pa-4 white--text">
            <h3 class="text-h6">Total Revenue</h3>
            <p class="text-h5 font-weight-bold">₵{{ totalAmount }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-row class="align-center mb-4">
        <v-col cols="5">
          <v-text-field
            v-model="dateRange.start"
            type="date"
            label="Start Date"
          >
            <template v-slot:prepend-inner><CalendarIcon /></template>
          </v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="dateRange.end" type="date" label="End Date">
            <template v-slot:prepend-inner><CalendarIcon /></template>
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn color="blue" class="white--text" @click="exportReport">
            <FileExportIcon class="mr-2" /> Export
          </v-btn>
        </v-col>
      </v-row>

      <!-- Transactions Table -->
      <v-data-table
        :headers="[
          { text: 'Vehicle Number', value: 'vehicle_number' },
          { text: 'Amount (₵)', value: 'amount' },
          { text: 'Date', value: 'timestamp' },
        ]"
        :items="filteredTransactions"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Transaction Reports</v-toolbar-title>
          </v-toolbar>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>
