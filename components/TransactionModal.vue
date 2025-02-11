<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import { useTransactionStore } from "../stores/transactions";

const props = defineProps(["transaction"]);
const emit = defineEmits(["close"]);
const transactionStore = useTransactionStore();

const transactionData = ref({
  id: null,
  vehicle_number: "",
  amount: "",
  timestamp: new Date().toLocaleString(),
});

// 🎯 Watch for changes when modal opens
watch(
  () => props.transaction,
  (newValue) => {
    if (newValue) {
      transactionData.value = { ...newValue };
    } else {
      transactionData.value = {
        id: null,
        vehicle_number: "",
        amount: "",
        timestamp: new Date().toLocaleString(),
      };
    }
  },
  { immediate: true }
);

// 💾 Save Transaction
const saveTransaction = () => {
  if (transactionData.value.id) {
    transactionStore.updateTransaction(transactionData.value);
  } else {
    transactionStore.addTransaction(transactionData.value);
  }
  emit("close");
};
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4">
        {{ transactionData.id ? "Edit" : "Add" }} Transaction
      </h2>

      <div class="space-y-3">
        <input
          v-model="transactionData.vehicle_number"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Vehicle Number"
        />
        <input
          v-model="transactionData.amount"
          type="number"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Amount"
        />
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ❌ Cancel
        </button>
        <button
          @click="saveTransaction"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save
        </button>
      </div>
    </div>
  </div>
</template>
