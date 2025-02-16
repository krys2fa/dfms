import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useFetch } from "#app";

export const useTransactionStore = defineStore("transactions", () => {
  const transactions = ref([]);
  const authStore = useAuthStore();

  // Fetch all transactions
  async function fetchTransactions() {
    const { data, error } = await useFetch("/api/transaction", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!error.value) transactions.value = data.value;
  }

  // Add a transaction
  async function addTransaction(transaction) {
    const { data, error } = await useFetch("/api/transaction", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: transaction,
    });

    if (!error.value) transactions.value.push(data.value);
  }

  // Update a transaction
  async function updateTransaction(transaction) {
    const { data, error } = await useFetch(
      `/api/transaction/${transaction.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: transaction,
      }
    );

    if (!error.value) {
      const index = transactions.value.findIndex(
        (tx) => tx.id === transaction.id
      );
      if (index !== -1) transactions.value[index] = data.value;
    }
  }

  // Delete a transaction
  async function deleteTransaction(id) {
    const { error } = await useFetch(`/api/transaction/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!error.value) {
      transactions.value = transactions.value.filter((tx) => tx.id !== id);
    }
  }

  return {
    transactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
