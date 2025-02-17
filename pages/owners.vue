<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Owner
      </v-btn>
      <v-btn color="blue" @click="exportOwners">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Fuel Station Owners Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Fuel Station Owners
      </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredOwners"
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
            <v-btn small icon color="red" @click="deleteOwner(row.id)">
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
          <span v-if="editingOwner.id">Edit Owner</span>
          <span v-else>Add Owner</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingOwner.name"
              label="Owner Name"
              required
            />
            <v-text-field
              v-model="editingOwner.company"
              label="Company Name"
              required
            />
            <v-select
              v-model="editingOwner.fuelStations"
              :items="stations"
              item-title="name"
              item-value="name"
              label="Owned Stations"
              multiple
              required
            />
            <v-text-field
              v-model="editingOwner.contact"
              label="Contact Number"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveOwner">Save</v-btn>
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
const editingOwner = ref<any>(null);
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

// Dummy data for fuel station owners
const owners = ref([
  {
    id: 1,
    name: "Kofi Mensah",
    company: "Mensah Energy Ltd.",
    fuelStations: ["Alpha Fuel Station", "Beta Gas Station"],
    contact: "+233 24 111 2222",
  },
  {
    id: 2,
    name: "Akosua Addo",
    company: "Akosua Oil Ventures",
    fuelStations: ["Gamma Oil Depot"],
    contact: "+233 20 333 4444",
  },
  {
    id: 3,
    name: "Yaw Boateng",
    company: "Boateng Fuel Services",
    fuelStations: ["Delta Fuel Station", "Epsilon Gas Station"],
    contact: "+233 55 555 6666",
  },
  {
    id: 4,
    name: "Ama Ofori",
    company: "Ofori Petroleum Ltd.",
    fuelStations: ["Zeta Oil Depot"],
    contact: "+233 50 777 8888",
  },
]);

// Table columns
const columns = ref([
  { label: "Owner Name", field: "name" },
  { label: "Company Name", field: "company" },
  { label: "Owned Stations", field: "fuelStations", type: "array" },
  { label: "Contact Number", field: "contact" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered owners
const filteredOwners = computed(() => {
  let filtered = owners.value;
  if (searchQuery.value) {
    filtered = filtered.filter((owner) =>
      owner.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (owner = null) => {
  editingOwner.value = owner
    ? { ...owner }
    : {
        id: null,
        name: "",
        company: "",
        fuelStations: [],
        contact: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save owner
const saveOwner = () => {
  if (editingOwner.value.id) {
    const index = owners.value.findIndex((o) => o.id === editingOwner.value.id);
    if (index !== -1) {
      owners.value[index] = { ...editingOwner.value };
    }
  } else {
    editingOwner.value.id = owners.value.length + 1;
    owners.value.push({ ...editingOwner.value });
  }
  showModal.value = false;
  toast.success("Owner saved successfully!");
};

// Export owners (Mock)
const exportOwners = () => {
  console.log("Exporting owners:", owners.value);
  toast.info("Owners exported (mock function).");
};

// Delete owner
const deleteOwner = (id: number) => {
  owners.value = owners.value.filter((o) => o.id !== id);
  toast.success("Owner deleted successfully!");
};
</script>
