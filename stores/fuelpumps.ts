import { defineStore } from "pinia";
import axios from "axios";

export const usePumpStore = defineStore("pump", {
  state: () => ({
    fuelpumps: [] as any[],
  }),
  actions: {
    async fetchPumps() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/fuelpumps", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.fuelpumps = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching fuel pumps:", error);
        return {
          error: error.response?.data?.message || "Failed to fetch stations.",
        };
      }
    },

    async addPump(pump: { name: string; stationId: string }) {
      try {
        console.log("pump", pump);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.post("/api/fuelpumps", pump, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response?.data?.data) {
          this.fuelpumps.unshift(response?.data?.data);
        }

        console.log("out", response?.data?.success);

        return response?.data?.success ? { status: true } : { status: false };
      } catch (error) {
        console.error("Error adding pump:", error);
      }
    },

    async updatePump(updatedPump: {
      id: string;
      name: string;
      stationId: string;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (!updatedPump.name || !updatedPump.stationId) {
          throw new Error("All fields (name, station) are required.");
        }
        const response = await axios.put(`/api/fuelpumps/`, updatedPump, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response?.data?.success) {
          const index = this.fuelpumps.findIndex(
            (p) => p.id === updatedPump.id
          );
          if (index !== -1) {
            this.fuelpumps[index] = {
              ...this.fuelpumps[index],
              ...updatedPump,
            }; // ✅ Merge API response
          }
        }
        console.log("out", response?.data?.success);

        return response?.data?.success ? { status: true } : { status: false };

        // this.fetchPumps();
      } catch (error) {
        console.error("Error updating pump:", error);
      }
    },

    async deletePump(id: string) {
      try {
        if (!id) throw new Error("Tanker ID is required.");

        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.delete(`/api/fuelpumps?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.success) {
          this.fuelpumps = this.fuelpumps.filter((p) => p.id !== id);
          console.log("🚀 ~ Fuel tanker deleted:", id);
          return { success: true };
        }

        throw new Error(response.data.error || "Failed to delete fuel pump.");
      } catch (error) {
        console.error("Error deleting pump:", error);
      }
    },
  },
});
