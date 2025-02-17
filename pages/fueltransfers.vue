<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Transfer
      </v-btn>
      <v-btn color="blue" @click="exportTransfers">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Fuel Transfers Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Fuel Transfers </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredTransfers"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true, perPage: 5 }"
      >
        <template v-slot:table-row="{ column, row }">
          <!-- Actions Column -->
          <span v-if="column.field === 'actions'">
            <v-btn small icon color="blue" @click="openModal(row)">
              <EditIcon />
            </v-btn>
            <v-btn small icon color="red" @click="deleteTransfer(row.id)">
              <TrashIcon />
            </v-btn>
          </span>

          <!-- Waybill Column with Download Link -->
          <span v-else-if="column.field === 'waybill'">
            <a v-if="row.waybill" :href="row.waybill" download target="_blank">
              📄 Download
            </a>
            <span v-else>No Waybill</span>
          </span>
        </template>
      </vue-good-table>
    </v-card>

    <!-- Modal Component -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="editingTransfer.id">Edit Transfer</span>
          <span v-else>Add Transfer</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingTransfer.tanker"
              label="Tanker"
              required
            />
            <v-text-field
              v-model="editingTransfer.litresLoaded"
              label="Litres Loaded"
              required
            />
            <v-text-field
              v-model="editingTransfer.litresOffloaded"
              label="Litres Offloaded"
              required
            />
            <v-text-field
              v-model="editingTransfer.station"
              label="Station"
              required
            />

            <!-- Upload New Waybill -->
            <v-file-input
              label="Upload Waybill"
              prepend-icon="mdi-file-upload"
              @change="handleFileUpload"
              accept=".pdf,.doc,.docx"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveTransfer">Save</v-btn>
          <v-btn color="red" @click="showModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "vue-tabler-icons";

const toast = useToast();

// State
const searchQuery = ref("");
const showModal = ref(false);
const editingTransfer = ref<any>(null);
const submitted = ref(false);

// Dummy data for fuel transfers
const fuelTransfers = ref([
  {
    id: 1,
    date: "2021-09-01",
    tanker: "Tanker 1",
    litresLoaded: 5000,
    litresOffloaded: 4800,
    station: "Alpha Fuel Station",
    waybill: "waybill1.pdf",
    destination: "Beta Gas Station",
  },
  {
    id: 2,
    date: "2023-01-04",
    tanker: "Tanker 2",
    litresLoaded: 7000,
    litresOffloaded: 6800,
    station: "Beta Gas Station",
    waybill: "waybill2.pdf",
    destination: "Gamma Oil Depot",
  },
  {
    id: 3,
    date: "2025-07-03",
    tanker: "Tanker 3",
    litresLoaded: 6000,
    litresOffloaded: 5900,
    station: "Gamma Oil Depot",
    waybill: "",
    destination: "Epsilon Oil Depot",
  },
]);

// Table columns
const columns = ref([
  { label: "Date", field: "date" },
  { label: "Tanker", field: "tanker" },
  { label: "Litres Loaded", field: "litresLoaded" },
  { label: "Litres Offloaded", field: "litresOffloaded" },
  { label: "Station", field: "station" },
  { label: "Destination", field: "destination" },
  { label: "Assigned Waybill", field: "waybill" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered fuel transfers
const filteredTransfers = computed(() => {
  let filtered = fuelTransfers.value;
  if (searchQuery.value) {
    filtered = filtered.filter((transfer) =>
      transfer.tanker.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (transfer = null) => {
  editingTransfer.value = transfer
    ? { ...transfer }
    : {
        id: null,
        date: "",
        tanker: "",
        litresLoaded: "",
        litresOffloaded: "",
        station: "",
        destination: "",
        waybill: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Handle file upload
const handleFileUpload = (event: any) => {
  if (event && event.length > 0) {
    const file = event[0];
    const fileURL = URL.createObjectURL(file);
    editingTransfer.value.waybill = fileURL; // Simulating file storage
  }
};

// Save transfer
const saveTransfer = () => {
  if (editingTransfer.value.id) {
    const index = fuelTransfers.value.findIndex(
      (t) => t.id === editingTransfer.value.id
    );
    if (index !== -1) {
      fuelTransfers.value[index] = { ...editingTransfer.value };
    }
  } else {
    editingTransfer.value.id = fuelTransfers.value.length + 1;
    fuelTransfers.value.push({ ...editingTransfer.value });
  }
  showModal.value = false;
  toast.success("Fuel transfer saved successfully!");
};

// Export transfers (Mock)
const exportTransfers = () => {
  console.log("Exporting transfers:", fuelTransfers.value);
  toast.info("Fuel transfers exported (mock function).");
};

// Delete transfer
const deleteTransfer = (id: number) => {
  fuelTransfers.value = fuelTransfers.value.filter((t) => t.id !== id);
  toast.success("Fuel transfer deleted successfully!");
};
</script>
