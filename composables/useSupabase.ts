import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    String(config.public.supabaseUrl),
    String(config.public.supabaseAnonKey)
  );

  const getUserProfile = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.user.id)
      .single();

    return profile;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { supabase, getUserProfile, logout };
};
