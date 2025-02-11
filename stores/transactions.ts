import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionStore = defineStore("transactions", () => {
  const transactions = ref<any[]>([
    { id: 1, vehicle_number: "AB-1234", amount: 50, timestamp: "2025-02-11 10:30 AM" },
    { id: 2, vehicle_number: "CD-5678", amount: 75, timestamp: "2025-02-11 11:15 AM" },
    // Add mock data or fetch from API
  ]);

  const addTransaction = (transaction: any) => {
    transaction.id = transactions.value.length + 1;
    transactions.value.unshift(transaction);
  };

  const updateTransaction = (updatedTransaction: any) => {
    const index = transactions.value.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) transactions.value[index] = updatedTransaction;
  };

  const deleteTransaction = (id: number) => {
    transactions.value = transactions.value.filter(t => t.id !== id);
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
});
