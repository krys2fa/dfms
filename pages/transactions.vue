<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useTransactionStore } from "../stores/transactions";
import { useRouter } from "vue-router";
import TransactionModal from "../components/TransactionModal.vue";

const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const router = useRouter();

const showModal = ref(false);
const editingTransaction = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;

onMounted(async () => {
  const hasSession = await authStore.checkSession();
  if (!hasSession) {
    router.push("/login");
  }
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return transactionStore.transactions.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < transactionStore.transactions.length) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const openModal = (transaction: any = null) => {
  editingTransaction.value = transaction;
  showModal.value = true;
};

const deleteTransaction = (id: number) => {
  transactionStore.deleteTransaction(id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <header class="flex justify-between items-center border-b pb-4 mb-4">
        <h1 class="text-2xl font-semibold text-gray-800">💳 Transactions</h1>
        <button
          @click="openModal()"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Transaction
        </button>
      </header>

      <!-- Transactions Table -->
      <div class="overflow-x-auto">
        <table class="w-full bg-gray-50 shadow-md rounded-lg">
          <thead class="bg-gray-200">
            <tr class="text-left">
              <th class="p-3">Vehicle</th>
              <th class="p-3">Amount</th>
              <th class="p-3">Timestamp</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="border-b">
              <td class="p-3">{{ transaction.vehicle_number }}</td>
              <td class="p-3">${{ transaction.amount }}</td>
              <td class="p-3">{{ transaction.timestamp }}</td>
              <td class="p-3 flex space-x-2">
                <button
                  @click="openModal(transaction)"
                  class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  @click="deleteTransaction(transaction.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          ⬅️ Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage * itemsPerPage >= transactionStore.transactions.length"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </div>

    <!-- Transaction Modal -->
    <TransactionModal v-if="showModal" :transaction="editingTransaction" @close="showModal = false" />
  </div>
</template>
