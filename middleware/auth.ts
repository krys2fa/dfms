// import { defineStore } from "pinia";

// // Define or import the User type
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     user: null as any,
//   }),

//   actions: {
//     async fetchUser() {
//       // fetch user logic
//     },

//     async signOut() {
//       this.user = null;
//     },

//     setUser(user: any) {
//       this.user = user;
//     },
//   },
// });

import { useSupabase } from "../composables/useSupabase";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { supabase } = useSupabase();
  const { data: user } = await supabase.auth.getUser();

  if (
    !user?.user &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register"
  ) {
    return navigateTo("/auth/login");
  }
});
