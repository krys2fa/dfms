import { defineStore } from "pinia";
import { useSupabase } from "../composables/useSupabase";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
  }),

  actions: {
    async fetchUser() {
      const { supabase } = useSupabase();
      const { data } = await supabase.auth.getUser();
      this.user = data?.user || null;
    },

    async signOut() {
      const { supabase } = useSupabase();
      await supabase.auth.signOut();
      this.user = null;
      return navigateTo("/login");
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
