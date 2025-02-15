<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTransactionStore } from "../stores/transactions";
import { FileExportIcon, FilterIcon, CalendarIcon } from "vue-tabler-icons";
import { useTheme } from "vuetify";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchUser();
});

const transactionStore = useTransactionStore();
const theme = useTheme();

const dateRange = ref({ start: "", end: "" });

const filteredTransactions = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end)
    return transactionStore.transactions;

  return transactionStore.transactions.filter((tx) => {
    const date = new Date(tx.timestamp);
    return (
      date >= new Date(dateRange.value.start) &&
      date <= new Date(dateRange.value.end)
    );
  });
});

// Total amount calculation
const totalAmount = computed(() => {
  return filteredTransactions.value.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );
});

// Export to CSV function (mock implementation)
const exportReport = () => {
  console.log("Exporting transactions:", filteredTransactions.value);
  alert("Report exported (mock function).");
};
</script>

<template>
  <v-container>
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
          <p class="text-h5 font-weight-bold">${{ totalAmount }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="align-center mb-4">
      <v-col cols="5">
        <v-text-field v-model="dateRange.start" type="date" label="Start Date">
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
        { text: 'Amount', value: 'amount' },
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
  </v-container>
</template>
