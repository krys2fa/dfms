<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTransactionStore } from "../stores/transactions";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import {
  FileExportIcon,
  FilterIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
} from "vue-tabler-icons";

const authStore = useAuthStore();
const router = useRouter();
const transactionStore = useTransactionStore();

onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchUser();
});

// State
const searchQuery = ref("");
const dateRange = ref({ start: "", end: "" });
const showModal = ref(false);
const editingTransaction = ref<any>(null);

// 🔎 Filtered transactions
const filteredTransactions = computed(() => {
  let transactions = transactionStore.transactions;

  // Search filter
  if (searchQuery.value) {
    transactions = transactions.filter((tx) =>
      tx.license_plate.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Date range filter
  if (dateRange.value.start && dateRange.value.end) {
    transactions = transactions.filter((tx) => {
      const date = new Date(tx.timestamp);
      return (
        date >= new Date(dateRange.value.start) &&
        date <= new Date(dateRange.value.end)
      );
    });
  }

  return transactions;
});

// 🔄 Open modal for adding/editing
const openModal = (transaction = null) => {
  editingTransaction.value = transaction
    ? { ...transaction }
    : {
        id: null,
        license_plate: "",
        amount: "",
        timestamp: new Date().toISOString(),
      };
  showModal.value = true;
};

// 💾 Save transaction
// const saveTransaction = () => {
//   if (editingTransaction.value.id) {
//     transactionStore.updateTransaction(editingTransaction.value);
//   } else {
//     transactionStore.addTransaction(editingTransaction.value);
//   }
//   showModal.value = false;
// };

const saveTransaction = async () => {
  if (editingTransaction.value.id) {
    await transactionStore.updateTransaction(editingTransaction.value);
  } else {
    await transactionStore.addTransaction(editingTransaction.value);
  }
  showModal.value = false;
};

// ❌ Delete transaction
const deleteTransaction = (id: number) => {
  transactionStore.deleteTransaction(id);
};

// 📤 Export transactions (Mock)
const exportTransactions = () => {
  console.log("Exporting transactions:", transactionStore.transactions);
  alert("Transactions exported (mock function).");
};
</script>

<template>
  <v-container>
    <v-row class="align-center mb-4">
      <!-- 🔎 Search Bar -->
      <v-col cols="6">
        <v-text-field
          v-model="searchQuery"
          label="Search Vehicle Number"
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>

      <!-- 📅 Date Filters -->
      <v-col cols="3">
        <v-text-field v-model="dateRange.start" type="date" label="Start Date">
          <template v-slot:prepend-inner><CalendarIcon /></template>
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="dateRange.end" type="date" label="End Date">
          <template v-slot:prepend-inner><CalendarIcon /></template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal()">
        <PlusIcon class="mr-2" /> Add Transaction
      </v-btn>
      <v-btn color="blue" @click="exportTransactions">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Transactions Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Filtered Transactions
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Vehicle Number', value: 'vehicle_number' },
          { text: 'Amount ($)', value: 'amount' },
          { text: 'Date', value: 'timestamp' },
          { text: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="filteredTransactions"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn small icon color="blue" @click="openModal(item)">
            <EditIcon />
          </v-btn>
          <v-btn small icon color="red" @click="deleteTransaction(item.id)">
            <TrashIcon />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 📜 Full Transactions Table -->
    <v-card>
      <v-card-title>
        <FileExportIcon class="mr-2" /> All Transactions
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Vehicle Number', value: 'vehicle_number' },
          { text: 'Amount ($)', value: 'amount' },
          { text: 'Date', value: 'timestamp' },
        ]"
        :items="transactionStore.transactions"
        class="elevation-1"
        item-value="id"
      />
    </v-card>

    <!-- 📝 Transaction Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>
          {{ editingTransaction?.id ? "Edit" : "Add" }} Transaction
        </v-card-title>
        <!-- <v-card-text>
          <v-text-field
            v-model="editingTransaction.vehicle_number"
            label="Vehicle Number"
          />
          <v-text-field
            v-model="editingTransaction.amount"
            type="number"
            label="Amount"
          />
        </v-card-text> -->
        <!-- <v-text-field
          v-model="editingTransaction.attendant_id"
          label="Attendant ID"
        />
        <v-text-field
          v-model="editingTransaction.station_id"
          label="Station ID"
        />
        <v-text-field
          v-model="editingTransaction.amount"
          type="number"
          label="Amount"
        />
        <v-text-field
          v-model="editingTransaction.liters_sold"
          type="number"
          label="Liters Sold"
        />
        <v-text-field
          v-model="editingTransaction.fuel_type_id"
          label="Fuel Type ID"
        /> -->
        <v-text-field
          v-model="editingTransaction.attendant_id"
          label="Attendant ID"
          type="number"
        />
        <v-text-field
          v-model="editingTransaction.station_id"
          label="Station ID"
          type="number"
        />
        <v-text-field
          v-model="editingTransaction.amount"
          label="Amount ($)"
          type="number"
        />
        <v-text-field
          v-model="editingTransaction.liters_sold"
          label="Liters Sold"
          type="number"
        />
        <v-text-field
          v-model="editingTransaction.fuel_type_id"
          label="Fuel Type ID"
          type="number"
        />
        <v-text-field
          v-model="editingTransaction.license_plate"
          label="License Plate"
          type="text"
        />
        <v-card-actions>
          <v-btn color="gray" @click="showModal = false">
            <XIcon class="mr-2" /> Cancel
          </v-btn>
          <v-btn color="blue" @click="saveTransaction">
            <CheckIcon class="mr-2" /> Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
