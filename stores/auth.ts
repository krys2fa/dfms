import { defineStore } from "pinia";
import useAuth from "../composables/useAuth";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    async fetchUser() {
      const auth = useAuth();
      this.user = await auth.getUserProfile();
      return this.user;
    },

    async login(email: string, password: string) {
      const auth = useAuth();
      const router = useRouter();
      const { data, error } = await auth.login(email, password);

      if (data) {
        console.log("Login successful");
        this.user = data.user;

        // ✅ Store user session in localStorage (Only in Browser)
        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(this.user));
        }

        return { data, error };
      }
    },

    async register(email: string, password: string) {
      const auth = useAuth();
      const router = useRouter();
      const { data, error } = await auth.register(email, password);
      if (error) return { error };

      this.user = data.user;

      // ✅ Store session
      if (typeof window !== "undefined") {
        localStorage.setItem("userSession", JSON.stringify(this.user));
      }

      router.push("/dashboard");
      return { data };
    },

    async signOut() {
      const auth = useAuth();
      const router = useRouter();
      await auth.logout();
      this.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("userSession");
      }
      router.push("/auth/login");
      return true
    },

    // ✅ Check if session exists
    async checkSession() {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("userSession");
        if (storedUser) {
          this.user = JSON.parse(storedUser);
          return true;
        }
      }
      return false;
    },
  },
});
