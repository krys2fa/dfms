import { defineStore } from "pinia";
import axios from "axios";

export const useSalesStore = defineStore("fuelsales", {
  state: () => ({
    fuelsales: [] as any[],
  }),

  actions: {
    // Fetch all sales
    async fetchSales() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/fuelsales", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fuelsales = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching fuel sales:", error);
        return {
          error: error.response?.data?.message || "Failed to fetch fuel sales.",
        };
      }
    },

    // Add a new station
    async addSale(fuelsale: {
      amount: number;
      liters: number;
      attendantId: string;
      pumpId: string;
      receipt: string;
      createdAt: datetime;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        // Validate required fields
        if (
          !fuelsale.id ||
          !fuelsale.amount ||
          !fuelsale.liters ||
          !fuelsale.attendantId ||
          !fuelsale.pumpId ||
          !fuelsale.receipt ||
          !fuelsale.createdAt
        ) {
          throw new Error(
            "All fields (id, amount, receipt, liters, pumpId, attendantId, createdAt) are required."
          );
        }

        const { data } = await axios.post("/api/fuelsales", fuelsale, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fuelsales.unshift(data);
        return { success: true, message: "Fuel sale added successfully." };
      } catch (error) {
        console.error("Error adding fuel sale:", error);
        return {
          error: error.response?.data?.message || "Failed to add fuel sale.",
        };
      }
    },

    // Update a station
    async updateSale(updatedSale: {
      id: string;
      amount: number;
      liters: number;
      attendantId: string;
      pumpId: string;
      receipt: string;
      createdAt: datetime;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (
          !updatedSale.id ||
          !updatedSale.amount ||
          !updatedSale.liters ||
          !updatedSale.attendantId ||
          !updatedSale.pumpId ||
          !updatedSale.receipt ||
          !updatedSale.createdAt
        ) {
          throw new Error("All fields (name, location, owner) are required.");
        }

        const response = await axios.put(`/api/fuelsales/`, updatedSale, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const index = this.fuelsales.findIndex((s) => s.id === updatedSale.id);
        if (index !== -1) this.fuelsales[index] = updatedSale;

        return { success: true, message: "Sale updated successfully." };
      } catch (error) {
        console.error("Error updating sale:", error);
        return {
          error: error.response?.data?.message || "Failed to update sale.",
        };
      }
    },

    // Delete a station
    async deleteSale(id: number) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        await axios.delete(`/api/fuelsales/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fuelsales = this.fuelsales.filter((s) => s.id !== id);
        console.log("Fuel sale deleted:", id);
        return { success: true, message: "Fuel sale deleted successfully." };
      } catch (error) {
        console.error("Error deleting sale:", error);
        return {
          error: error.response?.data?.message || "Failed to delete fuel sale.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalesStore, import.meta.hot));
}
