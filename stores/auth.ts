import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as Record<string, any> | null, // User object
    name: null as string | null,
    role: null as string | null, // User role
    token: null as string | null, // JWT token
  }),

  actions: {
    async fetchUser() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return null;

        const { data } = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = data.user;
        this.role = data.user.role;
        return data.user;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },

    async login(email: string, password: string) {
      const router = useRouter();
      try {
        const { data } = await axios.post("/api/auth/login", {
          email,
          password,
        });

        // Store token and user data
        this.user = data.user;
        this.role = data.user.role;
        this.token = data.token;

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userSession", JSON.stringify(data.user));

        // Redirect based on role
        await router.push(
          data.user.role === "admin" ? "/admin/dashboard" : "/dashboard"
        );

        return data.user;
      } catch (error) {
        console.error("Login failed:", error);
        return { error: error.response?.data?.message || "Login failed" };
      }
    },

    async register(
      email: string,
      password: string,
      role: string,
      name: string,
      stationId?: string
    ) {
      const router = useRouter();
      try {
        const { data } = await axios.post("/api/auth/register", {
          email,
          password,
          role,
          name,
          stationId,
        });

        this.user = data.user;
        this.role = data.user.role;
        this.token = data.token;
        this.name = data.user.name;

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userSession", JSON.stringify(data.user));

        await router.push("/dashboard");
        return data.user;
      } catch (error) {
        console.error("Registration failed:", error);
        return {
          error: error.response?.data?.message || "Registration failed",
        };
      }
    },

    async signOut() {
      const router = useRouter();

      this.user = null;
      this.role = null;
      this.token = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("userSession");

      await router.push("/auth/login");
    },

    checkSession() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.token = token;
        return true;
      }
      return false;
    },
  },
});
