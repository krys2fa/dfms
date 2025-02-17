<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Station
      </v-btn>
      <v-btn color="blue" @click="exportStations">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Stations Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Stations </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredStations"
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
            <v-btn small icon color="red" @click="deleteStation(row.id)">
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
          <span v-if="editingStation.id">Edit Station</span>
          <span v-else>Add Station</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingStation.name"
              label="Station Name"
              required
            />
            <v-text-field
              v-model="editingStation.location"
              label="Location"
              required
            />
            <v-text-field
              v-model="editingStation.owner"
              label="Owner"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveStation">Save</v-btn>
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
const editingStation = ref<any>(null);
const submitted = ref(false);

// Dummy data for stations
const stations = ref([
  { id: 1, name: "Alpha Fuel Station", location: "Accra", owner: "John Doe" },
  { id: 2, name: "Beta Gas Station", location: "Kumasi", owner: "Jane Smith" },
  {
    id: 3,
    name: "Gamma Oil Depot",
    location: "Takoradi",
    owner: "Mark Johnson",
  },
  { id: 4, name: "Delta Fuel Station", location: "Tema", owner: "Alice Brown" },
  {
    id: 5,
    name: "Epsilon Gas Station",
    location: "Cape Coast",
    owner: "Bob White",
  },
  { id: 6, name: "Zeta Oil Depot", location: "Ho", owner: "Charlie Black" },
]);

// Table columns
const columns = ref([
  { label: "Station Name", field: "name" },
  { label: "Location", field: "location" },
  { label: "Owner", field: "owner" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered stations
const filteredStations = computed(() => {
  let filtered = stations.value;
  if (searchQuery.value) {
    filtered = filtered.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (station = null) => {
  editingStation.value = station
    ? { ...station }
    : {
        id: null,
        name: "",
        location: "",
        owner: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save station
const saveStation = () => {
  if (editingStation.value.id) {
    const index = stations.value.findIndex(
      (s) => s.id === editingStation.value.id
    );
    if (index !== -1) {
      stations.value[index] = { ...editingStation.value };
    }
  } else {
    editingStation.value.id = stations.value.length + 1;
    stations.value.push({ ...editingStation.value });
  }
  showModal.value = false;
  toast.success("Station saved successfully!");
};

// Export stations (Mock)
const exportStations = () => {
  console.log("Exporting stations:", stations.value);
  toast.info("Stations exported (mock function).");
};

// Delete station
const deleteStation = (id: number) => {
  stations.value = stations.value.filter((s) => s.id !== id);
  toast.success("Station deleted successfully!");
};
</script>
