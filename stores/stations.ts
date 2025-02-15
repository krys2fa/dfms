import { defineStore } from "pinia";
import { useNuxtApp } from "nuxt/app";

export const useStationStore = defineStore("stations", {
  state: () => ({
    stations: [] as any[],
  }),

  actions: {
    // Fetch all stations from the database
    async fetchStations() {
      const { $supabase } = useNuxtApp();
      const { data, error } = await $supabase
        .from("stations")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching stations:", error.message);
        return;
      }

      this.stations = data || [];
    },

    // Add a new station with validation
    async addStation(station: any) {
      const { $supabase } = useNuxtApp();

      // ✅ Validate required fields
      if (!station.name || !station.location || !station.owner_id) {
        console.error(
          "Error: All fields (name, location, owner) are required."
        );
        return { success: false, message: "All fields are required." };
      }

      const newStation = {
        name: station.name,
        location: station.location,
        owner_id: station.owner_id,
      };

      const { data, error } = await $supabase
        .from("stations")
        .insert([newStation])
        .select()
        .single();

      if (error) {
        console.error("Error adding station:", error.message);
        return { success: false, message: error.message };
      }

      this.stations.unshift(data);
      return { success: true, message: "Station added successfully." };
    },

    // Update a station's details
    async updateStation(updatedStation: any) {
      const { $supabase } = useNuxtApp();

      // ✅ Validate required fields
      if (
        !updatedStation.name ||
        !updatedStation.location ||
        !updatedStation.owner_id
      ) {
        console.error(
          "Error: All fields (name, location, owner) are required."
        );
        return { success: false, message: "All fields are required." };
      }

      const { error } = await $supabase
        .from("stations")
        .update({
          name: updatedStation.name,
          location: updatedStation.location,
          owner_id: updatedStation.owner_id,
        })
        .eq("id", updatedStation.id);

      if (error) {
        console.error("Error updating station:", error.message);
        return { success: false, message: error.message };
      }

      const index = this.stations.findIndex((s) => s.id === updatedStation.id);
      if (index !== -1) this.stations[index] = updatedStation;

      return { success: true, message: "Station updated successfully." };
    },

    // Delete a station
    async deleteStation(id: number) {
      const { $supabase } = useNuxtApp();
      const { error } = await $supabase.from("stations").delete().eq("id", id);

      if (error) {
        console.error("Error deleting station:", error.message);
        return { success: false, message: error.message };
      }

      this.stations = this.stations.filter((s) => s.id !== id);
      return { success: true, message: "Station deleted successfully." };
    },
  },
});
