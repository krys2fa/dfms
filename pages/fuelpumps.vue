<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Pump
      </v-btn>
      <v-btn color="blue" @click="exportPumps">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Fuel Pumps Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Fuel Pumps </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredPumps"
        :search-options="{ enabled: true }"
        :pagination-options="{
          enabled: true,
          perPage: 5,
        }"
      >
        <template v-slot:table-row="{ column, row }">
          <span v-if="column.field === 'actions'">
            <v-btn small icon color="blue" @click="openModal(row)">
              <EditIcon />
            </v-btn>
            <v-btn small icon color="red" @click="deletePump(row.id)">
              <TrashIcon />
            </v-btn>
          </span>
        </template>
      </vue-good-table>
    </v-card>

    <!-- Modal Component -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="editingPump.id">Edit Pump</span>
          <span v-else>Add Pump</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingPump.name"
              label="Pump Name"
              required
            />
            <v-text-field v-model="editingPump.type" label="Type" required />
            <v-text-field
              v-model="editingPump.station"
              label="Station"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="savePump">Save</v-btn>
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
const editingPump = ref<any>(null);
const submitted = ref(false);

// Dummy data for fuel pumps
const fuelPumps = ref([
  { id: 1, name: "Pump 1", type: "Diesel", station: "Alpha Fuel Station" },
  { id: 2, name: "Pump 2", type: "Petrol", station: "Beta Gas Station" },
  { id: 3, name: "Pump 3", type: "Kerosene", station: "Gamma Oil Depot" },
  { id: 4, name: "Pump 4", type: "Diesel", station: "Delta Fuel Station" },
  { id: 5, name: "Pump 5", type: "Petrol", station: "Epsilon Gas Station" },
  { id: 6, name: "Pump 6", type: "Kerosene", station: "Zeta Oil Depot" },
]);

// Table columns
const columns = ref([
  { label: "Pump Name", field: "name" },
  { label: "Type", field: "type" },
  { label: "Station", field: "station" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered fuel pumps
const filteredPumps = computed(() => {
  let filtered = fuelPumps.value;
  if (searchQuery.value) {
    filtered = filtered.filter((pump) =>
      pump.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (pump = null) => {
  editingPump.value = pump
    ? { ...pump }
    : {
        id: null,
        name: "",
        type: "",
        station: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save pump
const savePump = () => {
  if (editingPump.value.id) {
    const index = fuelPumps.value.findIndex(
      (p) => p.id === editingPump.value.id
    );
    if (index !== -1) {
      fuelPumps.value[index] = { ...editingPump.value };
    }
  } else {
    editingPump.value.id = fuelPumps.value.length + 1;
    fuelPumps.value.push({ ...editingPump.value });
  }
  showModal.value = false;
  toast.success("Pump saved successfully!");
};

// Export fuel pumps (Mock)
const exportPumps = () => {
  console.log("Exporting fuel pumps:", fuelPumps.value);
  toast.info("Fuel pumps exported (mock function).");
};

// Delete fuel pump
const deletePump = (id: number) => {
  fuelPumps.value = fuelPumps.value.filter((p) => p.id !== id);
  toast.success("Pump deleted successfully!");
};
</script>
