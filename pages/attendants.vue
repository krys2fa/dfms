<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Attendant
      </v-btn>
      <v-btn color="blue" @click="exportAttendants">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Fuel Pump Attendants Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Fuel Attendants </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredAttendants"
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
            <v-btn small icon color="red" @click="deleteAttendant(row.id)">
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
          <span v-if="editingAttendant.id">Edit Attendant</span>
          <span v-else>Add Attendant</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editingAttendant.name"
              label="Attendant Name"
              required
            />
            <v-select
              v-model="editingAttendant.assignedStation"
              :items="stations"
              item-title="name"
              item-value="name"
              label="Assigned Station"
              required
            />
            <v-select
              v-model="editingAttendant.pumpNumber"
              :items="pumps"
              label="Pump Number"
              required
            />
            <v-text-field
              v-model="editingAttendant.contact"
              label="Contact Number"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveAttendant">Save</v-btn>
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
const editingAttendant = ref<any>(null);
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

// Dummy data for fuel pumps (each station has multiple pumps)
const pumps = ref(["Pump 1", "Pump 2", "Pump 3", "Pump 4", "Pump 5"]);

// Dummy data for fuel pump attendants
const attendants = ref([
  {
    id: 1,
    name: "Ama Boateng",
    assignedStation: "Alpha Fuel Station",
    pumpNumber: "Pump 1",
    contact: "+233 24 123 4567",
  },
  {
    id: 2,
    name: "Michael Ofori",
    assignedStation: "Beta Gas Station",
    pumpNumber: "Pump 2",
    contact: "+233 20 987 6543",
  },
  {
    id: 3,
    name: "Nana Asare",
    assignedStation: "Gamma Oil Depot",
    pumpNumber: "Pump 3",
    contact: "+233 55 333 7777",
  },
  {
    id: 4,
    name: "Esi Mensah",
    assignedStation: "Delta Fuel Station",
    pumpNumber: "Pump 4",
    contact: "+233 50 444 8888",
  },
  {
    id: 5,
    name: "Kwesi Agyeman",
    assignedStation: "Epsilon Gas Station",
    pumpNumber: "Pump 5",
    contact: "+233 26 999 1111",
  },
]);

// Table columns
const columns = ref([
  { label: "Attendant Name", field: "name" },
  { label: "Assigned Station", field: "assignedStation" },
  { label: "Pump Number", field: "pumpNumber" },
  { label: "Contact Number", field: "contact" },
  { label: "Actions", field: "actions", sortable: false },
]);

// Filtered attendants
const filteredAttendants = computed(() => {
  let filtered = attendants.value;
  if (searchQuery.value) {
    filtered = filtered.filter((attendant) =>
      attendant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (attendant = null) => {
  editingAttendant.value = attendant
    ? { ...attendant }
    : {
        id: null,
        name: "",
        assignedStation: "",
        pumpNumber: "",
        contact: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save attendant
const saveAttendant = () => {
  if (editingAttendant.value.id) {
    const index = attendants.value.findIndex(
      (a) => a.id === editingAttendant.value.id
    );
    if (index !== -1) {
      attendants.value[index] = { ...editingAttendant.value };
    }
  } else {
    editingAttendant.value.id = attendants.value.length + 1;
    attendants.value.push({ ...editingAttendant.value });
  }
  showModal.value = false;
  toast.success("Attendant saved successfully!");
};

// Export attendants (Mock)
const exportAttendants = () => {
  console.log("Exporting attendants:", attendants.value);
  toast.info("Attendants exported (mock function).");
};

// Delete attendant
const deleteAttendant = (id: number) => {
  attendants.value = attendants.value.filter((a) => a.id !== id);
  toast.success("Attendant deleted successfully!");
};
</script>
