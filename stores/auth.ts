import { defineStore } from "pinia";
import useAuth from "../composables/useAuth";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    role: null as string | null, // Store user role
  }),

  actions: {
    async fetchUser() {
      const auth = useAuth();
      const userProfile = await auth.getUserProfile();

      if (userProfile) {
        this.user = userProfile;
        this.role = userProfile.role;

        // ✅ Store session data
        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(this.user));
          localStorage.setItem("userRole", this.role);
        }
      }
      return userProfile;
    },

    async login(email: string, password: string) {
      const auth = useAuth();
      const router = useRouter();
      const { data, role, error } = await auth.login(email, password);

      if (error) return { error };

      if (data) {
        console.log("Login successful");
        this.user = data.user;
        this.role = role;

        // ✅ Store user session & role in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(this.user));
          localStorage.setItem("userRole", this.role);
        }

        // Redirect user based on role
        if (role === "admin" || role === "superadmin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
      return { data, role };
    },

    async register(
      email: string,
      password: string,
      name: string,
      role: "user" | "admin" | "owner" | "superadmin",
      stationId?: string
    ) {
      const auth = useAuth();
      const router = useRouter();
      const { data, error } = await auth.register(
        email,
        password,
        name,
        role,
        stationId
      );

      if (error) return { error };

      if (data) {
        this.user = data.user;
        this.role = role;

        // ✅ Store session
        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(this.user));
          localStorage.setItem("userRole", this.role);
        }

        router.push("/dashboard");
      }
      return { data };
    },

    async signOut() {
      const auth = useAuth();
      const router = useRouter();
      await auth.logout();
      this.user = null;
      this.role = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("userSession");
        localStorage.removeItem("userRole");
      }
      router.push("/auth/login");
      return true;
    },

    // ✅ Check if session exists
    async checkSession() {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("userSession");
        const storedRole = localStorage.getItem("userRole");
        if (storedUser) {
          this.user = JSON.parse(storedUser);
          this.role = storedRole;
          return true;
        }
      }
      return false;
    },
  },
});
