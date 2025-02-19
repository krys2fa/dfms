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
        const response = await axios.post("/api/fuelpumps", pump);
        this.fuelpumps.push(response.data);
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
        const { data } = await axios.put(`/api/fuelpumps/`, updatedPump, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const index = this.fuelpumps.findIndex((p) => p.id === updatedPump.id);
        if (index !== -1) {
          this.fuelpumps[index] = { ...this.fuelpumps[index], ...data }; // ✅ Merge API response
        }

        this.fetchPumps();
      } catch (error) {
        console.error("Error updating pump:", error);
      }
    },

    async deletePump(id: string) {
      try {
        await axios.delete(`/api/fuelpumps/${id}`);
        this.fuelpumps = this.fuelpumps.filter((p) => p.id !== id);
      } catch (error) {
        console.error("Error deleting pump:", error);
      }
    },
  },
});
