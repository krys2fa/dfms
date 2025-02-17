<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Driver
      </v-btn>
      <v-btn color="blue" @click="exportDrivers">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Tanker Drivers Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Tanker Drivers </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredDrivers"
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
            <v-btn small icon color="red" @click="deleteDriver(row.id)">
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
          <span v-if="editingDriver.id">Edit Driver</span>
          <span v-else>Add Driver</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingDriver.name"
              label="Driver Name"
              required
            />
            <v-text-field
              v-model="editingDriver.licenseNumber"
              label="License Number"
              required
            />
            <v-select
              v-model="editingDriver.assignedStation"
              :items="stations"
              item-title="name"
              item-value="name"
              label="Assigned Station"
              required
            />
            <v-text-field
              v-model="editingDriver.tankerNumber"
              label="Tanker Number"
              required
            />
            <v-text-field
              v-model="editingDriver.contact"
              label="Contact Number"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveDriver">Save</v-btn>
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
const editingDriver = ref<any>(null);
const submitted = ref(false);

// Dummy data for fuel stations
const stations = ref([
  { id: 1, name: "Alpha Fuel Station" },
  { id: 2, name: "Beta Gas Station" },
  { id: 3, name: "Gamma Oil Depot" },
  { id: 4, name: "Delta Fuel Station" },
  { id: 5, name: "Epsilon Gas Station" },
  { id: 6, name: "Zeta Oil Depot" },
]);

// Dummy data for tanker drivers
const drivers = ref([
  {
    id: 1,
    name: "Kwame Mensah",
    licenseNumber: "DL-1001",
    assignedStation: "Alpha Fuel Station",
    tankerNumber: "TN-001",
    contact: "+233 24 111 2222",
  },
  {
    id: 2,
    name: "Sarah Owusu",
    licenseNumber: "DL-1002",
    assignedStation: "Beta Gas Station",
    tankerNumber: "TN-002",
    contact: "+233 55 333 4444",
  },
  {
    id: 3,
    name: "John Boateng",
    licenseNumber: "DL-1003",
    assignedStation: "Gamma Oil Depot",
    tankerNumber: "TN-003",
    contact: "+233 20 555 6666",
  },
  {
    id: 4,
    name: "Mary Adu",
    licenseNumber: "DL-1004",
    assignedStation: "Delta Fuel Station",
    tankerNumber: "TN-004",
    contact: "+233 26 777 8888",
  },
  {
    id: 5,
    name: "Daniel Osei",
    licenseNumber: "DL-1005",
    assignedStation: "Epsilon Gas Station",
    tankerNumber: "TN-005",
    contact: "+233 50 999 0000",
  },
]);

// Table columns
const columns = ref([
  { label: "Driver Name", field: "name" },
  { label: "License Number", field: "licenseNumber" },
  { label: "Assigned Station", field: "assignedStation" },
  { label: "Tanker Number", field: "tankerNumber" },
  { label: "Contact Number", field: "contact" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered drivers
const filteredDrivers = computed(() => {
  let filtered = drivers.value;
  if (searchQuery.value) {
    filtered = filtered.filter((driver) =>
      driver.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (driver = null) => {
  editingDriver.value = driver
    ? { ...driver }
    : {
        id: null,
        name: "",
        licenseNumber: "",
        assignedStation: "",
        tankerNumber: "",
        contact: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save driver
const saveDriver = () => {
  if (editingDriver.value.id) {
    const index = drivers.value.findIndex(
      (d) => d.id === editingDriver.value.id
    );
    if (index !== -1) {
      drivers.value[index] = { ...editingDriver.value };
    }
  } else {
    editingDriver.value.id = drivers.value.length + 1;
    drivers.value.push({ ...editingDriver.value });
  }
  showModal.value = false;
  toast.success("Driver saved successfully!");
};

// Export drivers (Mock)
const exportDrivers = () => {
  console.log("Exporting drivers:", drivers.value);
  toast.info("Drivers exported (mock function).");
};

// Delete driver
const deleteDriver = (id: number) => {
  drivers.value = drivers.value.filter((d) => d.id !== id);
  toast.success("Driver deleted successfully!");
};
</script>
