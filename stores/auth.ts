import { defineStore } from "pinia";
import { supabase } from "../composables/useSupabase";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
  }),

  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser();
      this.user = data?.user || null;
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      return navigateTo("/login");
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
