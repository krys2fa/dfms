<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStationStore } from "../stores/stations";
import { useOwnerStore } from "../stores/owners";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
} from "vue-tabler-icons";

const authStore = useAuthStore();
const router = useRouter();
const stationStore = useStationStore();
const ownerStore = useOwnerStore();
const toast = useToast();

onMounted(async () => {
  try {
    const hasSession = await authStore.checkSession();
    if (!hasSession) {
      router.push("/auth/login");
      return;
    }
    await authStore.fetchUser();
    await stationStore.fetchStations();
    await ownerStore.fetchOwners();
  } catch (error) {
    toast.error("Error fetching data, please try again.");
  }
});

// State
const searchQuery = ref("");
const showModal = ref(false);
const editingStation = ref<any>(null);
const submitted = ref(false);

// 🔎 Filtered stations
const filteredStations = computed(() => {
  let stations = stationStore.stations;
  console.log("stations", stationStore.stations);
  if (searchQuery.value) {
    stations = stations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return stations;
});

// 🔄 Open modal for adding/editing
const openModal = (station = null) => {
  editingStation.value = station
    ? { ...station }
    : {
        id: null,
        name: "",
        location: "",
        owner_id: null,
      };
  submitted.value = false;
  showModal.value = true;
};

// ❌ Validate form fields
const isFormInvalid = computed(() => {
  return (
    !editingStation.value.name ||
    !editingStation.value.location ||
    !editingStation.value.owner_id
  );
});

// 💾 Save station with validation + toast notifications
const saveStation = async () => {
  submitted.value = true;

  if (isFormInvalid.value) {
    toast.warning("Please fill in all required fields.");
    return;
  }

  try {
    if (editingStation.value.id) {
      await stationStore.updateStation(editingStation.value);
      toast.success("Station updated successfully!");
    } else {
      await stationStore.addStation(editingStation.value);
      toast.success("Station added successfully!");
    }
    showModal.value = false;
  } catch (error) {
    toast.error("Error saving station. Please try again.");
  }
};

// ❌ Delete station with toast notification
const deleteStation = async (id: number) => {
  try {
    await stationStore.deleteStation(id);
    toast.success("Station deleted successfully!");
  } catch (error) {
    toast.error("Error deleting station. Please try again.");
  }
};

// 📤 Export stations (Mock)
const exportStations = () => {
  console.log("Exporting stations:", stationStore.stations);
  toast.info("Stations exported (mock function).");
};

const formattedStations = computed(() =>
  stationStore.stations.map((station) => ({
    ...station,
    owner:
      ownerStore.owners.find((o) => o.id === station.owner_id)?.name ||
      "Unknown",
  }))
);
</script>

<template>
  <v-container>
    <v-row class="align-center mb-4">
      <v-col cols="6">
        <v-text-field
          v-model="searchQuery"
          label="Search Station Name"
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>
    </v-row>

    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal()">
        <PlusIcon class="mr-2" /> Add Station
      </v-btn>
      <v-btn color="blue" @click="exportStations">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Stations Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Filtered Stations
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Station Name', value: 'name' },
          { text: 'Location', value: 'location' },
          { text: 'Owner', value: 'owner' },
          { text: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="filteredStations"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn small icon color="blue" @click="openModal(item)">
            <EditIcon />
          </v-btn>
          <v-btn small icon color="red" @click="deleteStation(item.id)">
            <TrashIcon />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 📜 Full Stations Table -->
    <v-card>
      <v-card-title>
        <FileExportIcon class="mr-2" /> All Stations
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Station Name', value: 'name' },
          { text: 'Location', value: 'location' },
          { text: 'Owner', value: 'owner' },
          { text: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="filteredStations"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn small icon color="blue" @click="openModal(item)">
            <EditIcon />
          </v-btn>
          <v-btn small icon color="red" @click="deleteStation(item.id)">
            <TrashIcon />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 📝 Station Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>
          {{ editingStation?.id ? "Edit" : "Add" }} Station
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editingStation.name" label="Station Name" />
          <p v-if="submitted && !editingStation.name" class="error">
            Name is required
          </p>

          <v-text-field v-model="editingStation.location" label="Location" />
          <p v-if="submitted && !editingStation.location" class="error">
            Location is required
          </p>

          <v-select
            v-model="editingStation.owner_id"
            :items="ownerStore.owners"
            item-title="name"
            item-value="id"
            label="Owner"
          />
          <p v-if="submitted && !editingStation.owner_id" class="error">
            Owner is required
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="showModal = false">
            <XIcon class="mr-2" /> Cancel
          </v-btn>
          <v-btn color="blue" @click="saveStation" :disabled="isFormInvalid">
            <CheckIcon class="mr-2" /> Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.error {
  color: red;
  font-size: 14px;
  margin-top: -10px;
}
</style>
