import { defineStore } from "pinia";
import axios from "axios";

export const useStationStore = defineStore("stations", {
  state: () => ({
    stations: [] as any[], // List of stations
  }),

  actions: {
    // Fetch all stations
    async fetchStations() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/stations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Stations fetched:", data);
        this.stations = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching stations:", error);
        return {
          error: error.response?.data?.message || "Failed to fetch stations.",
        };
      }
    },

    // Add a new station
    async addStation(station: {
      name: string;
      location: string;
      owner_id: string;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        // Validate required fields
        if (!station.name || !station.location || !station.owner_id) {
          throw new Error("All fields (name, location, owner) are required.");
        }

        const { data } = await axios.post("/api/stations", station, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Station added:", data);
        this.stations.unshift(data);
        return { success: true, message: "Station added successfully." };
      } catch (error) {
        console.error("Error adding station:", error);
        return {
          error: error.response?.data?.message || "Failed to add station.",
        };
      }
    },

    // Update a station
    async updateStation(updatedStation: {
      id: number;
      name: string;
      location: string;
      owner_id: string;
    }) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        if (
          !updatedStation.name ||
          !updatedStation.location ||
          !updatedStation.owner_id
        ) {
          throw new Error("All fields (name, location, owner) are required.");
        }

        await axios.put(`/api/stations/${updatedStation.id}`, updatedStation, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const index = this.stations.findIndex(
          (s) => s.id === updatedStation.id
        );
        if (index !== -1) this.stations[index] = updatedStation;

        console.log("Station updated:", updatedStation);
        return { success: true, message: "Station updated successfully." };
      } catch (error) {
        console.error("Error updating station:", error);
        return {
          error: error.response?.data?.message || "Failed to update station.",
        };
      }
    },

    // Delete a station
    async deleteStation(id: number) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        await axios.delete(`/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.stations = this.stations.filter((s) => s.id !== id);
        console.log("Station deleted:", id);
        return { success: true, message: "Station deleted successfully." };
      } catch (error) {
        console.error("Error deleting station:", error);
        return {
          error: error.response?.data?.message || "Failed to delete station.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot));
}
