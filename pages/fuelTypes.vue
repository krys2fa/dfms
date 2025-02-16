<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFuelTypeStore } from "../stores/fuelTypes";
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
const fuelTypeStore = useFuelTypeStore();
const toast = useToast();

onMounted(async () => {
  try {
    const hasSession = await authStore.checkSession();
    if (!hasSession) {
      router.push("/auth/login");
      return;
    }
    await authStore.fetchUser();
    // await fuelTypeStore.fetchFuelTypes();
  } catch (error) {
    toast.error("Error fetching data, please try again.");
  }
});

// State
const searchQuery = ref("");
const showModal = ref(false);
const editingFuelType = ref<any>(null);
const submitted = ref(false);

// 🔎 Filtered fuel types
const filteredFuelTypes = computed(() => {
  let fuelTypes = fuelTypeStore.fuelTypes;
  if (searchQuery.value) {
    fuelTypes = fuelTypes.filter((fuelType) =>
      fuelType.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return fuelTypes;
});

// 🔄 Open modal for adding/editing
const openModal = (fuelType = null) => {
  editingFuelType.value = fuelType
    ? { ...fuelType }
    : {
        id: null,
        name: "",
        description: "",
      };
  submitted.value = false;
  showModal.value = true;
};

// ❌ Validate form fields
const isFormInvalid = computed(() => {
  return !editingFuelType.value.name || !editingFuelType.value.description;
});

// 💾 Save fuel type with validation + toast notifications
const saveFuelType = async () => {
  submitted.value = true;

  if (isFormInvalid.value) {
    toast.warning("Please fill in all required fields.");
    return;
  }

  try {
    if (editingFuelType.value.id) {
      await fuelTypeStore.updateFuelType(editingFuelType.value);
      toast.success("Fuel type updated successfully!");
    } else {
      await fuelTypeStore.addFuelType(editingFuelType.value);
      toast.success("Fuel type added successfully!");
    }
    showModal.value = false;
  } catch (error) {
    toast.error("Error saving fuel type. Please try again.");
  }
};

// ❌ Delete fuel type with toast notification
const deleteFuelType = async (id: number) => {
  try {
    await fuelTypeStore.deleteFuelType(id);
    toast.success("Fuel type deleted successfully!");
  } catch (error) {
    toast.error("Error deleting fuel type. Please try again.");
  }
};

// 📤 Export fuel types (Mock)
const exportFuelTypes = () => {
  console.log("Exporting fuel types:", fuelTypeStore.fuelTypes);
  toast.info("Fuel types exported (mock function).");
};
</script>

<template>
  <v-container>
    <v-row class="align-center mb-4">
      <v-col cols="6">
        <v-text-field
          v-model="searchQuery"
          label="Search Fuel Type Name"
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>
    </v-row>

    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal()">
        <PlusIcon class="mr-2" /> Add Fuel Type
      </v-btn>
      <v-btn color="blue" @click="exportFuelTypes">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Filtered Fuel Types Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Filtered Fuel Types
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'Fuel Type Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="filteredFuelTypes"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn small icon color="blue" @click="openModal(item)">
            <EditIcon />
          </v-btn>
          <v-btn small icon color="red" @click="deleteFuelType(item.id)">
            <TrashIcon />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 📝 Fuel Type Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>
          {{ editingFuelType?.id ? "Edit" : "Add" }} Fuel Type
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editingFuelType.name" label="Fuel Type Name" />
          <p v-if="submitted && !editingFuelType.name" class="error">
            Name is required
          </p>

          <v-textarea
            v-model="editingFuelType.description"
            label="Description"
          />
          <p v-if="submitted && !editingFuelType.description" class="error">
            Description is required
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="showModal = false">
            <XIcon class="mr-2" /> Cancel
          </v-btn>
          <v-btn color="blue" @click="saveFuelType" :disabled="isFormInvalid">
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
