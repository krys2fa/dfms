<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Fuel Tanker
      </v-btn>
      <v-btn color="blue" @click="exportTankers">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Fuel Tankers Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Fuel Tankers </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredTankers"
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
            <v-btn small icon color="red" @click="deleteTanker(row.id)">
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
          <span v-if="editingTanker.id">Edit Fuel Tanker</span>
          <span v-else>Add Fuel Tanker</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingTanker.name"
              label="Tanker Name"
              required
            />
            <v-text-field
              v-model="editingTanker.capacity"
              label="Capacity"
              required
            />
            <v-text-field
              v-model="editingTanker.licensePlate"
              label="License Plate"
              required
            />
            <!-- <v-text-field
              v-model="editingTanker.assignedDriver"
              label="Assigned Driver"
              required
            /> -->
            <!-- <v-text-field
              v-model="editingTanker.assignedStation"
              label="Assigned Station"
              required
            /> -->
            <v-select
              v-model="editingTanker.station"
              :items="stations"
              item-title="name"
              item-value="id"
              label="Assigned Station"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveTanker">Save</v-btn>
          <v-btn color="red" @click="showModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useStationStore } from "../stores/stations";
import { useTankersStore } from "../stores/fueltankers";
import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "vue-tabler-icons";

const toast = useToast();
const stationStore = useStationStore();
const tankerStore = useTankersStore();

// State
const searchQuery = ref("");
const showModal = ref(false);
const editingTanker = ref<any>({
  id: null,
  name: "",
  capacity: "",
  licensePlate: "",
  station: "",
});
const submitted = ref(false);

// const owners = ref<{ id: string; name: string }[]>([]);
const stations = ref<{ id: string; name: string }[]>([]);

// Dummy data for fuel tankers
const fuelTankers = ref([
  {
    id: 1,
    name: "Tanker 1",
    capacity: "5000L",
    licensePlate: "ABC123",
    assignedDriver: "John Doe",
    assignedStation: "Alpha Fuel Station",
  },
  {
    id: 2,
    name: "Tanker 2",
    capacity: "7000L",
    licensePlate: "DEF456",
    assignedDriver: "Jane Smith",
    assignedStation: "Beta Gas Station",
  },
  {
    id: 3,
    name: "Tanker 3",
    capacity: "6000L",
    licensePlate: "GHI789",
    assignedDriver: "Mark Johnson",
    assignedStation: "Gamma Oil Depot",
  },
  {
    id: 4,
    name: "Tanker 4",
    capacity: "8000L",
    licensePlate: "JKL012",
    assignedDriver: "Alice Brown",
    assignedStation: "Delta Fuel Station",
  },
  {
    id: 5,
    name: "Tanker 5",
    capacity: "9000L",
    licensePlate: "MNO345",
    assignedDriver: "Bob White",
    assignedStation: "Epsilon Gas Station",
  },
  {
    id: 6,
    name: "Tanker 6",
    capacity: "10000L",
    licensePlate: "PQR678",
    assignedDriver: "Charlie Black",
    assignedStation: "Zeta Oil Depot",
  },
]);

// Table columns
const columns = ref([
  { label: "Tanker Name", field: "name" },
  { label: "Capacity", field: "capacity" },
  { label: "License Plate", field: "licensePlate" },
  // { label: "Assigned Driver", field: "assignedDriver" },
  { label: "Assigned Station", field: "station" },
  { label: "Actions", field: "actions", sortable: false },
]);

onMounted(async () => {
  await tankerStore.fetchTankers();
  stations.value = await stationStore.fetchStations();
});

const getStationName = (stationId: string) => {
  const station = stations.value.find((s) => s.id === stationId);
  return station ? station.name : "Unknown";
};

// Filtered fuel tankers
const filteredTankers = computed(() => {
  return tankerStore.fueltankers.map((tanker) => ({
    ...tanker,
    station: getStationName(tanker.stationId),
  }));
});

// Open modal for adding/editing
const openModal = (tanker = null) => {
  editingTanker.value = tanker
    ? { ...tanker }
    : {
        id: null,
        name: "",
        capacity: "",
        licensePlate: "",
        // assignedDriver: "",
        // assignedStation: "",
        station: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save tanker
// const saveTanker = () => {
//   if (editingTanker.value.id) {
//     const index = fuelTankers.value.findIndex(
//       (t) => t.id === editingTanker.value.id
//     );
//     if (index !== -1) {
//       fuelTankers.value[index] = { ...editingTanker.value };
//     }
//   } else {
//     editingTanker.value.id = fuelTankers.value.length + 1;
//     fuelTankers.value.push({ ...editingTanker.value });
//   }
//   showModal.value = false;
//   toast.success("Fuel Tanker saved successfully!");
// };

const saveTanker = async () => {
  if (
    !editingTanker.value.name ||
    !editingTanker.value.capacity ||
    !editingTanker.value.licensePlate ||
    !editingTanker.value.stationId
  ) {
    toast.error("All fields are required!");
    return;
  }
  try {
    const tankerData = {
      ...editingTanker.value,
      stationId: editingTanker.value.station, // Ensure correct key is used
    };

    if (editingTanker.value.id) {
      await tankerStore.updateTanker(tankerData);
      toast.success("Tanker updated successfully!");
    } else {
      await tankerStore.addTanker(tankerData);
      toast.success("Tanker added successfully!");
    }
    showModal.value = false;
  } catch (error) {
    toast.error(error.message || "Failed to save tanker.");
  }
};

// Export fuel tankers (Mock)
const exportTankers = () => {
  console.log("Exporting fuel tankers:", fuelTankers.value);
  toast.info("Fuel tankers exported (mock function).");
};

// Delete fuel tanker
const deleteTanker = (id: number) => {
  fuelTankers.value = fuelTankers.value.filter((t) => t.id !== id);
  toast.success("Fuel Tanker deleted successfully!");
};
</script>
