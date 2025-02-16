<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
  UploadIcon,
} from "vue-tabler-icons";
import { useAuthStore } from "../stores/auth";

// State
const searchQuery = ref("");
const dateRange = ref({ start: "", end: "" });
const showModal = ref(false);
const editingTransaction = ref<any>(null);
const selectedFile = ref<File | null>(null);

// Stores & Router
const authStore = useAuthStore();
const router = useRouter();

// Dummy data for tanker driver transactions
const transactions = ref([
  {
    id: 1,
    driver_name: "John Doe",
    tanker_number: "TNX-001",
    liters_offloaded: 5000,
    fuel_type: "Diesel",
    timestamp: "2025-02-14T10:00:00",
    document: null,
  },
  {
    id: 2,
    driver_name: "Jane Smith",
    tanker_number: "TNX-002",
    liters_offloaded: 3200,
    fuel_type: "Petrol",
    timestamp: "2025-02-13T15:30:00",
    document: null,
  },
  {
    id: 3,
    driver_name: "Mark Johnson",
    tanker_number: "TNX-003",
    liters_offloaded: 4500,
    fuel_type: "Kerosene",
    timestamp: "2025-02-12T08:15:00",
    document: null,
  },
]);

onMounted(async () => {
  console.log("Dummy data loaded");
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchUser();
});

// 🔎 Filtered transactions
const filteredDocuments = computed(() => {
  let filtered = transactions.value;

  // Search filter (by driver name or tanker number)
  if (searchQuery.value) {
    filtered = filtered.filter(
      (tx) =>
        tx.driver_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        tx.tanker_number.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Date range filter
  if (dateRange.value.start && dateRange.value.end) {
    filtered = filtered.filter((tx) => {
      const date = new Date(tx.timestamp);
      return (
        date >= new Date(dateRange.value.start) &&
        date <= new Date(dateRange.value.end)
      );
    });
  }

  return filtered;
});

// 🔄 Open modal for adding/editing
const openModal = (transaction = null) => {
  editingTransaction.value = transaction
    ? { ...transaction }
    : {
        id: null,
        driver_name: "",
        tanker_number: "",
        liters_offloaded: "",
        fuel_type: "",
        timestamp: new Date().toISOString(),
        document: null,
      };
  selectedFile.value = null;
  showModal.value = true;
};

// 📤 Handle File Upload
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
  }
};

// 💾 Save transaction
const saveTransaction = () => {
  if (selectedFile.value) {
    editingTransaction.value.document = selectedFile.value.name;
  }

  if (editingTransaction.value.id) {
    // Update existing
    const index = transactions.value.findIndex(
      (tx) => tx.id === editingTransaction.value.id
    );
    if (index !== -1) {
      transactions.value[index] = { ...editingTransaction.value };
    }
  } else {
    // Add new
    editingTransaction.value.id = transactions.value.length + 1;
    transactions.value.push({ ...editingTransaction.value });
  }
  showModal.value = false;
};

// ❌ Delete transaction
const deleteTransaction = (id: number) => {
  transactions.value = transactions.value.filter((tx) => tx.id !== id);
};

// 📤 Export transactions (Mock)
const exportTransactions = () => {
  console.log("Exporting transactions:", transactions.value);
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
          label="Search Document"
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
        <PlusIcon class="mr-2" /> Upload Document
      </v-btn>
      <v-btn color="blue" @click="exportTransactions">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Transactions Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Filtered Documents
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Driver Name', value: 'driver_name' },
          { text: 'Tanker Number', value: 'tanker_number' },
          { text: 'Liters Offloaded', value: 'liters_offloaded' },
          { text: 'Fuel Type', value: 'fuel_type' },
          { text: 'Date', value: 'timestamp' },
          { text: 'Document', value: 'document' },
          { text: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="filteredDocuments"
        item-value="id"
        class="elevation-1"
      >
        <template v-slot:item.timestamp="{ item }">
          {{ new Date(item.timestamp).toLocaleString() }}
        </template>

        <template v-slot:item.document="{ item }">
          <a
            v-if="item.document"
            :href="`/uploads/${item.document}`"
            target="_blank"
          >
            {{ item.document }}
          </a>
          <span v-else>No document</span>
        </template>

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

    <!-- 📝 Transaction Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>
          {{ editingTransaction?.id ? "Edit" : "Add" }} Record
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingTransaction.document_number"
            label="Receipt/Voucher/Waybill Number"
          />
          <v-select
            v-model="editingTransaction.document_type"
            label="Document Type"
            :items="['Waybill', 'Receipt', 'Voucher']"
            outlined
            dense
          />

          <v-text-field
            v-model="editingTransaction.timestamp"
            type="datetime-local"
            label="Date"
          />
          <v-file-input label="Upload Document" @change="handleFileUpload" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="showModal = false"
            ><XIcon class="mr-2" /> Cancel</v-btn
          >
          <v-btn color="blue" @click="saveTransaction"
            ><CheckIcon class="mr-2" /> Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
