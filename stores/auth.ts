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
    },

    async login(email: string, password: string) {
      const auth = useAuth();
      const router = useRouter();
      const { data, error } = await auth.login(email, password);
      if (error) return { error };

      this.user = data.user;
      router.push("/dashboard");
      return { data };
    },

    async register(email: string, password: string) {
      const auth = useAuth();
      const router = useRouter();
      const { data, error } = await auth.register(email, password);
      if (error) return { error };

      this.user = data.user;
      router.push("/dashboard");
      return { data };
    },

    async signOut() {
      const auth = useAuth();
      await auth.logout();
      this.user = null;
    },
  },
});
