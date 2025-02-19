<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Sale
      </v-btn>
      <v-btn color="blue" @click="exportSales">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Fuel Sales Table -->
    <v-card class="mb-6">
      <v-card-title> <FilterIcon class="mr-2" /> Fuel Sales </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredSales"
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
            <v-btn small icon color="red" @click="deleteSale(row.id)">
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
          <span v-if="editingSale.id">Edit Sale</span>
          <span v-else>Add Sale</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <!-- <v-text-field
              v-model="editingSale.attendant"
              label="Attendant"
              required
            /> -->
            <v-select
              v-model="editingSale.attendant"
              :items="attendants"
              item-title="name"
              item-value="id"
              label="Attendant"
              required
            />
            <v-text-field
              v-model="editingSale.amount"
              label="Amount"
              required
            />
            <v-text-field
              v-model="editingSale.litersSold"
              label="Liters Sold"
              required
            />
            <v-text-field v-model="editingSale.pump" label="Pump" required />
            <v-text-field
              v-model="editingSale.receiptNumber"
              label="Receipt Number"
              required
            />
            <!-- <v-text-field
              v-model="editingSale.station"
              label="Station"
              required
            /> -->
            <v-select
              v-model="editingSale.station"
              :items="stations"
              item-title="name"
              item-value="id"
              label="Assigned Station"
              required
            />
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editingSale.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="editingSale.date"
                @input="dateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              ref="timeMenu"
              v-model="timeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editingSale.time"
                  label="Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-model="editingSale.time"
                @input="timeMenu = false"
              ></v-time-picker>
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveSale">Save</v-btn>
          <v-btn color="red" @click="showModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import {
  FileExportIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "vue-tabler-icons";
import { useStationStore } from "../stores/stations";
import { useUserStore } from "../stores/users";

const toast = useToast();
const stationStore = useStationStore();
const userStore = useUserStore();

// State
const searchQuery = ref("");
const showModal = ref(false);
const editingStation = ref<any>({
  id: null,
  amount: "",
  liters: "",
  attendantId: "",
  pumpId: "",
  receipt: "",
  createdAt: "",
});
const submitted = ref(false);
const dateMenu = ref(false);
const timeMenu = ref(false);

// Dummy data for fuel sales
const fuelSales = ref([
  {
    id: 1,
    attendant: "John Doe",
    amount: 100,
    litersSold: 50,
    pump: "Pump 1",
    receiptNumber: "12345",
    station: "Alpha Fuel Station",
    date: "2023-10-01",
    time: "10:00",
  },
  {
    id: 2,
    attendant: "Jane Smith",
    amount: 200,
    litersSold: 100,
    pump: "Pump 2",
    receiptNumber: "12346",
    station: "Beta Gas Station",
    date: "2023-10-01",
    time: "11:00",
  },
  {
    id: 3,
    attendant: "Mark Johnson",
    amount: 150,
    litersSold: 75,
    pump: "Pump 3",
    receiptNumber: "12347",
    station: "Gamma Oil Depot",
    date: "2023-10-01",
    time: "12:00",
  },
  {
    id: 4,
    attendant: "Alice Brown",
    amount: 250,
    litersSold: 125,
    pump: "Pump 4",
    receiptNumber: "12348",
    station: "Delta Fuel Station",
    date: "2023-10-01",
    time: "13:00",
  },
  {
    id: 5,
    attendant: "Bob White",
    amount: 300,
    litersSold: 150,
    pump: "Pump 5",
    receiptNumber: "12349",
    station: "Epsilon Gas Station",
    date: "2023-10-01",
    time: "14:00",
  },
  {
    id: 6,
    attendant: "Charlie Black",
    amount: 350,
    litersSold: 175,
    pump: "Pump 6",
    receiptNumber: "12350",
    station: "Zeta Oil Depot",
    date: "2023-10-01",
    time: "15:00",
  },
]);

// Table columns
const columns = ref([
  { label: "Attendant", field: "attendant" },
  { label: "Amount", field: "amount" },
  { label: "Liters Sold", field: "litersSold" },
  { label: "Pump", field: "pump" },
  { label: "Receipt Number", field: "receiptNumber" },
  { label: "Station", field: "station" },
  { label: "Date", field: "date" },
  { label: "Time", field: "time" },
  { label: "Actions", field: "actions", sortable: false },
]);

const attendants = ref<{ id: string; name: string }[]>([]);
onMounted(async () => {
  await stationStore.fetchStations();
  attendants.value = await userStore.fetchUsersByRole("ATTENDANT");
});

const getAttendantName = (attendantId: string) => {
  const attendant = attendants.value.find((o) => o.id === attendantId);
  return attendant ? attendant.name : "Unknown";
};

// Filtered fuel sales
const filteredSales = computed(() => {
  let filtered = fuelSales.value;
  if (searchQuery.value) {
    filtered = filtered.filter((sale) =>
      sale.attendant.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Open modal for adding/editing
const openModal = (sale = null) => {
  editingSale.value = sale
    ? { ...sale }
    : {
        id: null,
        attendant: "",
        amount: "",
        litersSold: "",
        pump: "",
        receiptNumber: "",
        station: "",
        date: "",
        time: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// Save sale
const saveSale = () => {
  if (editingSale.value.id) {
    const index = fuelSales.value.findIndex(
      (s) => s.id === editingSale.value.id
    );
    if (index !== -1) {
      fuelSales.value[index] = { ...editingSale.value };
    }
  } else {
    editingSale.value.id = fuelSales.value.length + 1;
    fuelSales.value.push({ ...editingSale.value });
  }
  showModal.value = false;
  toast.success("Sale saved successfully!");
};

// Export fuel sales (Mock)
const exportSales = () => {
  console.log("Exporting fuel sales:", fuelSales.value);
  toast.info("Fuel sales exported (mock function).");
};

// Delete sale
const deleteSale = (id: number) => {
  fuelSales.value = fuelSales.value.filter((s) => s.id !== id);
  toast.success("Sale deleted successfully!");
};
</script>
