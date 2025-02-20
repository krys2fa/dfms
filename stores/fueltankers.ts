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
      stationId: string;
    }) {
      console.log("🚀 ~ fueltanker:", fueltanker);
      // return;
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        // Validate required fields
        if (
          !fueltanker.name ||
          !fueltanker.capacity ||
          !fueltanker.licensePlate ||
          !fueltanker.stationId
        ) {
          throw new Error(
            "All fields (name, capacity, license plate, station) are required."
          );
        }

        console.log("fuel", fueltanker);

        const response = await axios.post("/api/fueltankers", fueltanker, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("🚀 ~ res:", response);
        // return;
        if (response?.data?.data) {
          this.fueltankers.unshift(response?.data?.data);
        }

        console.log("out", response?.data?.success);

        return response?.data?.success ? { status: true } : { status: false };
      } catch (error) {
        console.error("Error adding fuel tanker:", error);
        return {
          error: error.response?.data?.message || "Failed to add fuel tanker.",
        };
      }
    },

    // Update a tanker
    async updateTanker(updatedTanker: {
      id: string;
      name: string;
      capacity: number;
      licensePlate: string;
      stationId: string;
    }) {
      console.log("updatedTanker", updatedTanker);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (
          !updatedTanker.name ||
          !updatedTanker.capacity ||
          !updatedTanker.licensePlate ||
          !updatedTanker.stationId
        ) {
          throw new Error(
            "All fields (name, capacity, license plate, station) are required."
          );
        }

        const response = await axios.put(`/api/fueltankers/`, updatedTanker, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Updated Tanker:", updatedTanker);
        console.log("Token:", token);
        console.log("URL:", `/api/fueltankers/${updatedTanker.id}`);

        console.log("🚀 ~ response:", response);
        // return;

        // Update the local store state
        if (response?.data?.success) {
          const index = this.fueltankers.findIndex(
            (tanker) => tanker.id === updatedTanker.id
          );
          if (index !== -1)
            this.fueltankers[index] = {
              ...this.fueltankers[index],
              ...updatedTanker,
            };
        }

        console.log("out", response?.data?.success);

        return response?.data?.success ? { status: true } : { status: false };
      } catch (error) {
        console.error("Error updating tanker:", error);
        return {
          error: error.response?.data?.message || "Failed to update tanker.",
        };
      }
    },

    async deleteTanker(id: string) {
      try {
        console.log("🚀 ~ deleteTanker ~ id:", id);

        if (!id) throw new Error("Tanker ID is required.");

        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.delete(`/api/fueltankers?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🚀 ~ deleteTanker ~ response:", response);

        if (!response.data.success) {
          throw new Error(
            response.data.error || "Failed to delete fuel tanker."
          );
        }

        // Update store state by filtering out the deleted tanker
        this.fueltankers = this.fueltankers.filter(
          (tanker) => tanker.id !== id
        );

        console.log("🚀 ~ Fuel tanker deleted:", id);
        return { success: true, message: "Fuel tanker deleted successfully." };
      } catch (error) {
        console.error("🚀 ~ Error deleting tanker:", error);

        return {
          success: false,
          error:
            error.response?.data?.error ||
            error.message ||
            "Failed to delete fuel tanker.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTankersStore, import.meta.hot));
}
