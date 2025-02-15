// import { defineStore } from "pinia";
// import { ref } from "vue";

// export const useTransactionStore = defineStore("transactions", () => {
//   const transactions = ref<any[]>([
//     {
//       id: 1,
//       vehicle_number: "AB-1234",
//       amount: 50,
//       timestamp: "2025-02-11 10:30 AM",
//     },
//     {
//       id: 2,
//       vehicle_number: "CD-5678",
//       amount: 75,
//       timestamp: "2025-02-11 11:15 AM",
//     },
//     // Add mock data or fetch from API
//   ]);

//   const addTransaction = (transaction: any) => {
//     transaction.id = transactions.value.length + 1;
//     transactions.value.unshift(transaction);
//   };

//   const updateTransaction = (updatedTransaction: any) => {
//     const index = transactions.value.findIndex(
//       (t) => t.id === updatedTransaction.id
//     );
//     if (index !== -1) transactions.value[index] = updatedTransaction;
//   };

//   const deleteTransaction = (id: number) => {
//     transactions.value = transactions.value.filter((t) => t.id !== id);
//   };

//   return { transactions, addTransaction, updateTransaction, deleteTransaction };
// });
import { defineStore } from "pinia";
import { useNuxtApp } from "nuxt/app";

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as any[],
  }),

  actions: {
    // async fetchTransactions() {
    //   const { $supabase } = useNuxtApp();
    //   const { data, error } = await $supabase
    //     .from("transactions")
    //     .select("*")
    //     .order("timestamp", { ascending: false });

    //   if (error) {
    //     console.error("Error fetching transactions:", error.message);
    //     return;
    //   }

    //   this.transactions = data || [];
    // },

    async fetchTransactions() {
      const { $supabase } = useNuxtApp();
      const { data, error } = await $supabase
        .from("transactions")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
        return;
      }

      this.transactions = data || [];
    },

    // async addTransaction(transaction: any) {
    //   const { $supabase } = useNuxtApp();
    //   const { data, error } = await $supabase
    //     .from("transactions")
    //     .insert([transaction])
    //     .select()
    //     .single();

    //   if (error) {
    //     console.error("Error adding transaction:", error.message);
    //     return;
    //   }

    //   this.transactions.unshift(data);
    // },

    // async addTransaction(transaction: any) {
    //   const { $supabase } = useNuxtApp();
    //   const { data, error } = await $supabase
    //     .from("transactions")
    //     .insert([
    //       {
    //         attendant_id: transaction.attendant_id,
    //         station_id: transaction.station_id,
    //         amount: transaction.amount,
    //         liters_sold: transaction.liters_sold,
    //         fuel_type_id: transaction.fuel_type_id,
    //         timestamp: new Date().toISOString(),
    //       },
    //     ])
    //     .select()
    //     .single();

    //   if (error) {
    //     console.error("Error adding transaction:", error.message);
    //     return;
    //   }

    //   this.transactions.unshift(data);
    // },

    async addTransaction(transaction: any) {
      const { $supabase } = useNuxtApp();

      // Ensure that only existing table columns are included
      const newTransaction = {
        attendant_id: transaction.attendant_id,
        station_id: transaction.station_id,
        amount: transaction.amount,
        liters_sold: transaction.liters_sold,
        fuel_type_id: transaction.fuel_type_id,
      };

      const { data, error } = await $supabase
        .from("transactions")
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        console.error("Error adding transaction:", error.message);
        return;
      }

      this.transactions.unshift(data);
    },

    // async updateTransaction(updatedTransaction: any) {
    //   const { $supabase } = useNuxtApp();
    //   const { error } = await $supabase
    //     .from("transactions")
    //     .update(updatedTransaction)
    //     .eq("id", updatedTransaction.id);

    //   if (error) {
    //     console.error("Error updating transaction:", error.message);
    //     return;
    //   }

    //   const index = this.transactions.findIndex(
    //     (t) => t.id === updatedTransaction.id
    //   );
    //   if (index !== -1) this.transactions[index] = updatedTransaction;
    // },

    async updateTransaction(updatedTransaction: any) {
      const { $supabase } = useNuxtApp();
      const { error } = await $supabase
        .from("transactions")
        .update({
          amount: updatedTransaction.amount,
          liters_sold: updatedTransaction.liters_sold,
          fuel_type_id: updatedTransaction.fuel_type_id,
        })
        .eq("id", updatedTransaction.id);

      if (error) {
        console.error("Error updating transaction:", error.message);
        return;
      }

      const index = this.transactions.findIndex(
        (t) => t.id === updatedTransaction.id
      );
      if (index !== -1) this.transactions[index] = updatedTransaction;
    },
    // async deleteTransaction(id: number) {
    //   const { $supabase } = useNuxtApp();
    //   const { error } = await $supabase
    //     .from("transactions")
    //     .delete()
    //     .eq("id", id);

    //   if (error) {
    //     console.error("Error deleting transaction:", error.message);
    //     return;
    //   }

    //   this.transactions = this.transactions.filter((t) => t.id !== id);
    // },

    async deleteTransaction(id: number) {
      const { $supabase } = useNuxtApp();
      const { error } = await $supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting transaction:", error.message);
        return;
      }

      this.transactions = this.transactions.filter((t) => t.id !== id);
    },
  },
});
