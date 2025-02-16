import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();
const endpoint =
  import.meta.env.VITE_API_BASE_URL !== "http://localhost:3000/api"
    ? ""
    : "/auth";

console.log("evn", import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://digital-fuel-system.netlify.app/.netlify/functions";

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

        const { data } = await axios.get(`${API_BASE_URL}${endpoint}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("data", data);

        this.user = data.user;
        this.role = data.user.role;
        return data.user;
      } catch (error) {
        console.error("Error fetching user:", error);
        toast("Error fetching user:", error);
        return null;
      }
    },

    async login(email: string, password: string) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}${endpoint}/login`, {
          email,
          password,
        });

        console.log("loge", data);
        console.log("evn", import.meta.env.VITE_API_BASE_URL);

        // Store token and user data
        this.user = data.user;
        this.role = data.user.role;
        this.token = data.token;

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userSession", JSON.stringify(data.user));

        return data;
      } catch (error) {
        console.error("Login failed:", error);
        toast("Login failed:", error);
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
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}${endpoint}/register`,
          {
            email,
            password,
            name,
            role,
            stationId,
          }
        );

        this.user = data.user;
        this.role = data.user.role;
        this.token = data.token;
        this.name = data.user.name;

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userSession", JSON.stringify(data.user));

        return data.user;
      } catch (error) {
        toast("Registration failed:", error);
        return {
          error: error.response?.data?.message || "Registration failed",
        };
      }
    },

    async signOut(router) {
      this.user = null;
      this.role = null;
      this.token = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("userSession");

      router.push("/auth/login");
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

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
