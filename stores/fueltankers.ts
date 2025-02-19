import { defineStore } from "pinia";
import axios from "axios";

export const useTankersStore = defineStore("fueltankers", {
  state: () => ({
    fueltankers: [] as any[],
  }),

  actions: {
    // Fetch all tankers
    async fetchTankers() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/fueltankers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fueltankers = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching fuel tankers:", error);
        return {
          error:
            error.response?.data?.message || "Failed to fetch fuel tankers.",
        };
      }
    },

    // Add a new station
    async addTanker(fueltanker: {
      name: string;
      capacity: number;
      licensePlate: string;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        // Validate required fields
        if (
          !fueltanker.name ||
          !fueltanker.capacity ||
          !fueltanker.licensePlate
        ) {
          throw new Error("All fields (name, location, owner) are required.");
        }

        const { data } = await axios.post("/api/fueltankers", fueltanker, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fueltankers.unshift(data);
        return { success: true, message: "Fuel tanker added successfully." };
      } catch (error) {
        console.error("Error adding fuel tanker:", error);
        return {
          error: error.response?.data?.message || "Failed to add fuel tanker.",
        };
      }
    },

    // Update a station
    async updateTanker(updatedTanker: {
      id: string;
      name: string;
      capacity: number;
      licensePlate: string;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (
          !updatedTanker.name ||
          !updatedTanker.capacity ||
          !updatedTanker.licensePlate
        ) {
          throw new Error("All fields (name, location, owner) are required.");
        }

        const response = await axios.put(`/api/fueltankers/`, updatedTanker, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const index = this.fueltankers.findIndex(
          (s) => s.id === updatedTanker.id
        );
        if (index !== -1) this.fueltankers[index] = updatedTanker;

        return { success: true, message: "Tanker updated successfully." };
      } catch (error) {
        console.error("Error updating station:", error);
        return {
          error: error.response?.data?.message || "Failed to update station.",
        };
      }
    },

    // Delete a station
    async deleteTanker(id: number) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        await axios.delete(`/api/fueltankers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fueltankers = this.fueltankers.filter((s) => s.id !== id);
        console.log("Fuel tanker deleted:", id);
        return { success: true, message: "Fuel tanker deleted successfully." };
      } catch (error) {
        console.error("Error deleting tanker:", error);
        return {
          error:
            error.response?.data?.message || "Failed to delete fuel tanker.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTankerStore, import.meta.hot));
}
