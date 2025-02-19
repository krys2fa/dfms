import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [] as any[],
  }),

  actions: {
    // Fetch all users
    async fetchUsers() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const { data } = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Users fetched:", data);
        this.users = data || [];
        return data;
      } catch (error) {
        console.error("Error fetching stations:", error);
        return {
          error: error.response?.data?.message || "Failed to fetch users.",
        };
      }
    },

    async fetchUsersByRole(role) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        // Send request with role query parameter
        const { data } = await axios.get(
          `/api/users?role=${encodeURIComponent(role)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          console.log(`Users fetched for role "${role}":`, data.data);
          this.users = data.data;
          return data.data;
        } else {
          console.warn(`No users found for role: ${role}`);
          this.users = [];
          return { error: data.message || `No users found for role: ${role}` };
        }
      } catch (error) {
        console.error("Error fetching users by role:", error);
        return {
          error:
            error.response?.data?.error || "Failed to fetch users by role.",
        };
      }
    },
  },
});

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot));
}
