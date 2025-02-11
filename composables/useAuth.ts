import { useNuxtApp } from "nuxt/app";
import { useRouter } from "vue-router";

const useAuth = () => {
  const { $supabase } = useNuxtApp() as unknown as { $supabase: any };
  const router = useRouter();

  // Login user with email & password
  const login = async (email: string, password: string) => {
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return { error };
    }

    return { data };
  };

  // Register new user with email & password
  const register = async (email: string, password: string) => {
    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Registration failed:", error.message);
      return { error };
    }

    return { data };
  };

  const getUserProfile = async () => {
    const { data: user, error } = await $supabase.auth.getUser();
    if (error) return null;

    const { data: profile } = await $supabase
      .from("users")
      .select("*")
      .eq("id", user.user.id)
      .single();

    return profile;
  };

  const logout = async () => {
    await $supabase.auth.signOut();
    router.push("/login");
  };

  return { getUserProfile, logout, login, register };
};

export default useAuth;
