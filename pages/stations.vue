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
        :pagination-options="{ enabled: true, perPage: 5 }"
      >
        <template v-slot:table-row="{ column, row }">
          <span v-if="column.field === 'owner'">
            {{ row.owner }}
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
            <v-select
              v-model="editingStation.owner"
              :items="owners"
              item-title="name"
              item-value="id"
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
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useStationStore } from "../stores/stations";
import { useUserStore } from "../stores/users";
import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "vue-tabler-icons";

const toast = useToast();
const stationStore = useStationStore();
const userStore = useUserStore();

const showModal = ref(false);
const editingStation = ref<any>({
  id: null,
  name: "",
  location: "",
  owner: "",
});
const owners = ref<{ id: string; name: string }[]>([]);

// Fetch stations and owners
onMounted(async () => {
  await stationStore.fetchStations();
  owners.value = await userStore.fetchUsersByRole("OWNER");
});

// Helper to map owner ID to owner name
const getOwnerName = (ownerId: string) => {
  const owner = owners.value.find((o) => o.id === ownerId);
  return owner ? owner.name : "Unknown";
};

// Filtered stations with correct owner mapping
const filteredStations = computed(() => {
  return stationStore.stations.map((station) => ({
    ...station,
    owner: getOwnerName(station.ownerId), // Instead of just station.ownerId
  }));
});
console.log("🚀 ~ filteredStations ~ filteredStations:", filteredStations);

const openModal = (station = null) => {
  editingStation.value = station
    ? { ...station }
    : { id: null, name: "", location: "", owner: "" };
  showModal.value = true;
};

const saveStation = async () => {
  if (
    !editingStation.value.name ||
    !editingStation.value.location ||
    !editingStation.value.owner
  ) {
    toast.error("All fields are required!");
    return;
  }
  try {
    const stationData = {
      ...editingStation.value,
      ownerId: editingStation.value.owner, // Ensure correct key is used
    };
    if (editingStation.value.id) {
      await stationStore.updateStation(stationData);
      toast.success("Station updated successfully!");
    } else {
      await stationStore.addStation(stationData);
      toast.success("Station added successfully!");
    }
    showModal.value = false;
  } catch (error) {
    toast.error(error.message || "Failed to save station.");
  }
};

const confirmDelete = async (id: number) => {
  if (confirm("Are you sure you want to delete this station?")) {
    try {
      await stationStore.deleteStation(id);
      toast.success("Station deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete station.");
    }
  }
};

const exportStations = () => {
  console.log("Exporting stations:", stationStore.stations);
  toast.info("Stations exported (mock function).");
};

const columns = ref([
  { label: "Station Name", field: "name" },
  { label: "Location", field: "location" },
  { label: "Owner", field: "owner" },
  { label: "Actions", field: "actions", sortable: false },
]);
</script>
