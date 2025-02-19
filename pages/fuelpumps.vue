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

    <!-- 📋 Filtered Pumps Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Pumps </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredPumps"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true, perPage: 5 }"
      >
        <template v-slot:table-row="{ column, row }">
          <span v-if="column.field === 'station'">
            {{ row.station }}
          </span>
          <span v-if="column.field === 'actions'">
            <v-btn small icon color="blue" @click="openModal(row)">
              <EditIcon />
            </v-btn>
            <v-btn small icon color="red" @click="confirmDelete(row.id)">
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
            <v-select
              v-model="editingPump.station"
              :items="stations"
              item-title="name"
              item-value="id"
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
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { usePumpStore } from "../stores/fuelpumps";
import { useStationStore } from "../stores/stations";
import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "vue-tabler-icons";

const toast = useToast();
const pumpStore = usePumpStore();
const stationStore = useStationStore();

const showModal = ref(false);
const editingPump = ref<any>({
  id: null,
  name: "",
  station: "",
});
const stations = ref<{ id: string; name: string }[]>([]);

// Fetch pumps and stations
onMounted(async () => {
  await pumpStore.fetchPumps();
  stations.value = await stationStore.fetchStations();
});

// Helper to map station ID to station name
const getStationName = (stationId: string) => {
  const station = stations.value.find((s) => s.id === stationId);
  return station ? station.name : "Unknown";
};

// Filtered pumps with correct station mapping
const filteredPumps = computed(() => {
  return pumpStore.fuelpumps.map((pump) => ({
    ...pump,
    station: getStationName(pump.stationId),
  }));
});

const openModal = (pump = null) => {
  editingPump.value = pump ? { ...pump } : { id: null, name: "", station: "" };
  showModal.value = true;
};

const savePump = async () => {
  if (!editingPump.value.name || !editingPump.value.station) {
    toast.error("All fields are required!");
    return;
  }
  try {
    const pumpData = {
      ...editingPump.value,
      stationId: editingPump.value.stationId, // Ensure correct key is used
    };
    if (editingPump.value.id) {
      await pumpStore.updatePump(pumpData);
      toast.success("Pump updated successfully!");
    } else {
      await pumpStore.addPump(pumpData);
      toast.success("Pump added successfully!");
    }
    showModal.value = false;
  } catch (error) {
    toast.error(error.message || "Failed to save pump.");
  }
};

const confirmDelete = async (id: number) => {
  if (confirm("Are you sure you want to delete this pump?")) {
    try {
      await pumpStore.deletePump(id);
      toast.success("Pump deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete pump.");
    }
  }
};

const exportPumps = () => {
  console.log("Exporting pumps:", pumpStore.pumps);
  toast.info("Pumps exported (mock function).");
};

const columns = ref([
  { label: "Pump Name", field: "name" },
  { label: "Station", field: "station" },
  { label: "Actions", field: "actions", sortable: false },
]);
</script>
