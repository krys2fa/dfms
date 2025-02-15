import { useNuxtApp } from "nuxt/app";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { nextTick } from "vue";

const useAuth = () => {
  const { $supabase } = useNuxtApp() as unknown as { $supabase: any };
  const toast = useToast(); // Initialize toast notifications

  // Login user with email & password
  // const login = async (email: string, password: string) => {
  //   const { data, error } = await $supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     console.error("Login failed:", error.message);
  //     toast.error("Login failed: " + error.message);
  //     return { error };
  //   }

  //   toast.success("Login successful!");
  //   return { data };
  // };

  const login = async (email: string, password: string) => {
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed: " + error.message);
      return { error };
    }

    const user = data.user;
    if (!user) {
      toast.error("Login failed: No user found");
      return { error: "No user found" };
    }

    // Fetch user role from the database
    const { data: profile, error: profileError } = await $supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (profileError) {
      toast.error("User profile not found");
      return { error: "Profile not found" };
    }

    toast.success("Login successful!");
    return { data, role: profile.role };
  };

  // Register new user and store in "users" table
  // const register = async (
  //   email: string,
  //   password: string,
  //   name?: string,
  //   role?: string
  // ) => {
  //   const { data, error } = await $supabase.auth.signUp({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     console.error("Registration failed:", error.message);
  //     toast.error("Registration failed: " + error.message);
  //     return { error };
  //   }

  //   if (!data?.user) {
  //     toast.error("User creation failed");
  //     return { error: "User creation failed" };
  //   }

  //   // Insert user into "users" table
  //   const { error: profileError } = await $supabase.from("users").insert([
  //     {
  //       auth_id: data.user.id,
  //       email,
  //       name: name || null,
  //       role: role || "user",
  //       created_at: new Date().toISOString(),
  //     },
  //   ]);

  //   if (profileError) {
  //     console.error("Failed to insert user profile:", profileError.message);
  //     toast.error("Failed to save user profile");
  //     return { error: profileError };
  //   }

  //   toast.success("Registration successful!");
  //   return { data };
  // };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" | "owner" | "superadmin",
    stationId?: string // Only required for 'owner'
  ) => {
    try {
      // Register in Supabase Auth
      const { data, error } = await $supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error("Registration failed: " + error.message);
        return { error };
      }

      if (!data?.user) {
        toast.error("User creation failed");
        return { error: "User creation failed" };
      }

      const auth_id = data.user.id;

      // Insert user into "users" table
      const { error: profileError } = await $supabase.from("users").insert([
        {
          auth_id,
          email,
          name,
          role,
          station_id: stationId || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        await $supabase.auth.admin.deleteUser(auth_id);
        toast.error("Failed to save user profile");
        return { error: profileError };
      }

      toast.success("Registration successful!");
      return { data };
    } catch (err) {
      toast.error("An unexpected error occurred.");
      return { error: err };
    }
  };

  // Get logged-in user's profile
  const getUserProfile = async () => {
    const { data: authUser, error } = await $supabase.auth.getUser();
    if (error || !authUser?.user) {
      toast.error("Failed to fetch user profile");
      return null;
    }

    const { data: profile, error: profileError } = await $supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.user.id)
      .single();

    if (profileError) {
      toast.error("No profile found");
      return null;
    }

    return profile;
  };

  // Logout user
  // const logout = async () => {
  //   await $supabase.auth.signOut();
  //   toast.success("Logged out successfully!");
  // };

  const logout = async () => {
    await $supabase.auth.signOut();
    toast.success("Logged out successfully!");
  };

  return { getUserProfile, logout, login, register };
};

export default useAuth;
