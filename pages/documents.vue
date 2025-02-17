<template>
  <v-container>
    <v-row class="justify-end mb-4">
      <v-btn color="green" class="mr-2" @click="openModal">
        <PlusIcon class="mr-2" /> Add Document
      </v-btn>
      <v-btn color="blue" @click="exportDocuments">
        <FileExportIcon class="mr-2" /> Export
      </v-btn>
    </v-row>

    <!-- 📋 Fuel Documents Table -->
    <v-card class="mb-6">
      <v-card-title>
        <FilterIcon class="mr-2" /> Fuel Station Documents
      </v-card-title>
      <vue-good-table
        :columns="columns"
        :rows="filteredDocuments"
        :search-options="{ enabled: true }"
        :pagination-options="{
          enabled: true,
          perPage: 5,
        }"
      >
        <template v-slot:table-row="{ column, row }">
          <span v-if="column.field === 'documentFile'">
            <a
              v-if="row.documentFile"
              :href="row.documentFile"
              target="_blank"
              download
            >
              <v-btn small color="blue">
                <DownloadIcon class="mr-1" /> Download
              </v-btn>
            </a>
            <span v-else class="text-grey">No File</span>
          </span>

          <span v-if="column.field === 'actions'">
            <v-btn small icon color="blue" @click="openModal(row)">
              <EditIcon />
            </v-btn>
            <v-btn small icon color="red" @click="deleteDocument(row.id)">
              <TrashIcon />
            </v-btn>
          </span>
        </template>
      </vue-good-table>
    </v-card>

    <!-- 📂 Document Upload Modal -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="editingDocument.id">Edit Document</span>
          <span v-else>Add Document</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="editingDocument.type"
              :items="['Waybill', 'Receipt', 'Voucher']"
              label="Document Type"
              required
            />
            <v-text-field
              v-model="editingDocument.number"
              label="Document Number"
              required
            />
            <v-select
              v-model="editingDocument.station"
              :items="stations"
              item-title="name"
              item-value="name"
              label="Fuel Station"
              required
            />
            <v-text-field
              v-model="editingDocument.issuedBy"
              label="Issued By"
              required
            />
            <v-text-field
              v-model="editingDocument.date"
              label="Date Issued"
              type="date"
              required
            />

            <!-- File Upload -->
            <v-file-input
              label="Upload Document"
              accept=".pdf,.jpg,.png,.docx"
              @change="handleFileUpload"
            />
            <v-btn
              v-if="editingDocument.documentFile"
              small
              color="blue"
              class="mt-2"
              :href="editingDocument.documentFile"
              target="_blank"
              download
            >
              <DownloadIcon class="mr-1" /> View Uploaded File
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveDocument">Save</v-btn>
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
  DownloadIcon,
} from "vue-tabler-icons";

const toast = useToast();

// State
const showModal = ref(false);
const editingDocument = ref<any>(null);

// Dummy data for fuel stations
const stations = ref([
  { id: 1, name: "Alpha Fuel Station" },
  { id: 2, name: "Beta Gas Station" },
  { id: 3, name: "Gamma Oil Depot" },
]);

// Dummy data for documents
const documents = ref([
  {
    id: 1,
    type: "Waybill",
    number: "WB-2024-001",
    station: "Alpha Fuel Station",
    issuedBy: "Kofi Asamoah",
    date: "2025-02-10",
    documentFile: "https://www.example.com/docs/waybill-001.pdf",
  },
  {
    id: 2,
    type: "Receipt",
    number: "RC-2024-002",
    station: "Beta Gas Station",
    issuedBy: "Akosua Addo",
    date: "2025-02-12",
    documentFile: null,
  },
  {
    id: 3,
    type: "Voucher",
    number: "VC-2024-003",
    station: "Gamma Oil Depot",
    issuedBy: "Yaw Boateng",
    date: "2025-02-13",
    documentFile: "https://www.example.com/docs/voucher-003.png",
  },
]);

// Table columns
const columns = ref([
  { label: "Document Type", field: "type" },
  { label: "Document Number", field: "number" },
  { label: "Fuel Station", field: "station" },
  { label: "Issued By", field: "issuedBy" },
  { label: "Date Issued", field: "date" },
  { label: "File", field: "documentFile", sortable: false },
  { label: "Actions", field: "actions", sortable: false },
]);

// Computed property for filtering
const filteredDocuments = computed(() => documents.value);

// Open modal for adding/editing
const openModal = (document = null) => {
  editingDocument.value = document
    ? { ...document }
    : {
        id: null,
        type: "",
        number: "",
        station: "",
        issuedBy: "",
        date: new Date().toISOString().split("T")[0], // Default to today
        documentFile: null,
      };
  showModal.value = true;
};

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file); // Mock file storage
    editingDocument.value.documentFile = fileURL;
    toast.success("File uploaded successfully!");
  }
};

// Save document
const saveDocument = () => {
  if (editingDocument.value.id) {
    const index = documents.value.findIndex(
      (d) => d.id === editingDocument.value.id
    );
    if (index !== -1) {
      documents.value[index] = { ...editingDocument.value };
    }
  } else {
    editingDocument.value.id = documents.value.length + 1;
    documents.value.push({ ...editingDocument.value });
  }
  showModal.value = false;
  toast.success("Document saved successfully!");
};

// Delete document
const deleteDocument = (id) => {
  documents.value = documents.value.filter((d) => d.id !== id);
  toast.success("Document deleted successfully!");
};

// Export documents (Mock)
const exportDocuments = () => {
  console.log("Exporting documents:", documents.value);
  toast.info("Documents exported (mock function).");
};
</script>
