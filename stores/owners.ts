import { defineStore } from "pinia";
import { useNuxtApp } from "nuxt/app";

export const useOwnerStore = defineStore("owners", {
  state: () => ({
    owners: [] as any[],
  }),

  actions: {
    // Fetch all users who have the role 'owner'
    async fetchOwners() {
      const { $supabase } = useNuxtApp();
      const { data, error } = await $supabase
        .from("users")
        .select("*")
        .eq("role", "owner") // Only fetch users with role 'owner'
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching owners:", error.message);
        return;
      }

      this.owners = data || [];
    },
  },
});
