import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";

export const useFuelTypeStore = defineStore("fuelTypes", {
  state: () => ({
    fuelTypes: [] as any[], // List of fuel types
  }),

  actions: {
    // Fetch all fuel types
    async fetchFuelTypes() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/fuelTypes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fuel Types fetched:", data);
        this.fuelTypes = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching fuel types:", error);
        return {
          error: error.response?.data?.message || "Failed to fetch fuel types.",
        };
      }
    },

    // Add a new fuel type
    async addFuelType(fuelType: { name: string; price_per_liter: number }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (!fuelType.name || fuelType.price_per_liter <= 0) {
          throw new Error("Both name and valid price per liter are required.");
        }

        const { data } = await axios.post("/api/fuelTypes", fuelType, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fuel Type added:", data);
        this.fuelTypes.unshift(data);
        return { success: true, message: "Fuel Type added successfully." };
      } catch (error) {
        console.error("Error adding fuel type:", error);
        return {
          error: error.response?.data?.message || "Failed to add fuel type.",
        };
      }
    },

    // Update a fuel type
    async updateFuelType(updatedFuelType: {
      id: number;
      name: string;
      price_per_liter: number;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (!updatedFuelType.name || updatedFuelType.price_per_liter <= 0) {
          throw new Error("Both name and valid price per liter are required.");
        }

        await axios.put(
          `/api/fuelTypes/${updatedFuelType.id}`,
          updatedFuelType,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const index = this.fuelTypes.findIndex(
          (ft) => ft.id === updatedFuelType.id
        );
        if (index !== -1) this.fuelTypes[index] = updatedFuelType;

        console.log("Fuel Type updated:", updatedFuelType);
        return { success: true, message: "Fuel Type updated successfully." };
      } catch (error) {
        console.error("Error updating fuel type:", error);
        return {
          error: error.response?.data?.message || "Failed to update fuel type.",
        };
      }
    },

    // Delete a fuel type
    async deleteFuelType(id: number) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        await axios.delete(`/api/fuelTypes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fuelTypes = this.fuelTypes.filter((ft) => ft.id !== id);
        console.log("Fuel Type deleted:", id);
        return { success: true, message: "Fuel Type deleted successfully." };
      } catch (error) {
        console.error("Error deleting fuel type:", error);
        return {
          error: error.response?.data?.message || "Failed to delete fuel type.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFuelTypeStore, import.meta.hot));
}
